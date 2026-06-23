package com.pknu26.ecommerce.domain.product.controller;

import com.pknu26.ecommerce.domain.product.dto.CategoryDto;
import com.pknu26.ecommerce.domain.product.service.CategoryService;
import com.pknu26.ecommerce.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@Tag(name = "카테고리 API")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    @Operation(summary = "카테고리 목록 조회")
    public ResponseEntity<ApiResponse<List<CategoryDto.CategoryResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(categoryService.getAll()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "카테고리 단건 조회")
    public ResponseEntity<ApiResponse<CategoryDto.CategoryResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(categoryService.getById(id)));
    }

    @PostMapping
    @Operation(summary = "카테고리 생성 (관리자)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<CategoryDto.CategoryResponse>> create(
            @Valid @RequestBody CategoryDto.CreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.created(categoryService.create(request)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "카테고리 수정 (관리자)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<CategoryDto.CategoryResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody CategoryDto.CreateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(categoryService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "카테고리 삭제 (관리자)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.ok(ApiResponse.noContent());
    }
}
