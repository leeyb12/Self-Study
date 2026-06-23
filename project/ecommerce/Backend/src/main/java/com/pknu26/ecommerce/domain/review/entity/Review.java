package com.pknu26.ecommerce.domain.review.entity;

import com.pknu26.ecommerce.domain.member.entity.Member;
import com.pknu26.ecommerce.domain.product.entity.Product;
import com.pknu26.ecommerce.util.BaseEntity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reviews",
       uniqueConstraints = @UniqueConstraint(columnNames = {"member_id", "product_id"}))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Review extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "rating", nullable = false)
    private Integer rating;

    @Column(name = "content", length = 1000)
    private String content;

    @Builder
    public Review(Member member, Product product, Integer rating, String content) {
        if (rating < 1 || rating > 5) throw new IllegalArgumentException("평점은 1~5 사이여야 합니다.");
        this.member = member;
        this.product = product;
        this.rating = rating;
        this.content = content;
    }

    public void update(Integer rating, String content) {
        if (rating < 1 || rating > 5) throw new IllegalArgumentException("평점은 1~5 사이여야 합니다.");
        this.rating = rating;
        this.content = content;
    }
}
