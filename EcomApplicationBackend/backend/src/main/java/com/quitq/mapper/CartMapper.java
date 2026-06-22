package com.quitq.mapper;

import com.quitq.dto.CartRespDto;
import com.quitq.model.Cart;
import org.springframework.stereotype.Component;

@Component
public class CartMapper {

    public CartRespDto entityToDto(Cart cart) {
        return new CartRespDto(
                cart.getId(),
                cart.getProduct().getId(),
                cart.getProduct().getProductName(),
                cart.getProduct().getPrice(),
                cart.getQuantity(),
                cart.getProduct().getPrice() * cart.getQuantity(),
                cart.getProduct().getSeller().getName()
        );
    }
}
