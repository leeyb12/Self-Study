package com.pknu26.ecommerce.domain.product.service;

import com.pknu26.ecommerce.domain.product.dto.CategoryDto;
import com.pknu26.ecommerce.domain.product.entity.Category;
import com.pknu26.ecommerce.domain.product.repository.CategoryRepository;
import com.pknu26.ecommerce.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryDto.CategoryResponse> getAll() {
        return categoryRepository.findAll().stream()
            .map(CategoryDto.CategoryResponse::from)
            .collect(Collectors.toList());
    }

    public CategoryDto.CategoryResponse getById(Long id) {
        return CategoryDto.CategoryResponse.from(findById(id));
    }

    @Transactional
    public CategoryDto.CategoryResponse create(CategoryDto.CreateRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw BusinessException.conflict("이미 존재하는 카테고리명입니다.");
        }
        Category category = Category.builder()
            .name(request.getName())
            .description(request.getDescription())
            .build();
        return CategoryDto.CategoryResponse.from(categoryRepository.save(category));
    }

    @Transactional
    public CategoryDto.CategoryResponse update(Long id, CategoryDto.CreateRequest request) {
        Category category = findById(id);
        category.update(request.getName(), request.getDescription());
        return CategoryDto.CategoryResponse.from(category);
    }

    @Transactional
    public void delete(Long id) {
        categoryRepository.delete(findById(id));
    }

    public Category findById(Long id) {
        return categoryRepository.findById(id)
            .orElseThrow(() -> BusinessException.notFound("카테고리"));
    }
}
