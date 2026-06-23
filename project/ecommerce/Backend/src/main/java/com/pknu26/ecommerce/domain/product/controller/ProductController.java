package com.pknu26.ecommerce.domain.product.controller;

import com.pknu26.ecommerce.domain.analytics.entity.BehaviorLog.ActionType;
import com.pknu26.ecommerce.domain.analytics.service.BehaviorLogService;
import com.pknu26.ecommerce.domain.product.dto.ProductDto;
import com.pknu26.ecommerce.domain.product.service.ProductService;
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
@RequestMapping("/products")
@RequiredArgsConstructor
@Tag(name = "상품 API")
public class ProductController {

    private final ProductService productService;
    private final BehaviorLogService behaviorLogService;

    @GetMapping
    @Operation(summary = "상품 목록 조회")
    public ResponseEntity<ApiResponse<PageResponse<ProductDto.ProductResponse>>> getProducts(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getProducts(pageable)));
    }

    @GetMapping("/search")
    @Operation(summary = "상품 검색")
    public ResponseEntity<ApiResponse<PageResponse<ProductDto.ProductResponse>>> search(
            @RequestParam String keyword,
            @AuthenticationPrincipal Long memberId,
            @PageableDefault(size = 20) Pageable pageable) {
        behaviorLogService.log(memberId, null, ActionType.SEARCH, null, keyword, null);
        return ResponseEntity.ok(ApiResponse.ok(productService.search(keyword, pageable)));
    }

    @GetMapping("/category/{categoryId}")
    @Operation(summary = "카테고리별 상품 조회")
    public ResponseEntity<ApiResponse<PageResponse<ProductDto.ProductResponse>>> getByCategory(
            @PathVariable Long categoryId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(productService.getByCategory(categoryId, pageable)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "상품 상세 조회")
    public ResponseEntity<ApiResponse<ProductDto.ProductResponse>> getById(
            @PathVariable Long id,
            @AuthenticationPrincipal Long memberId) {
        behaviorLogService.log(memberId, id, ActionType.VIEW, null, null, null);
        return ResponseEntity.ok(ApiResponse.ok(productService.getById(id)));
    }

    @PostMapping
    @Operation(summary = "상품 등록 (관리자)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<ProductDto.ProductResponse>> create(
            @Valid @RequestBody ProductDto.CreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.created(productService.create(request)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "상품 수정 (관리자)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<ProductDto.ProductResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody ProductDto.UpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(productService.update(id, request)));
    }

    @PatchMapping("/{id}/hide")
    @Operation(summary = "상품 숨김 (관리자)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> hide(@PathVariable Long id) {
        productService.hide(id);
        return ResponseEntity.ok(ApiResponse.noContent());
    }

    @PatchMapping("/{id}/show")
    @Operation(summary = "상품 노출 (관리자)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> show(@PathVariable Long id) {
        productService.show(id);
        return ResponseEntity.ok(ApiResponse.noContent());
    }
}
