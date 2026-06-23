package com.pknu26.ecommerce.domain.analytics.repository;

import com.pknu26.ecommerce.domain.analytics.entity.DailyAnalyticsSummary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyAnalyticsSummaryRepository extends JpaRepository<DailyAnalyticsSummary, Long> {

    Optional<DailyAnalyticsSummary> findBySummaryDate(LocalDate summaryDate);

    List<DailyAnalyticsSummary> findBySummaryDateBetweenOrderBySummaryDateAsc(LocalDate start, LocalDate end);
}