package com.quitq.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cart")

public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int quantity;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    public Cart() {
    }

    public Cart(int quantity, User user, Product product) {
        this.quantity = quantity;
        this.user = user;
        this.product = product;
    }

    // Getter for id
    public int getId() {
        return id;
    }

    // Setter for id
    public void setId(int id) {
        this.id = id;
    }

    // Getter for quantity
    public int getQuantity() {
        return quantity;
    }

    // Setter for quantity
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    // Getter for user
    public User getUser() {
        return user;
    }

    // Setter for user
    public void setUser(User user) {
        this.user = user;
    }

    // Getter for product
    public Product getProduct() {
        return product;
    }

    // Setter for product
    public void setProduct(Product product) {
        this.product = product;
    }
}