package com.quitq.dto;

/**
 * Revenue figures for a single calendar month, used in the admin sales report.
 * "Revenue" here means total sale value of orders (excludes CANCELLED orders),
 * not profit — profit isn't computable since products don't store a cost price.
 */
public record MonthlyRevenueDto(
        String month,      // e.g. "2026-06"
        String monthLabel, // e.g. "June 2026"
        double revenue,
        int ordersCount,
        int itemsSold
) {
}
