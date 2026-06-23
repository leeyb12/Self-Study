package com.pknu26.ecommerce.domain.order.entity;

import jakarta.persistence.*;
import lombok.*;
 
import java.util.ArrayList;
import java.util.List;

import com.pknu26.ecommerce.domain.member.entity.Member;
import com.pknu26.ecommerce.util.BaseEntity;

@Entity
@Table(name = "orders")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Order extends BaseEntity {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long id;
 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;
 
    @Column(name = "total_price", nullable = false)
    private Integer totalPrice;
 
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 15)
    private OrderStatus status = OrderStatus.PENDING;
 
    @Column(name = "delivery_addr", length = 300)
    private String deliveryAddr;
 
    @Column(name = "payment_method", length = 20)
    private String paymentMethod;
 
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();
 
    @Builder
    public Order(Member member, String deliveryAddr, String paymentMethod) {
        this.member = member;
        this.deliveryAddr = deliveryAddr;
        this.paymentMethod = paymentMethod;
        this.totalPrice = 0;
    }
 
    // 주문 상품 추가
    public void addOrderItem(OrderItem item) {
        orderItems.add(item);
        this.totalPrice += item.getUnitPrice() * item.getQuantity();
    }

    // 상태 변경
    public void pay()     { changeStatus(OrderStatus.PENDING,   OrderStatus.PAID); }
    public void ship()    { changeStatus(OrderStatus.PAID,      OrderStatus.SHIPPED); }
    public void deliver() { changeStatus(OrderStatus.SHIPPED,   OrderStatus.DELIVERED); }
    public void cancel()  {
        if (status == OrderStatus.SHIPPED || status == OrderStatus.DELIVERED) {
            throw new IllegalStateException("배송 중이거나 완료된 주문은 취소할 수 없습니다.");
        }
        // 재고 복구
        orderItems.forEach(item -> item.getProduct().increaseStock(item.getQuantity()));
        this.status = OrderStatus.CANCELLED;
    }
 
    private void changeStatus(OrderStatus from, OrderStatus to) {
        if (this.status != from) {
            throw new IllegalStateException("주문 상태를 변경할 수 없습니다. 현재: " + this.status);
        }
        this.status = to;
    }
 
    public enum OrderStatus { PENDING, PAID, SHIPPED, DELIVERED, CANCELLED }
}
