package com.pknu26.ecommerce.domain.cart.entity;

import com.pknu26.ecommerce.domain.product.entity.Product;
import com.pknu26.ecommerce.util.BaseEntity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cart_items",
       uniqueConstraints = @UniqueConstraint(columnNames = {"cart_id", "product_id"}))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CartItem extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_item_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Builder
    public CartItem(Cart cart, Product product, Integer quantity) {
        this.cart = cart;
        this.product = product;
        this.quantity = quantity;
    }

    public void updateQuantity(int quantity) {
        if (quantity <= 0) throw new IllegalArgumentException("수량은 1 이상이어야 합니다.");
        this.quantity = quantity;
    }
}
