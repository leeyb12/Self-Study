package com.pknu26.ecommerce.domain.review.repository;

import com.pknu26.ecommerce.domain.review.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    Page<Review> findByProductIdOrderByCreatedAtDesc(Long productId, Pageable pageable);

    Page<Review> findByMemberIdOrderByCreatedAtDesc(Long memberId, Pageable pageable);

    boolean existsByMemberIdAndProductId(Long memberId, Long productId);

    Optional<Review> findByMemberIdAndProductId(Long memberId, Long productId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId")
    Double findAverageRatingByProductId(@Param("productId") Long productId);
}
