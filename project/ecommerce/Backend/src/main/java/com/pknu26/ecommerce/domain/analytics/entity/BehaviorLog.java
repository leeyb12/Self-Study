package com.pknu26.ecommerce.domain.analytics.entity;

import com.pknu26.ecommerce.domain.member.entity.Member;
import com.pknu26.ecommerce.domain.product.entity.Product;
import com.pknu26.ecommerce.util.BaseEntity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "behavior_logs",
       indexes = {
           @Index(name = "idx_behavior_member", columnList = "member_id"),
           @Index(name = "idx_behavior_product", columnList = "product_id"),
           @Index(name = "idx_behavior_type", columnList = "action_type")
       })
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class BehaviorLog extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Enumerated(EnumType.STRING)
    @Column(name = "action_type", nullable = false, length = 20)
    private ActionType actionType;

    @Column(name = "session_id", length = 100)
    private String sessionId;

    @Column(name = "search_keyword", length = 200)
    private String searchKeyword;

    @Column(name = "category_id")
    private Long categoryId;

    @Builder
    public BehaviorLog(Member member, Product product, ActionType actionType,
                       String sessionId, String searchKeyword, Long categoryId) {
        this.member = member;
        this.product = product;
        this.actionType = actionType;
        this.sessionId = sessionId;
        this.searchKeyword = searchKeyword;
        this.categoryId = categoryId;
    }

    public enum ActionType {
        VIEW,           // 상품 조회
        SEARCH,         // 검색
        ADD_CART,       // 장바구니 담기
        REMOVE_CART,    // 장바구니 제거
        PURCHASE,       // 구매 완료
        REVIEW,         // 리뷰 작성
        CANCEL          // 주문 취소
    }
}
