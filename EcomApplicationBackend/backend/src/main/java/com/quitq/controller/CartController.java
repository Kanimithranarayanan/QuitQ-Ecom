package com.quitq.controller;

import com.quitq.dto.CartReqDto;
import com.quitq.dto.CartSummaryDto;
import com.quitq.service.CartService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@AllArgsConstructor
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

    private final CartService cartService;

    @GetMapping("/my-cart")
    public CartSummaryDto getMyCart(Principal principal) {
        return cartService.getCartByCustomerUsername(principal.getName());
    }

    @PostMapping("/add")
    public void addToCart(@Valid @RequestBody CartReqDto dto, Principal principal) {
        cartService.addToCart(dto, principal.getName());
    }

    @PutMapping("/update/{cartId}")
    public void updateQuantity(@PathVariable int cartId, @RequestParam int quantity) {
        cartService.updateQuantity(cartId, quantity);
    }

    @DeleteMapping("/remove/{cartId}")
    public void removeFromCart(@PathVariable int cartId) {
        cartService.removeFromCart(cartId);
    }

    @DeleteMapping("/clear")
    public void clearCart(Principal principal) {
        cartService.clearCart(principal.getName());
    }
}
