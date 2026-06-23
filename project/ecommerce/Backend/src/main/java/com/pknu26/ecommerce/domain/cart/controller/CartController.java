package com.pknu26.ecommerce.domain.cart.controller;

import com.pknu26.ecommerce.domain.cart.dto.CartDto;
import com.pknu26.ecommerce.domain.cart.service.CartService;
import com.pknu26.ecommerce.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@Tag(name = "장바구니 API")
@SecurityRequirement(name = "bearerAuth")
public class CartController {

    private final CartService cartService;

    @GetMapping
    @Operation(summary = "장바구니 조회")
    public ResponseEntity<ApiResponse<CartDto.CartResponse>> getCart(
            @AuthenticationPrincipal Long memberId) {
        return ResponseEntity.ok(ApiResponse.ok(cartService.getCart(memberId)));
    }

    @PostMapping("/items")
    @Operation(summary = "장바구니 상품 추가")
    public ResponseEntity<ApiResponse<CartDto.CartResponse>> addItem(
            @AuthenticationPrincipal Long memberId,
            @Valid @RequestBody CartDto.AddRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(cartService.addItem(memberId, request)));
    }

    @PutMapping("/items/{cartItemId}")
    @Operation(summary = "장바구니 수량 변경")
    public ResponseEntity<ApiResponse<CartDto.CartResponse>> updateItem(
            @AuthenticationPrincipal Long memberId,
            @PathVariable Long cartItemId,
            @Valid @RequestBody CartDto.UpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(cartService.updateItem(memberId, cartItemId, request)));
    }

    @DeleteMapping("/items/{cartItemId}")
    @Operation(summary = "장바구니 상품 제거")
    public ResponseEntity<ApiResponse<CartDto.CartResponse>> removeItem(
            @AuthenticationPrincipal Long memberId,
            @PathVariable Long cartItemId) {
        return ResponseEntity.ok(ApiResponse.ok(cartService.removeItem(memberId, cartItemId)));
    }

    @DeleteMapping
    @Operation(summary = "장바구니 전체 비우기")
    public ResponseEntity<ApiResponse<Void>> clearCart(
            @AuthenticationPrincipal Long memberId) {
        cartService.clearCart(memberId);
        return ResponseEntity.ok(ApiResponse.noContent());
    }
}
