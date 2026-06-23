package com.pknu26.ecommerce.domain.order.dto;

import com.pknu26.ecommerce.domain.order.entity.Order;
import com.pknu26.ecommerce.domain.order.entity.OrderItem;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class OrderDto {

    @Getter
    public static class CreateRequest {
        @NotBlank(message = "배송지는 필수입니다.")
        private String deliveryAddr;

        @NotBlank(message = "결제 방법은 필수입니다.")
        private String paymentMethod;

        @Valid
        @NotEmpty(message = "주문 상품이 없습니다.")
        private List<OrderItemRequest> items;
    }

    @Getter
    public static class OrderItemRequest {
        @NotNull private Long productId;
        @NotNull @Min(1) private Integer quantity;
    }

    @Getter
    @Builder
    public static class OrderItemResponse {
        private Long orderItemId;
        private Long productId;
        private String productName;
        private Integer quantity;
        private Integer unitPrice;
        private Integer totalItemPrice;

        public static OrderItemResponse from(OrderItem item) {
            return OrderItemResponse.builder()
                .orderItemId(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .totalItemPrice(item.getTotalItemPrice())
                .build();
        }
    }

    @Getter
    @Builder
    public static class OrderResponse {
        private Long orderId;
        private Long memberId;
        private Integer totalPrice;
        private String status;
        private String deliveryAddr;
        private String paymentMethod;
        private List<OrderItemResponse> items;
        private LocalDateTime createdAt;

        public static OrderResponse from(Order order) {
            return OrderResponse.builder()
                .orderId(order.getId())
                .memberId(order.getMember().getId())
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus().name())
                .deliveryAddr(order.getDeliveryAddr())
                .paymentMethod(order.getPaymentMethod())
                .items(order.getOrderItems().stream()
                    .map(OrderItemResponse::from)
                    .collect(Collectors.toList()))
                .createdAt(order.getCreatedAt())
                .build();
        }
    }
}
