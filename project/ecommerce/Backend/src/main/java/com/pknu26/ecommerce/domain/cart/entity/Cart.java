package com.pknu26.ecommerce.domain.cart.entity;

import com.pknu26.ecommerce.domain.member.entity.Member;
import com.pknu26.ecommerce.util.BaseEntity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carts")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Cart extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false, unique = true)
    private Member member;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> cartItems = new ArrayList<>();

    @Builder
    public Cart(Member member) {
        this.member = member;
    }

    public void addItem(CartItem item) {
        cartItems.add(item);
    }

    public void clear() {
        cartItems.clear();
    }

    public int getTotalPrice() {
        return cartItems.stream()
            .mapToInt(item -> item.getProduct().getPrice() * item.getQuantity())
            .sum();
    }
}
