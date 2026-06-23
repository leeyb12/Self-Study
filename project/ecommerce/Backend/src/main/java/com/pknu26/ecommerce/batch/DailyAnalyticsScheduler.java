package com.pknu26.ecommerce.batch;

import com.pknu26.ecommerce.domain.analytics.service.RfmService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Slf4j
@Component
@RequiredArgsConstructor
public class DailyAnalyticsScheduler {

    private final RfmService rfmService;

    // 매일 새벽 2시 자동 실행
    @Scheduled(cron = "0 0 2 * * *")
    public void runDailyAnalytics() {
        LocalDate yesterday = LocalDate.now().minusDays(1);
        log.info("[Scheduler] 일별 분석 시작: {}", yesterday);
        try {
            rfmService.calculateDailySummary(yesterday);
            rfmService.calculateAllRfmScores();
            log.info("[Scheduler] 일별 분석 완료");
        } catch (Exception e) {
            log.error("[Scheduler] 일별 분석 실패", e);
        }
    }
}
