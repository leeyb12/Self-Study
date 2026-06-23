package com.pknu26.ecommerce.domain.analytics.entity;

import com.pknu26.ecommerce.util.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "daily_analytics_summary")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DailyAnalyticsSummary extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "summary_id")
    private Long id;

    @Column(name = "summary_date", nullable = false, unique = true)
    private LocalDate summaryDate;

    @Column(name = "total_orders")
    private Long totalOrders;

    @Column(name = "total_revenue")
    private Long totalRevenue;

    @Column(name = "new_members")
    private Long newMembers;

    @Column(name = "view_count")
    private Long viewCount;

    @Column(name = "cart_add_count")
    private Long cartAddCount;

    @Column(name = "purchase_count")
    private Long purchaseCount;

    @Column(name = "cart_conversion_rate")
    private Double cartConversionRate;

    @Column(name = "purchase_conversion_rate")
    private Double purchaseConversionRate;

    @Builder
    public DailyAnalyticsSummary(LocalDate summaryDate, Long totalOrders, Long totalRevenue,
                                  Long newMembers, Long viewCount, Long cartAddCount,
                                  Long purchaseCount, Double cartConversionRate,
                                  Double purchaseConversionRate) {
        this.summaryDate = summaryDate;
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
        this.newMembers = newMembers;
        this.viewCount = viewCount;
        this.cartAddCount = cartAddCount;
        this.purchaseCount = purchaseCount;
        this.cartConversionRate = cartConversionRate;
        this.purchaseConversionRate = purchaseConversionRate;
    }
}