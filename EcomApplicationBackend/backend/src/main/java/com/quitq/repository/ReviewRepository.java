package com.quitq.repository;

import com.quitq.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {

    // Find all reviews for a specific product
    List<Review> findByProductId(int productId);

    // Find all reviews written by a specific customer (by username)
    List<Review> findByCustomerUserUsername(String username);
}
