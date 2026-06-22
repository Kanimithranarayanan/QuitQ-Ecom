package com.quitq.repository;

import com.quitq.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    List<Product> findByCategoryId(int categoryId);

    List<Product> findBySellerUserUsername(String username);

    @Query("""
            select p from Product p
            where lower(p.productName) like lower(concat('%', ?1, '%'))
            """)
    List<Product> searchByProductName(String keyword);

    @Query("""
            select p from Product p
            where p.price between ?1 and ?2
            """)
    List<Product> findByPriceRange(double minPrice, double maxPrice);
}
