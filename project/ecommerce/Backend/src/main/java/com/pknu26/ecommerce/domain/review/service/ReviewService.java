package com.pknu26.ecommerce.domain.review.service;

import com.pknu26.ecommerce.domain.analytics.entity.BehaviorLog.ActionType;
import com.pknu26.ecommerce.domain.analytics.service.BehaviorLogService;
import com.pknu26.ecommerce.domain.member.entity.Member;
import com.pknu26.ecommerce.domain.member.repository.MemberRepository;
import com.pknu26.ecommerce.domain.order.entity.Order.OrderStatus;
import com.pknu26.ecommerce.domain.order.repository.OrderRepository;
import com.pknu26.ecommerce.domain.product.entity.Product;
import com.pknu26.ecommerce.domain.product.service.ProductService;
import com.pknu26.ecommerce.domain.review.dto.ReviewDto;
import com.pknu26.ecommerce.domain.review.entity.Review;
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
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final MemberRepository memberRepository;
    private final ProductService productService;
    private final OrderRepository orderRepository;
    private final BehaviorLogService behaviorLogService;

    public PageResponse<ReviewDto.ReviewResponse> getByProduct(Long productId, Pageable pageable) {
        return PageResponse.of(
            reviewRepository.findByProductIdOrderByCreatedAtDesc(productId, pageable)
                .map(ReviewDto.ReviewResponse::from)
        );
    }

    public PageResponse<ReviewDto.ReviewResponse> getMyReviews(Long memberId, Pageable pageable) {
        return PageResponse.of(
            reviewRepository.findByMemberIdOrderByCreatedAtDesc(memberId, pageable)
                .map(ReviewDto.ReviewResponse::from)
        );
    }

    @Transactional
    public ReviewDto.ReviewResponse create(Long memberId, ReviewDto.CreateRequest request) {
        if (reviewRepository.existsByMemberIdAndProductId(memberId, request.getProductId())) {
            throw BusinessException.conflict("이미 리뷰를 작성한 상품입니다.");
        }

        boolean hasPurchased = orderRepository
            .findByMemberIdAndStatus(memberId, OrderStatus.DELIVERED)
            .stream()
            .flatMap(o -> o.getOrderItems().stream())
            .anyMatch(item -> item.getProduct().getId().equals(request.getProductId()));

        if (!hasPurchased) {
            throw BusinessException.badRequest("구매 확정된 상품에만 리뷰를 작성할 수 있습니다.");
        }

        Member member = memberRepository.findActiveById(memberId)
            .orElseThrow(() -> BusinessException.notFound("회원"));
        Product product = productService.findById(request.getProductId());

        Review review = Review.builder()
            .member(member)
            .product(product)
            .rating(request.getRating())
            .content(request.getContent())
            .build();

        behaviorLogService.log(memberId, product.getId(), ActionType.REVIEW, null, null, null);
        return ReviewDto.ReviewResponse.from(reviewRepository.save(review));
    }

    @Transactional
    public ReviewDto.ReviewResponse update(Long memberId, Long reviewId, ReviewDto.UpdateRequest request) {
        Review review = findByIdAndMember(memberId, reviewId);
        review.update(request.getRating(), request.getContent());
        return ReviewDto.ReviewResponse.from(review);
    }

    @Transactional
    public void delete(Long memberId, Long reviewId) {
        reviewRepository.delete(findByIdAndMember(memberId, reviewId));
    }

    private Review findByIdAndMember(Long memberId, Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> BusinessException.notFound("리뷰"));
        if (!review.getMember().getId().equals(memberId)) {
            throw BusinessException.forbidden("본인의 리뷰만 수정/삭제할 수 있습니다.");
        }
        return review;
    }
}
