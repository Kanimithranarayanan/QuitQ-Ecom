package com.quitq.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Getter
@Setter
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private int rating; // 1 to 5

    private String comment;

    @ManyToOne
    private Product product;

    @ManyToOne
    private Customer customer;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;
}
