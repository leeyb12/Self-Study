package com.pknu26.ecommerce.domain.analytics.service;

import com.pknu26.ecommerce.domain.analytics.dto.AnalyticsDto;
import com.pknu26.ecommerce.domain.analytics.entity.DailyAnalyticsSummary;
import com.pknu26.ecommerce.domain.analytics.entity.RfmScore;
import com.pknu26.ecommerce.domain.analytics.entity.BehaviorLog.ActionType;
import com.pknu26.ecommerce.domain.analytics.repository.BehaviorLogRepository;
import com.pknu26.ecommerce.domain.analytics.repository.DailyAnalyticsSummaryRepository;
import com.pknu26.ecommerce.domain.analytics.repository.RfmScoreRepository;
import com.pknu26.ecommerce.domain.member.entity.Member;
import com.pknu26.ecommerce.domain.member.repository.MemberRepository;
import com.pknu26.ecommerce.domain.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RfmService {

    private final RfmScoreRepository rfmScoreRepository;
    private final DailyAnalyticsSummaryRepository dailySummaryRepository;
    private final OrderRepository orderRepository;
    private final MemberRepository memberRepository;
    private final BehaviorLogRepository behaviorLogRepository;

    // ─── RFM ───────────────────────────────────────────────────────

    public AnalyticsDto.RfmScoreResponse getMemberRfm(Long memberId) {
        return rfmScoreRepository.findByMemberId(memberId)
            .map(r -> AnalyticsDto.RfmScoreResponse.builder()
                .memberId(memberId)
                .recencyDays(r.getRecencyDays())
                .frequency(r.getFrequency())
                .monetary(r.getMonetary())
                .rScore(r.getRScore())
                .fScore(r.getFScore())
                .mScore(r.getMScore())
                .rfmScore(r.getRfmScore())
                .segment(r.getSegment())
                .calculatedAt(r.getCalculatedAt())
                .build())
            .orElse(null);
    }

    public List<AnalyticsDto.RfmSegmentDistribution> getRfmDistribution() {
        return rfmScoreRepository.findSegmentDistribution().stream()
            .map(row -> AnalyticsDto.RfmSegmentDistribution.builder()
                .segment((String) row[0])
                .count((Long) row[1])
                .build())
            .collect(Collectors.toList());
    }

    public List<AnalyticsDto.RfmScoreResponse> getAllRfmScores() {
        return rfmScoreRepository.findAllWithMember().stream()
            .map(r -> AnalyticsDto.RfmScoreResponse.builder()
                .memberId(r.getMember().getId())
                .recencyDays(r.getRecencyDays())
                .frequency(r.getFrequency())
                .monetary(r.getMonetary())
                .rScore(r.getRScore())
                .fScore(r.getFScore())
                .mScore(r.getMScore())
                .rfmScore(r.getRfmScore())
                .segment(r.getSegment())
                .calculatedAt(r.getCalculatedAt())
                .build())
            .collect(Collectors.toList());
    }

    @Transactional
    public int calculateAllRfmScores() {
        List<Object[]> rawData = orderRepository.findRfmDataForAllMembers();
        if (rawData.isEmpty()) {
            log.info("RFM 계산 대상 회원 없음 (DELIVERED 주문 없음)");
            return 0;
        }

        LocalDate today = LocalDate.now();

        // 각 차원의 값 추출 (분위수 계산용)
        List<Long> recencyList = new ArrayList<>();
        List<Long> freqList    = new ArrayList<>();
        List<Long> moneyList   = new ArrayList<>();

        for (Object[] row : rawData) {
            LocalDateTime lastOrderDate = (LocalDateTime) row[1];
            long recencyDays = ChronoUnit.DAYS.between(lastOrderDate.toLocalDate(), today);
            recencyList.add(recencyDays);
            freqList.add((Long) row[2]);
            moneyList.add((Long) row[3]);
        }

        List<Long> sortedRecency = recencyList.stream().sorted().collect(Collectors.toList());
        List<Long> sortedFreq    = freqList.stream().sorted().collect(Collectors.toList());
        List<Long> sortedMoney   = moneyList.stream().sorted().collect(Collectors.toList());

        int count = 0;
        for (Object[] row : rawData) {
            Long memberId = (Long) row[0];
            LocalDateTime lastOrderDate = (LocalDateTime) row[1];
            long recencyDays = ChronoUnit.DAYS.between(lastOrderDate.toLocalDate(), today);
            long frequency   = (Long) row[2];
            long monetary    = (Long) row[3];

            // 최근성은 낮을수록 좋으므로 역방향 점수
            int rScore = 6 - quintileScore(recencyDays, sortedRecency);
            int fScore = quintileScore(frequency, sortedFreq);
            int mScore = quintileScore(monetary, sortedMoney);

            Member member = memberRepository.findById(memberId).orElse(null);
            if (member == null) continue;

            rfmScoreRepository.findByMemberId(memberId).ifPresentOrElse(
                existing -> existing.update((int) recencyDays, (int) frequency, monetary, rScore, fScore, mScore),
                () -> rfmScoreRepository.save(RfmScore.builder()
                    .member(member)
                    .recencyDays((int) recencyDays)
                    .frequency((int) frequency)
                    .monetary(monetary)
                    .rScore(rScore).fScore(fScore).mScore(mScore)
                    .build())
            );
            count++;
        }
        log.info("RFM 점수 계산 완료: {}명", count);
        return count;
    }

    // ─── 일별 집계 ─────────────────────────────────────────────────

    public List<AnalyticsDto.DailySummaryResponse> getDailySummary(LocalDate start, LocalDate end) {
        return dailySummaryRepository
            .findBySummaryDateBetweenOrderBySummaryDateAsc(start, end)
            .stream()
            .map(s -> AnalyticsDto.DailySummaryResponse.builder()
                .summaryDate(s.getSummaryDate())
                .totalOrders(s.getTotalOrders())
                .totalRevenue(s.getTotalRevenue())
                .newMembers(s.getNewMembers())
                .viewCount(s.getViewCount())
                .cartAddCount(s.getCartAddCount())
                .purchaseCount(s.getPurchaseCount())
                .cartConversionRate(s.getCartConversionRate())
                .purchaseConversionRate(s.getPurchaseConversionRate())
                .build())
            .collect(Collectors.toList());
    }

    @Transactional
    public DailyAnalyticsSummary calculateDailySummary(LocalDate targetDate) {
        LocalDateTime start = targetDate.atStartOfDay();
        LocalDateTime end   = targetDate.atTime(LocalTime.MAX);

        Object[] orderStats = orderRepository.findOrderStatsBetween(start, end);
        long totalOrders  = orderStats[0] != null ? (Long) orderStats[0] : 0L;
        long totalRevenue = orderStats[1] != null ? ((Number) orderStats[1]).longValue() : 0L;

        long newMembers  = memberRepository.countByCreatedAtBetween(start, end);
        long views       = behaviorLogRepository.countByActionTypeAndPeriod(ActionType.VIEW,       start, end);
        long cartAdds    = behaviorLogRepository.countByActionTypeAndPeriod(ActionType.ADD_CART,   start, end);
        long purchases   = behaviorLogRepository.countByActionTypeAndPeriod(ActionType.PURCHASE,   start, end);

        double cartConvRate     = views > 0 ? cartAdds  * 100.0 / views    : 0;
        double purchaseConvRate = cartAdds > 0 ? purchases * 100.0 / cartAdds : 0;

        DailyAnalyticsSummary summary = dailySummaryRepository.findBySummaryDate(targetDate)
            .orElse(DailyAnalyticsSummary.builder()
                .summaryDate(targetDate)
                .totalOrders(totalOrders).totalRevenue(totalRevenue)
                .newMembers(newMembers)
                .viewCount(views).cartAddCount(cartAdds).purchaseCount(purchases)
                .cartConversionRate(cartConvRate)
                .purchaseConversionRate(purchaseConvRate)
                .build());

        return dailySummaryRepository.save(summary);
    }

    // 1-5 분위수 점수 (낮은 값 = 1점, 높은 값 = 5점)
    private int quintileScore(long value, List<Long> sortedValues) {
        int n = sortedValues.size();
        if (n == 0) return 3;
        int rank = Collections.binarySearch(sortedValues, value);
        if (rank < 0) rank = -rank - 1;
        return Math.min(5, rank * 5 / n + 1);
    }
}
