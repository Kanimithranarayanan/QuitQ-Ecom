package com.quitq.repository;

import com.quitq.enums.OrderStatus;
import com.quitq.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Integer> {

    List<Order> findByCustomerId(int customerId);

    List<Order> findByOrderStatus(OrderStatus orderStatus);

    @Query("""
            select o from Order o
            where o.customer.user.username = ?1
            """)
    List<Order> findByCustomerUsername(String username);

    @Query("""
            select o from Order o
            where o.product.seller.user.username = ?1
            """)
    List<Order> findBySellerUsername(String username);
}
