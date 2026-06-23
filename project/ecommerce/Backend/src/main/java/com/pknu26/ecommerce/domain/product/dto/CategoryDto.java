package com.pknu26.ecommerce.domain.product.dto;

import com.pknu26.ecommerce.domain.product.entity.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

public class CategoryDto {

    @Getter
    public static class CreateRequest {
        @NotBlank(message = "카테고리명은 필수입니다.")
        @Size(max = 100)
        private String name;
        private String description;
    }

    @Getter
    @Builder
    public static class CategoryResponse {
        private Long categoryId;
        private String name;
        private String description;
        private LocalDateTime createdAt;

        public static CategoryResponse from(Category category) {
            return CategoryResponse.builder()
                .categoryId(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .createdAt(category.getCreatedAt())
                .build();
        }
    }
}
