package com.quitq.dto;

/**
 * A single product's sales performance, used to show "top selling products"
 * in the admin sales report (overall, or within a specific month).
 */
public record ProductSalesDto(
        int productId,
        String productName,
        String sellerName,
        int unitsSold,
        double revenue
) {
}
