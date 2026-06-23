package com.pknu26.ecommerce.domain.review.dto;

import com.pknu26.ecommerce.domain.review.entity.Review;
import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

public class ReviewDto {

    @Getter
    public static class CreateRequest {
        @NotNull(message = "상품 ID는 필수입니다.")
        private Long productId;

        @NotNull @Min(1) @Max(5)
        private Integer rating;

        @Size(max = 1000)
        private String content;
    }

    @Getter
    public static class UpdateRequest {
        @NotNull @Min(1) @Max(5)
        private Integer rating;

        @Size(max = 1000)
        private String content;
    }

    @Getter
    @Builder
    public static class ReviewResponse {
        private Long reviewId;
        private Long memberId;
        private String memberName;
        private Long productId;
        private String productName;
        private Integer rating;
        private String content;
        private LocalDateTime createdAt;

        public static ReviewResponse from(Review review) {
            return ReviewResponse.builder()
                .reviewId(review.getId())
                .memberId(review.getMember().getId())
                .memberName(review.getMember().getName())
                .productId(review.getProduct().getId())
                .productName(review.getProduct().getName())
                .rating(review.getRating())
                .content(review.getContent())
                .createdAt(review.getCreatedAt())
                .build();
        }
    }
}
