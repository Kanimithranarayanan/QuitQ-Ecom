package com.quitq.dto;

import com.quitq.enums.OrderStatus;
import com.quitq.enums.PaymentMethod;

import java.time.Instant;

public record OrderRespDto(
        int orderId,
        String productName,
        String customerName,
        int quantity,
        double totalAmount,     // item total = price * quantity (unchanged meaning)
        double deliveryCharge,  // 2% of totalAmount
        double grandTotal,      // totalAmount + deliveryCharge — amount payable
        String shippingAddress,
        OrderStatus orderStatus,
        PaymentMethod paymentMethod,
        String orderGroupId,
        Instant createdAt
) {
}
