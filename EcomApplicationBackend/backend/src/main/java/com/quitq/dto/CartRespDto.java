package com.quitq.dto;

public record CartRespDto(
        int cartId,
        int productId,
        String productName,
        double price,
        int quantity,
        double totalPrice,
        String sellerName
) {
}
