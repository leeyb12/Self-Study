package com.pknu26.ecommerce.domain.order.controller;

import com.pknu26.ecommerce.domain.order.dto.OrderDto;
import com.pknu26.ecommerce.domain.order.service.OrderService;
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
@RequestMapping("/orders")
@RequiredArgsConstructor
@Tag(name = "주문 API")
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    @Operation(summary = "내 주문 목록", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<PageResponse<OrderDto.OrderResponse>>> getMyOrders(
            @AuthenticationPrincipal Long memberId,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getMyOrders(memberId, pageable)));
    }

    @GetMapping("/{orderId}")
    @Operation(summary = "주문 상세 조회", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<OrderDto.OrderResponse>> getOrder(
            @AuthenticationPrincipal Long memberId,
            @PathVariable Long orderId) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getOrder(memberId, orderId)));
    }

    @PostMapping
    @Operation(summary = "주문 생성", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<OrderDto.OrderResponse>> create(
            @AuthenticationPrincipal Long memberId,
            @Valid @RequestBody OrderDto.CreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.created(orderService.create(memberId, request)));
    }

    @PostMapping("/{orderId}/cancel")
    @Operation(summary = "주문 취소", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> cancel(
            @AuthenticationPrincipal Long memberId,
            @PathVariable Long orderId) {
        orderService.cancel(memberId, orderId);
        return ResponseEntity.ok(ApiResponse.noContent());
    }
}
