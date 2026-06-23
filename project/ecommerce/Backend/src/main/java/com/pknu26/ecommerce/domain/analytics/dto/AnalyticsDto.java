package com.pknu26.ecommerce.domain.analytics.dto;

import com.pknu26.ecommerce.domain.analytics.entity.BehaviorLog.ActionType;
import lombok.Builder;
import lombok.Getter;


public class AnalyticsDto {

    @Getter
    @Builder
    public static class TopProductResponse {
        private Long productId;
        private String productName;
        private Long count;
    }

    @Getter
    @Builder
    public static class TopKeywordResponse {
        private String keyword;
        private Long count;
    }

    @Getter
    @Builder
    public static class DailyPurchaseResponse {
        private String date;
        private Long count;
    }

    @Getter
    @Builder
    public static class MemberBehaviorSummary {
        private Long memberId;
        private Long viewCount;
        private Long cartAddCount;
        private Long purchaseCount;
        private Long reviewCount;
    }

    @Getter
    @Builder
    public static class PurchaseFunnelResponse {
        private Long viewCount;
        private Long cartAddCount;
        private Long purchaseCount;
        private Double cartConversionRate;
        private Double purchaseConversionRate;
    }

    @Getter
    @Builder
    public static class BehaviorLogRequest {
        private Long productId;
        private ActionType actionType;
        private String sessionId;
        private String searchKeyword;
        private Long categoryId;
    }

    // ── RFM 분석 ──────────────────────────────────────────────────

    @Getter
    @Builder
    public static class RfmScoreResponse {
        private Long memberId;
        private Integer recencyDays;
        private Integer frequency;
        private Long monetary;
        private Integer rScore;
        private Integer fScore;
        private Integer mScore;
        private String rfmScore;
        private String segment;
        private java.time.LocalDateTime calculatedAt;
    }

    @Getter
    @Builder
    public static class RfmSegmentDistribution {
        private String segment;
        private Long count;
    }

    // ── 일별 집계 (배치 결과) ──────────────────────────────────────

    @Getter
    @Builder
    public static class DailySummaryResponse {
        private java.time.LocalDate summaryDate;
        private Long totalOrders;
        private Long totalRevenue;
        private Long newMembers;
        private Long viewCount;
        private Long cartAddCount;
        private Long purchaseCount;
        private Double cartConversionRate;
        private Double purchaseConversionRate;
    }
}
