package com.pknu26.ecommerce.domain.product.entity;

import com.pknu26.ecommerce.util.BaseEntity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Product extends BaseEntity {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long id;
 
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
 
    @Column(name = "name", nullable = false, length = 200)
    private String name;
 
    @Column(name = "price", nullable = false)
    private Integer price;
 
    @Column(name = "stock_qty")
    private Integer stockQty = 0;
 
    @Lob
    @Column(name = "description")
    private String description;
 
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 10)
    private ProductStatus status = ProductStatus.ON_SALE;
 
    @Builder
    public Product(Category category, String name, Integer price,
                   Integer stockQty, String description) {
        this.category = category;
        this.name = name;
        this.price = price;
        this.stockQty = stockQty;
        this.description = description;
    }
 
    // 재고 감소
    public void decreaseStock(int quantity) {
        if (this.stockQty < quantity) {
            throw new IllegalStateException("재고가 부족합니다.");
        }
        this.stockQty -= quantity;
        if (this.stockQty == 0) {
            this.status = ProductStatus.SOLD_OUT;
        }
    }
 
    // 재고 복구
    public void increaseStock(int quantity) {
        this.stockQty += quantity;
        if (this.status == ProductStatus.SOLD_OUT && this.stockQty > 0) {
            this.status = ProductStatus.ON_SALE;
        }
    }
 
    public void update(String name, Integer price, Integer stockQty,
                       String description, Category category) {
        this.name = name;
        this.price = price;
        this.stockQty = stockQty;
        this.description = description;
        this.category = category;
    }
 
    public void hide() { this.status = ProductStatus.HIDDEN; }
    public void show() { this.status = ProductStatus.ON_SALE; }
 
    public enum ProductStatus { ON_SALE, SOLD_OUT, HIDDEN }
}
