package com.pknu26.ecommerce.domain.analytics.service;

import com.pknu26.ecommerce.domain.analytics.dto.AnalyticsDto;
import com.pknu26.ecommerce.domain.analytics.entity.BehaviorLog;
import com.pknu26.ecommerce.domain.analytics.entity.BehaviorLog.ActionType;
import com.pknu26.ecommerce.domain.analytics.repository.BehaviorLogRepository;
import com.pknu26.ecommerce.domain.member.entity.Member;
import com.pknu26.ecommerce.domain.member.repository.MemberRepository;
import com.pknu26.ecommerce.domain.product.entity.Product;
import com.pknu26.ecommerce.domain.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BehaviorLogService {

    private final BehaviorLogRepository behaviorLogRepository;
    private final MemberRepository memberRepository;
    private final ProductRepository productRepository;

    @Async
    @Transactional
    public void log(Long memberId, Long productId, ActionType actionType,
                    String sessionId, String searchKeyword, Long categoryId) {
        Member member = memberId != null
            ? memberRepository.findById(memberId).orElse(null) : null;
        Product product = productId != null
            ? productRepository.findById(productId).orElse(null) : null;

        BehaviorLog log = BehaviorLog.builder()
            .member(member)
            .product(product)
            .actionType(actionType)
            .sessionId(sessionId)
            .searchKeyword(searchKeyword)
            .categoryId(categoryId)
            .build();

        behaviorLogRepository.save(log);
    }

    public List<AnalyticsDto.TopProductResponse> getTopViewedProducts(LocalDateTime start, LocalDateTime end, int limit) {
        return behaviorLogRepository
            .findTopProductsByAction(ActionType.VIEW, start, end, PageRequest.of(0, limit))
            .stream()
            .map(row -> AnalyticsDto.TopProductResponse.builder()
                .productId((Long) row[0])
                .count((Long) row[1])
                .build())
            .collect(Collectors.toList());
    }

    public List<AnalyticsDto.TopProductResponse> getTopPurchasedProducts(LocalDateTime start, LocalDateTime end, int limit) {
        return behaviorLogRepository
            .findTopProductsByAction(ActionType.PURCHASE, start, end, PageRequest.of(0, limit))
            .stream()
            .map(row -> AnalyticsDto.TopProductResponse.builder()
                .productId((Long) row[0])
                .count((Long) row[1])
                .build())
            .collect(Collectors.toList());
    }

    public List<AnalyticsDto.TopKeywordResponse> getTopSearchKeywords(LocalDateTime start, LocalDateTime end, int limit) {
        return behaviorLogRepository
            .findTopSearchKeywords(start, end, PageRequest.of(0, limit))
            .stream()
            .map(row -> AnalyticsDto.TopKeywordResponse.builder()
                .keyword((String) row[0])
                .count((Long) row[1])
                .build())
            .collect(Collectors.toList());
    }

    public List<AnalyticsDto.DailyPurchaseResponse> getDailyPurchaseTrend(LocalDateTime start, LocalDateTime end) {
        return behaviorLogRepository.findDailyPurchaseCount(start, end)
            .stream()
            .map(row -> AnalyticsDto.DailyPurchaseResponse.builder()
                .date((String) row[0])
                .count((Long) row[1])
                .build())
            .collect(Collectors.toList());
    }

    public AnalyticsDto.MemberBehaviorSummary getMemberSummary(Long memberId) {
        return AnalyticsDto.MemberBehaviorSummary.builder()
            .memberId(memberId)
            .viewCount(behaviorLogRepository.countByMemberIdAndActionType(memberId, ActionType.VIEW))
            .cartAddCount(behaviorLogRepository.countByMemberIdAndActionType(memberId, ActionType.ADD_CART))
            .purchaseCount(behaviorLogRepository.countByMemberIdAndActionType(memberId, ActionType.PURCHASE))
            .reviewCount(behaviorLogRepository.countByMemberIdAndActionType(memberId, ActionType.REVIEW))
            .build();
    }

    public AnalyticsDto.PurchaseFunnelResponse getPurchaseFunnel(LocalDateTime start, LocalDateTime end) {
        long views     = behaviorLogRepository.countByActionTypeAndPeriod(ActionType.VIEW,     start, end);
        long cartAdds  = behaviorLogRepository.countByActionTypeAndPeriod(ActionType.ADD_CART, start, end);
        long purchases = behaviorLogRepository.countByActionTypeAndPeriod(ActionType.PURCHASE, start, end);

        return AnalyticsDto.PurchaseFunnelResponse.builder()
            .viewCount(views)
            .cartAddCount(cartAdds)
            .purchaseCount(purchases)
            .cartConversionRate(views > 0 ? (double) cartAdds / views * 100 : 0)
            .purchaseConversionRate(cartAdds > 0 ? (double) purchases / cartAdds * 100 : 0)
            .build();
    }
}
