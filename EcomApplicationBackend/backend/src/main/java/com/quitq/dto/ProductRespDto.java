package com.quitq.dto;

import java.util.List;

public record ProductRespDto(
        int productId,
        String productName,
        String description,
        double price,
        int stockQuantity,
        String imageUrl,
        List<String> imagePaths,
        String categoryName,
        String sellerName
) {
}
