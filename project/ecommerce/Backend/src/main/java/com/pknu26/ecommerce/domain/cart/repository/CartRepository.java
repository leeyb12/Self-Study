package com.pknu26.ecommerce.domain.cart.repository;

import com.pknu26.ecommerce.domain.cart.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

    @Query("SELECT c FROM Cart c LEFT JOIN FETCH c.cartItems ci LEFT JOIN FETCH ci.product WHERE c.member.id = :memberId")
    Optional<Cart> findByMemberIdWithItems(@Param("memberId") Long memberId);

    Optional<Cart> findByMemberId(Long memberId);
}
