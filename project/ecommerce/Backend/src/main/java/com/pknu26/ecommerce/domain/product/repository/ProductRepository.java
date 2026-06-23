package com.pknu26.ecommerce.domain.product.repository;

import com.pknu26.ecommerce.domain.product.entity.Product;
import com.pknu26.ecommerce.domain.product.entity.Product.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByStatus(ProductStatus status, Pageable pageable);

    Page<Product> findByCategoryIdAndStatus(Long categoryId, ProductStatus status, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.status = 'ON_SALE' AND " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Product> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
}
