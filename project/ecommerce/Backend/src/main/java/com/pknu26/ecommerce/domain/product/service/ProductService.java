package com.pknu26.ecommerce.domain.product.service;

import com.pknu26.ecommerce.domain.product.dto.ProductDto;
import com.pknu26.ecommerce.domain.product.entity.Category;
import com.pknu26.ecommerce.domain.product.entity.Product;
import com.pknu26.ecommerce.domain.product.entity.Product.ProductStatus;
import com.pknu26.ecommerce.domain.product.repository.ProductRepository;
import com.pknu26.ecommerce.domain.review.repository.ReviewRepository;
import com.pknu26.ecommerce.exception.BusinessException;
import com.pknu26.ecommerce.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryService categoryService;
    private final ReviewRepository reviewRepository;

    public PageResponse<ProductDto.ProductResponse> getProducts(Pageable pageable) {
        return PageResponse.of(
            productRepository.findByStatus(ProductStatus.ON_SALE, pageable)
                .map(p -> ProductDto.ProductResponse.from(p, reviewRepository.findAverageRatingByProductId(p.getId())))
        );
    }

    public PageResponse<ProductDto.ProductResponse> getByCategory(Long categoryId, Pageable pageable) {
        return PageResponse.of(
            productRepository.findByCategoryIdAndStatus(categoryId, ProductStatus.ON_SALE, pageable)
                .map(p -> ProductDto.ProductResponse.from(p, reviewRepository.findAverageRatingByProductId(p.getId())))
        );
    }

    public PageResponse<ProductDto.ProductResponse> search(String keyword, Pageable pageable) {
        return PageResponse.of(
            productRepository.searchByKeyword(keyword, pageable)
                .map(p -> ProductDto.ProductResponse.from(p, reviewRepository.findAverageRatingByProductId(p.getId())))
        );
    }

    public ProductDto.ProductResponse getById(Long id) {
        Product product = findById(id);
        Double avg = reviewRepository.findAverageRatingByProductId(id);
        return ProductDto.ProductResponse.from(product, avg);
    }

    @Transactional
    public ProductDto.ProductResponse create(ProductDto.CreateRequest request) {
        Category category = categoryService.findById(request.getCategoryId());
        Product product = Product.builder()
            .category(category)
            .name(request.getName())
            .price(request.getPrice())
            .stockQty(request.getStockQty() != null ? request.getStockQty() : 0)
            .description(request.getDescription())
            .build();
        return ProductDto.ProductResponse.from(productRepository.save(product));
    }

    @Transactional
    public ProductDto.ProductResponse update(Long id, ProductDto.UpdateRequest request) {
        Product product = findById(id);
        Category category = categoryService.findById(request.getCategoryId());
        product.update(request.getName(), request.getPrice(),
            request.getStockQty(), request.getDescription(), category);
        return ProductDto.ProductResponse.from(product);
    }

    @Transactional
    public void hide(Long id) {
        findById(id).hide();
    }

    @Transactional
    public void show(Long id) {
        findById(id).show();
    }

    public Product findById(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> BusinessException.notFound("상품"));
    }
}
