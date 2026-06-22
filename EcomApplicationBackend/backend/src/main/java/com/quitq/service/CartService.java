package com.quitq.service;

import com.quitq.dto.CartReqDto;
import com.quitq.dto.CartRespDto;
import com.quitq.dto.CartSummaryDto;
import com.quitq.exception.OutOfStockException;
import com.quitq.exception.ResourceNotFoundException;
import com.quitq.mapper.CartMapper;
import com.quitq.model.Cart;
import com.quitq.model.Customer;
import com.quitq.model.Product;
import com.quitq.repository.CartRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CustomerService customerService;
    private final ProductService productService;
    private final CartMapper cartMapper;

    public void addToCart(CartReqDto dto, String customerUsername) {
        Customer customer = customerService.getByUsername(customerUsername);
        Product product = productService.getById(dto.productId());

        if (product.getStockQuantity() < dto.quantity()) {
            throw new OutOfStockException("Insufficient stock for product: " + product.getProductName());
        }

        Optional<Cart> existingCart = cartRepository.findByCustomerIdAndProductId(customer.getId(), product.getId());

        if (existingCart.isPresent()) {
            Cart cart = existingCart.get();
            cart.setQuantity(cart.getQuantity() + dto.quantity());
            cartRepository.save(cart);
        } else {
            Cart cart = new Cart();
            cart.setCustomer(customer);
            cart.setProduct(product);
            cart.setQuantity(dto.quantity());
            cartRepository.save(cart);
        }
    }

    public CartSummaryDto getCartByCustomerUsername(String customerUsername) {
        List<Cart> list = cartRepository.findByCustomerUsername(customerUsername);
        List<CartRespDto> items = list.stream()
                .map(cartMapper::entityToDto)
                .toList();
        double grandTotal = items.stream()
                .mapToDouble(CartRespDto::totalPrice)
                .sum();
        return new CartSummaryDto(items, grandTotal);
    }

    public void updateQuantity(int cartId, int quantity) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid cart id"));
        cart.setQuantity(quantity);
        cartRepository.save(cart);
    }

    public void removeFromCart(int cartId) {
        cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid cart id"));
        cartRepository.deleteById(cartId);
    }

    public void clearCart(String customerUsername) {
        List<Cart> list = cartRepository.findByCustomerUsername(customerUsername);
        cartRepository.deleteAll(list);
    }

    public Cart getById(int id) {
        return cartRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid cart id"));
    }
}
