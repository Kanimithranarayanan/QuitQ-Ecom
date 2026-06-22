package com.quitq.model;

import com.quitq.enums.OrderStatus;
import com.quitq.enums.PaymentMethod;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Getter
@Setter
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    private Customer customer;

    @ManyToOne
    private Product product;

    private int quantity;

    // Item total = product price * quantity (unchanged meaning, so existing
    // reports/screens that read totalAmount keep working exactly as before).
    private double totalAmount;

    // Delivery charge for this order (currently 2% of totalAmount, see
    // DeliveryChargeUtility). Defaults to 0 so older rows stay valid.
    private double deliveryCharge = 0;

    private String shippingAddress;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    // Payment method used for this order. Defaults to Cash on Delivery in Java,
    // which keeps existing rows (created before this column existed) valid.
    // (Not marked NOT NULL at the DB level so this safely adds to an existing,
    // non-empty "orders" table without a migration failure.)
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod = PaymentMethod.CASH_ON_DELIVERY;

    // Groups together multiple Order rows that were placed in a single
    // cart checkout (one Order row per product, same groupId per checkout).
    // Null for older "Buy Now" orders placed before this feature existed.
    private String orderGroupId;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;
}
