package com.quitq.dto;

import java.util.List;

/**
 * Full payload for the admin "Sales Report" screen:
 * - revenue broken down month by month
 * - the best-selling products overall
 * - a few headline totals
 */
public record SalesReportDto(
        List<MonthlyRevenueDto> monthlyRevenue,
        List<ProductSalesDto> topProducts,
        double totalRevenue,
        int totalOrders,
        int totalItemsSold
) {
}
