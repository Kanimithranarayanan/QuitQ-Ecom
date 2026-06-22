package com.quitq.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // Just the filename is stored in DB
    private String imagePath;

    @ManyToOne
    private Product product;
}
