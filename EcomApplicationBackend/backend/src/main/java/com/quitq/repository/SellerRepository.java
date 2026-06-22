package com.quitq.repository;

import com.quitq.model.Seller;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SellerRepository extends JpaRepository<Seller, Integer> {
    Seller findByUserUsername(String username);
}
