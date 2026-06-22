package com.quitq.repository;

import com.quitq.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Integer> {

    List<Cart> findByCustomerId(int customerId);

    @Query("""
            select c from Cart c
            where c.customer.id = ?1 and c.product.id = ?2
            """)
    Optional<Cart> findByCustomerIdAndProductId(int customerId, int productId);

    @Query("""
            select c from Cart c
            where c.customer.user.username = ?1
            """)
    List<Cart> findByCustomerUsername(String username);
}
