package com.pknu26.ecommerce.domain.order.repository;

import com.pknu26.ecommerce.domain.order.entity.Order;
import com.pknu26.ecommerce.domain.order.entity.Order.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Page<Order> findByMemberIdOrderByCreatedAtDesc(Long memberId, Pageable pageable);

    @Query("SELECT o FROM Order o JOIN FETCH o.orderItems oi JOIN FETCH oi.product WHERE o.id = :id")
    Optional<Order> findByIdWithItems(@Param("id") Long id);

    List<Order> findByMemberIdAndStatus(Long memberId, OrderStatus status);

    @Query("SELECT o FROM Order o WHERE o.createdAt BETWEEN :start AND :end")
    List<Order> findByCreatedAtBetween(@Param("start") LocalDateTime start,
                                       @Param("end") LocalDateTime end);

    // RFM 계산용: 회원별 마지막구매일, 구매횟수, 총구매금액
    @Query("SELECT o.member.id, MAX(o.createdAt), COUNT(o), SUM(o.totalPrice) " +
           "FROM Order o WHERE o.status = 'DELIVERED' " +
           "GROUP BY o.member.id")
    List<Object[]> findRfmDataForAllMembers();

    // 일별 집계용: 기간 내 주문 수 + 매출
    @Query("SELECT COUNT(o), COALESCE(SUM(o.totalPrice), 0) FROM Order o " +
           "WHERE o.createdAt BETWEEN :start AND :end AND o.status <> 'CANCELLED'")
    Object[] findOrderStatsBetween(@Param("start") LocalDateTime start,
                                   @Param("end") LocalDateTime end);
}
