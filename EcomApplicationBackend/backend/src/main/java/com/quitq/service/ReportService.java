package com.quitq.service;

import com.quitq.dto.MonthlyRevenueDto;
import com.quitq.dto.ProductSalesDto;
import com.quitq.dto.SalesReportDto;
import com.quitq.enums.OrderStatus;
import com.quitq.model.Order;
import com.quitq.model.Product;
import com.quitq.repository.OrderRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.format.TextStyle;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Builds the admin "Sales Report": revenue by month and best-selling products.
 *
 * Note: this reports REVENUE (total sale value), not profit. Profit can't be
 * computed because products only store a selling price, not a cost price.
 * CANCELLED orders are excluded everywhere in this report since they didn't
 * result in an actual sale.
 */
@Service
@AllArgsConstructor
public class ReportService {

    private final OrderRepository orderRepository;

    public SalesReportDto getSalesReport() {
        List<Order> validOrders = orderRepository.findAll().stream()
                .filter(o -> o.getOrderStatus() != OrderStatus.CANCELLED)
                .toList();

        List<MonthlyRevenueDto> monthlyRevenue = buildMonthlyRevenue(validOrders);
        List<ProductSalesDto> topProducts = buildTopProducts(validOrders);

        double totalRevenue = validOrders.stream().mapToDouble(Order::getTotalAmount).sum();
        int totalItemsSold = validOrders.stream().mapToInt(Order::getQuantity).sum();

        return new SalesReportDto(
                monthlyRevenue,
                topProducts,
                totalRevenue,
                validOrders.size(),
                totalItemsSold
        );
    }

    private List<MonthlyRevenueDto> buildMonthlyRevenue(List<Order> orders) {
        Map<String, List<Order>> byMonth = orders.stream()
                .collect(Collectors.groupingBy(o ->
                        o.getCreatedAt().atZone(ZoneId.systemDefault())
                                .toLocalDate()
                                .withDayOfMonth(1)
                                .toString().substring(0, 7) // "yyyy-MM"
                ));

        return byMonth.entrySet().stream()
                .map(entry -> {
                    String monthKey = entry.getKey(); // yyyy-MM
                    List<Order> monthOrders = entry.getValue();

                    double revenue = monthOrders.stream().mapToDouble(Order::getTotalAmount).sum();
                    int itemsSold = monthOrders.stream().mapToInt(Order::getQuantity).sum();

                    int year = Integer.parseInt(monthKey.substring(0, 4));
                    int monthNum = Integer.parseInt(monthKey.substring(5, 7));
                    String monthName = java.time.Month.of(monthNum).getDisplayName(TextStyle.FULL, Locale.ENGLISH);

                    return new MonthlyRevenueDto(
                            monthKey,
                            monthName + " " + year,
                            revenue,
                            monthOrders.size(),
                            itemsSold
                    );
                })
                .sorted(Comparator.comparing(MonthlyRevenueDto::month).reversed())
                .toList();
    }

    private List<ProductSalesDto> buildTopProducts(List<Order> orders) {
        Map<Integer, List<Order>> byProduct = orders.stream()
                .collect(Collectors.groupingBy(o -> o.getProduct().getId()));

        return byProduct.values().stream()
                .map(productOrders -> {
                    Product product = productOrders.get(0).getProduct();
                    int unitsSold = productOrders.stream().mapToInt(Order::getQuantity).sum();
                    double revenue = productOrders.stream().mapToDouble(Order::getTotalAmount).sum();

                    return new ProductSalesDto(
                            product.getId(),
                            product.getProductName(),
                            product.getSeller() != null ? product.getSeller().getName() : "",
                            unitsSold,
                            revenue
                    );
                })
                .sorted(Comparator.comparingInt(ProductSalesDto::unitsSold).reversed())
                .toList();
    }
}
