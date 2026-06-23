package com.pknu26.ecommerce.domain.cart.service;

import com.pknu26.ecommerce.domain.analytics.entity.BehaviorLog.ActionType;
import com.pknu26.ecommerce.domain.analytics.service.BehaviorLogService;
import com.pknu26.ecommerce.domain.cart.dto.CartDto;
import com.pknu26.ecommerce.domain.cart.entity.Cart;
import com.pknu26.ecommerce.domain.cart.entity.CartItem;
import com.pknu26.ecommerce.domain.cart.repository.CartRepository;
import com.pknu26.ecommerce.domain.member.entity.Member;
import com.pknu26.ecommerce.domain.member.repository.MemberRepository;
import com.pknu26.ecommerce.domain.product.entity.Product;
import com.pknu26.ecommerce.domain.product.service.ProductService;
import com.pknu26.ecommerce.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CartService {

    private final CartRepository cartRepository;
    private final MemberRepository memberRepository;
    private final ProductService productService;
    private final BehaviorLogService behaviorLogService;

    public CartDto.CartResponse getCart(Long memberId) {
        Cart cart = getOrCreateCart(memberId);
        return CartDto.CartResponse.from(cart);
    }

    @Transactional
    public CartDto.CartResponse addItem(Long memberId, CartDto.AddRequest request) {
        Cart cart = getOrCreateCart(memberId);
        Product product = productService.findById(request.getProductId());

        cart.getCartItems().stream()
            .filter(i -> i.getProduct().getId().equals(request.getProductId()))
            .findFirst()
            .ifPresentOrElse(
                existing -> existing.updateQuantity(existing.getQuantity() + request.getQuantity()),
                () -> {
                    CartItem item = CartItem.builder()
                        .cart(cart)
                        .product(product)
                        .quantity(request.getQuantity())
                        .build();
                    cart.addItem(item);
                }
            );

        behaviorLogService.log(memberId, product.getId(), ActionType.ADD_CART, null, null, null);
        return CartDto.CartResponse.from(cart);
    }

    @Transactional
    public CartDto.CartResponse updateItem(Long memberId, Long cartItemId, CartDto.UpdateRequest request) {
        Cart cart = getOrCreateCart(memberId);
        CartItem item = cart.getCartItems().stream()
            .filter(i -> i.getId().equals(cartItemId))
            .findFirst()
            .orElseThrow(() -> BusinessException.notFound("장바구니 상품"));
        item.updateQuantity(request.getQuantity());
        return CartDto.CartResponse.from(cart);
    }

    @Transactional
    public CartDto.CartResponse removeItem(Long memberId, Long cartItemId) {
        Cart cart = getOrCreateCart(memberId);
        CartItem item = cart.getCartItems().stream()
            .filter(i -> i.getId().equals(cartItemId))
            .findFirst()
            .orElseThrow(() -> BusinessException.notFound("장바구니 상품"));
        behaviorLogService.log(memberId, item.getProduct().getId(), ActionType.REMOVE_CART, null, null, null);
        cart.getCartItems().remove(item);
        return CartDto.CartResponse.from(cart);
    }

    @Transactional
    public void clearCart(Long memberId) {
        cartRepository.findByMemberId(memberId).ifPresent(Cart::clear);
    }

    private Cart getOrCreateCart(Long memberId) {
        return cartRepository.findByMemberIdWithItems(memberId).orElseGet(() -> {
            Member member = memberRepository.findActiveById(memberId)
                .orElseThrow(() -> BusinessException.notFound("회원"));
            return cartRepository.save(Cart.builder().member(member).build());
        });
    }
}
