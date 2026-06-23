package com.pknu26.ecommerce.domain.cart.dto;

import com.pknu26.ecommerce.domain.cart.entity.Cart;
import com.pknu26.ecommerce.domain.cart.entity.CartItem;
import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

public class CartDto {

    @Getter
    public static class AddRequest {
        @NotNull(message = "상품 ID는 필수입니다.")
        private Long productId;

        @NotNull @Min(value = 1, message = "수량은 1 이상이어야 합니다.")
        private Integer quantity;
    }

    @Getter
    public static class UpdateRequest {
        @NotNull @Min(value = 1, message = "수량은 1 이상이어야 합니다.")
        private Integer quantity;
    }

    @Getter
    @Builder
    public static class CartItemResponse {
        private Long cartItemId;
        private Long productId;
        private String productName;
        private Integer price;
        private Integer quantity;
        private Integer itemTotalPrice;

        public static CartItemResponse from(CartItem item) {
            return CartItemResponse.builder()
                .cartItemId(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .price(item.getProduct().getPrice())
                .quantity(item.getQuantity())
                .itemTotalPrice(item.getProduct().getPrice() * item.getQuantity())
                .build();
        }
    }

    @Getter
    @Builder
    public static class CartResponse {
        private Long cartId;
        private List<CartItemResponse> items;
        private Integer totalPrice;

        public static CartResponse from(Cart cart) {
            return CartResponse.builder()
                .cartId(cart.getId())
                .items(cart.getCartItems().stream()
                    .map(CartItemResponse::from)
                    .collect(Collectors.toList()))
                .totalPrice(cart.getTotalPrice())
                .build();
        }
    }
}
