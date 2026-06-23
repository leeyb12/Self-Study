package com.pknu26.ecommerce.domain.analytics.repository;

import com.pknu26.ecommerce.domain.analytics.entity.BehaviorLog;
import com.pknu26.ecommerce.domain.analytics.entity.BehaviorLog.ActionType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BehaviorLogRepository extends JpaRepository<BehaviorLog, Long> {

    List<BehaviorLog> findByMemberIdAndActionTypeOrderByCreatedAtDesc(Long memberId, ActionType actionType);

    @Query("SELECT b.product.id, COUNT(b) as cnt FROM BehaviorLog b " +
           "WHERE b.actionType = :actionType AND b.createdAt BETWEEN :start AND :end " +
           "AND b.product IS NOT NULL " +
           "GROUP BY b.product.id ORDER BY cnt DESC")
    List<Object[]> findTopProductsByAction(@Param("actionType") ActionType actionType,
                                            @Param("start") LocalDateTime start,
                                            @Param("end") LocalDateTime end,
                                            Pageable pageable);

    @Query("SELECT b.searchKeyword, COUNT(b) as cnt FROM BehaviorLog b " +
           "WHERE b.actionType = 'SEARCH' AND b.searchKeyword IS NOT NULL " +
           "AND b.createdAt BETWEEN :start AND :end " +
           "GROUP BY b.searchKeyword ORDER BY cnt DESC")
    List<Object[]> findTopSearchKeywords(@Param("start") LocalDateTime start,
                                          @Param("end") LocalDateTime end,
                                          Pageable pageable);

    @Query("SELECT FUNCTION('TO_CHAR', b.createdAt, 'YYYY-MM-DD'), COUNT(b) FROM BehaviorLog b " +
           "WHERE b.actionType = 'PURCHASE' AND b.createdAt BETWEEN :start AND :end " +
           "GROUP BY FUNCTION('TO_CHAR', b.createdAt, 'YYYY-MM-DD') " +
           "ORDER BY FUNCTION('TO_CHAR', b.createdAt, 'YYYY-MM-DD')")
    List<Object[]> findDailyPurchaseCount(@Param("start") LocalDateTime start,
                                           @Param("end") LocalDateTime end);

    long countByMemberIdAndActionType(Long memberId, ActionType actionType);

    // 퍼널/일별 집계용: 기간 내 특정 액션 수 (기존 findTopProductsByAction 보다 효율적)
    @Query("SELECT COUNT(b) FROM BehaviorLog b " +
           "WHERE b.actionType = :actionType AND b.createdAt BETWEEN :start AND :end")
    long countByActionTypeAndPeriod(@Param("actionType") ActionType actionType,
                                     @Param("start") LocalDateTime start,
                                     @Param("end") LocalDateTime end);
}
