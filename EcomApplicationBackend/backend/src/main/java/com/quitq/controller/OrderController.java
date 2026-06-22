package com.quitq.controller;

import com.quitq.dto.CheckoutReqDto;
import com.quitq.dto.OrderGroupRespDto;
import com.quitq.dto.OrderReqDto;
import com.quitq.dto.OrderRespDto;
import com.quitq.enums.OrderStatus;
import com.quitq.service.OrderService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/order")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/place")
    public OrderRespDto placeOrder(@Valid @RequestBody OrderReqDto dto, Principal principal) {
        return orderService.placeOrder(dto, principal.getName());
    }

    /**
     * Customer checks out their entire cart in one go (Cash on Delivery).
     * Creates one Order per cart item, grouped under one orderGroupId.
     */
    @PostMapping("/checkout-cart")
    public OrderGroupRespDto checkoutCart(@Valid @RequestBody CheckoutReqDto dto, Principal principal) {
        return orderService.placeOrderFromCart(dto, principal.getName());
    }

    @GetMapping("/my-orders")
    public List<OrderRespDto> getMyOrders(Principal principal) {
        return orderService.getOrdersByCustomerUsername(principal.getName());
    }

    @GetMapping("/seller-orders")
    public List<OrderRespDto> getSellerOrders(Principal principal) {
        return orderService.getOrdersBySellerUsername(principal.getName());
    }

    @GetMapping("/all")
    public List<OrderRespDto> getAll() {
        return orderService.getAll();
    }

    @PutMapping("/update-status/{orderId}")
    public void updateOrderStatus(@PathVariable int orderId,
                                  @RequestParam OrderStatus orderStatus) {
        orderService.updateOrderStatus(orderId, orderStatus);
    }

    @GetMapping("/by-status")
    public List<OrderRespDto> getByStatus(@RequestParam OrderStatus orderStatus) {
        return orderService.getOrdersByStatus(orderStatus);
    }

    /**
     * Customer cancels their own PLACED order.
     * Stock is restored automatically.
     */
    @PutMapping("/cancel/{orderId}")
    public ResponseEntity<String> cancelOrder(@PathVariable int orderId, Principal principal) {
        orderService.cancelOrder(orderId, principal.getName());
        return ResponseEntity.ok("Order cancelled successfully. Stock has been restored.");
    }
}
