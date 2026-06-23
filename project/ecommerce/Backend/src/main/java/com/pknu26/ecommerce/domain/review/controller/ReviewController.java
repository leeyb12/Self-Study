package com.pknu26.ecommerce.domain.review.controller;

import com.pknu26.ecommerce.domain.review.dto.ReviewDto;
import com.pknu26.ecommerce.domain.review.service.ReviewService;
import com.pknu26.ecommerce.response.ApiResponse;
import com.pknu26.ecommerce.response.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
@Tag(name = "리뷰 API")
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/products/{productId}")
    @Operation(summary = "상품 리뷰 목록")
    public ResponseEntity<ApiResponse<PageResponse<ReviewDto.ReviewResponse>>> getByProduct(
            @PathVariable Long productId,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(reviewService.getByProduct(productId, pageable)));
    }

    @GetMapping("/me")
    @Operation(summary = "내 리뷰 목록", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<PageResponse<ReviewDto.ReviewResponse>>> getMyReviews(
            @AuthenticationPrincipal Long memberId,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(reviewService.getMyReviews(memberId, pageable)));
    }

    @PostMapping
    @Operation(summary = "리뷰 작성", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<ReviewDto.ReviewResponse>> create(
            @AuthenticationPrincipal Long memberId,
            @Valid @RequestBody ReviewDto.CreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.created(reviewService.create(memberId, request)));
    }

    @PutMapping("/{reviewId}")
    @Operation(summary = "리뷰 수정", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<ReviewDto.ReviewResponse>> update(
            @AuthenticationPrincipal Long memberId,
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewDto.UpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(reviewService.update(memberId, reviewId, request)));
    }

    @DeleteMapping("/{reviewId}")
    @Operation(summary = "리뷰 삭제", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> delete(
            @AuthenticationPrincipal Long memberId,
            @PathVariable Long reviewId) {
        reviewService.delete(memberId, reviewId);
        return ResponseEntity.ok(ApiResponse.noContent());
    }
}
