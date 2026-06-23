package com.pknu26.ecommerce.domain.product.dto;

import com.pknu26.ecommerce.domain.product.entity.Product;
import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

public class ProductDto {

    @Getter
    public static class CreateRequest {
        @NotNull(message = "카테고리는 필수입니다.")
        private Long categoryId;

        @NotBlank(message = "상품명은 필수입니다.")
        @Size(max = 200)
        private String name;

        @NotNull(message = "가격은 필수입니다.")
        @Min(value = 0, message = "가격은 0 이상이어야 합니다.")
        private Integer price;

        @Min(value = 0, message = "재고는 0 이상이어야 합니다.")
        private Integer stockQty;

        private String description;
    }

    @Getter
    public static class UpdateRequest {
        @NotNull private Long categoryId;
        @NotBlank @Size(max = 200) private String name;
        @NotNull @Min(0) private Integer price;
        @Min(0) private Integer stockQty;
        private String description;
    }

    @Getter
    @Builder
    public static class ProductResponse {
        private Long productId;
        private Long categoryId;
        private String categoryName;
        private String name;
        private Integer price;
        private Integer stockQty;
        private String description;
        private String status;
        private Double averageRating;
        private LocalDateTime createdAt;

        public static ProductResponse from(Product product) {
            return ProductResponse.builder()
                .productId(product.getId())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .name(product.getName())
                .price(product.getPrice())
                .stockQty(product.getStockQty())
                .description(product.getDescription())
                .status(product.getStatus().name())
                .createdAt(product.getCreatedAt())
                .build();
        }

        public static ProductResponse from(Product product, Double averageRating) {
            ProductResponse response = from(product);
            return ProductResponse.builder()
                .productId(response.productId)
                .categoryId(response.categoryId)
                .categoryName(response.categoryName)
                .name(response.name)
                .price(response.price)
                .stockQty(response.stockQty)
                .description(response.description)
                .status(response.status)
                .createdAt(response.createdAt)
                .averageRating(averageRating)
                .build();
        }
    }
}
