package com.pknu26.ecommerce.domain.order.service;

import com.pknu26.ecommerce.domain.analytics.entity.BehaviorLog.ActionType;
import com.pknu26.ecommerce.domain.analytics.service.BehaviorLogService;
import com.pknu26.ecommerce.domain.member.entity.Member;
import com.pknu26.ecommerce.domain.member.repository.MemberRepository;
import com.pknu26.ecommerce.domain.order.dto.OrderDto;
import com.pknu26.ecommerce.domain.order.entity.Order;
import com.pknu26.ecommerce.domain.order.entity.OrderItem;
import com.pknu26.ecommerce.domain.order.repository.OrderRepository;
import com.pknu26.ecommerce.domain.product.entity.Product;
import com.pknu26.ecommerce.domain.product.service.ProductService;
import com.pknu26.ecommerce.exception.BusinessException;
import com.pknu26.ecommerce.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final MemberRepository memberRepository;
    private final ProductService productService;
    private final BehaviorLogService behaviorLogService;

    public PageResponse<OrderDto.OrderResponse> getMyOrders(Long memberId, Pageable pageable) {
        return PageResponse.of(
            orderRepository.findByMemberIdOrderByCreatedAtDesc(memberId, pageable)
                .map(OrderDto.OrderResponse::from)
        );
    }

    public OrderDto.OrderResponse getOrder(Long memberId, Long orderId) {
        Order order = orderRepository.findByIdWithItems(orderId)
            .orElseThrow(() -> BusinessException.notFound("주문"));
        if (!order.getMember().getId().equals(memberId)) {
            throw BusinessException.forbidden("본인의 주문만 조회할 수 있습니다.");
        }
        return OrderDto.OrderResponse.from(order);
    }

    @Transactional
    public OrderDto.OrderResponse create(Long memberId, OrderDto.CreateRequest request) {
        Member member = memberRepository.findActiveById(memberId)
            .orElseThrow(() -> BusinessException.notFound("회원"));

        Order order = Order.builder()
            .member(member)
            .deliveryAddr(request.getDeliveryAddr())
            .paymentMethod(request.getPaymentMethod())
            .build();

        for (OrderDto.OrderItemRequest itemReq : request.getItems()) {
            Product product = productService.findById(itemReq.getProductId());
            product.decreaseStock(itemReq.getQuantity());

            OrderItem orderItem = OrderItem.builder()
                .order(order)
                .product(product)
                .quantity(itemReq.getQuantity())
                .build();
            order.addOrderItem(orderItem);

            behaviorLogService.log(memberId, product.getId(), ActionType.PURCHASE, null, null, null);
        }

        return OrderDto.OrderResponse.from(orderRepository.save(order));
    }

    @Transactional
    public void cancel(Long memberId, Long orderId) {
        Order order = orderRepository.findByIdWithItems(orderId)
            .orElseThrow(() -> BusinessException.notFound("주문"));
        if (!order.getMember().getId().equals(memberId)) {
            throw BusinessException.forbidden("본인의 주문만 취소할 수 있습니다.");
        }
        order.cancel();
        behaviorLogService.log(memberId, null, ActionType.CANCEL, null, null, null);
    }

    // 관리자용
    @Transactional
    public void pay(Long orderId)     { findById(orderId).pay(); }
    @Transactional
    public void ship(Long orderId)    { findById(orderId).ship(); }
    @Transactional
    public void deliver(Long orderId) { findById(orderId).deliver(); }

    private Order findById(Long orderId) {
        return orderRepository.findById(orderId)
            .orElseThrow(() -> BusinessException.notFound("주문"));
    }
}
