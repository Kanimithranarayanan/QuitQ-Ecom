package com.quitq.service;

import com.quitq.dto.CheckoutReqDto;
import com.quitq.dto.OrderGroupRespDto;
import com.quitq.dto.OrderReqDto;
import com.quitq.dto.OrderRespDto;
import com.quitq.enums.OrderStatus;
import com.quitq.enums.PaymentMethod;
import com.quitq.exception.OutOfStockException;
import com.quitq.exception.ResourceNotFoundException;
import com.quitq.mapper.OrderMapper;
import com.quitq.model.Cart;
import com.quitq.model.Customer;
import com.quitq.model.Order;
import com.quitq.model.Product;
import com.quitq.repository.CartRepository;
import com.quitq.repository.OrderRepository;
import com.quitq.repository.ProductRepository;
import com.quitq.utility.DeliveryChargeUtility;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CustomerService customerService;
    private final ProductService productService;
    private final OrderMapper orderMapper;
    private final CartRepository cartRepository;

    /**
     * Places a single direct "Buy Now" order. Delivery charge is 2% of the
     * item total (see DeliveryChargeUtility). Returns the created order's
     * details (including the price breakdown) so the frontend can show a
     * confirmation with item total, delivery charge, and grand total.
     */
    public OrderRespDto placeOrder(OrderReqDto dto, String customerUsername) {
        Customer customer = customerService.getByUsername(customerUsername);
        Product product = productService.getById(dto.productId());

        if (product.getStockQuantity() < dto.quantity()) {
            throw new OutOfStockException("Insufficient stock for product: " + product.getProductName());
        }

        double itemTotal = product.getPrice() * dto.quantity();

        Order order = new Order();
        order.setCustomer(customer);
        order.setProduct(product);
        order.setQuantity(dto.quantity());
        order.setTotalAmount(itemTotal);
        order.setDeliveryCharge(DeliveryChargeUtility.calculate(itemTotal));
        order.setShippingAddress(dto.shippingAddress());
        order.setOrderStatus(OrderStatus.PLACED);

        product.setStockQuantity(product.getStockQuantity() - dto.quantity());
        productRepository.save(product);

        Order saved = orderRepository.save(order);
        return orderMapper.entityToDto(saved);
    }

    /**
     * Places one Order per item currently in the customer's cart, all sharing
     * the same orderGroupId so they can be shown together as a single checkout.
     * Only Cash on Delivery is supported. Stock is validated and reduced for
     * every item before any order is saved; the cart is cleared on success.
     */
    @Transactional
    public OrderGroupRespDto placeOrderFromCart(CheckoutReqDto dto, String customerUsername) {
        Customer customer = customerService.getByUsername(customerUsername);
        List<Cart> cartItems = cartRepository.findByCustomerUsername(customerUsername);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Your cart is empty");
        }

        // Validate stock for every item first, so we don't partially place the order.
        for (Cart item : cartItems) {
            Product product = item.getProduct();
            if (product.getStockQuantity() < item.getQuantity()) {
                throw new OutOfStockException("Insufficient stock for product: " + product.getProductName());
            }
        }

        PaymentMethod paymentMethod = dto.paymentMethod() != null ? dto.paymentMethod() : PaymentMethod.CASH_ON_DELIVERY;
        String groupId = UUID.randomUUID().toString();
        List<Order> createdOrders = new ArrayList<>();

        for (Cart item : cartItems) {
            Product product = item.getProduct();
            double itemTotal = product.getPrice() * item.getQuantity();

            Order order = new Order();
            order.setCustomer(customer);
            order.setProduct(product);
            order.setQuantity(item.getQuantity());
            order.setTotalAmount(itemTotal);
            order.setDeliveryCharge(DeliveryChargeUtility.calculate(itemTotal));
            order.setShippingAddress(dto.shippingAddress());
            order.setOrderStatus(OrderStatus.PLACED);
            order.setPaymentMethod(paymentMethod);
            order.setOrderGroupId(groupId);

            product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
            productRepository.save(product);

            createdOrders.add(orderRepository.save(order));
        }

        // Cart is now checked out — clear it.
        cartRepository.deleteAll(cartItems);

        List<OrderRespDto> orderDtos = createdOrders.stream()
                .map(orderMapper::entityToDto)
                .toList();
        double itemsTotal = orderDtos.stream().mapToDouble(OrderRespDto::totalAmount).sum();
        double deliveryTotal = orderDtos.stream().mapToDouble(OrderRespDto::deliveryCharge).sum();
        int totalQuantity = orderDtos.stream().mapToInt(OrderRespDto::quantity).sum();

        return new OrderGroupRespDto(groupId, orderDtos, itemsTotal, deliveryTotal, itemsTotal + deliveryTotal, totalQuantity);
    }

    public List<OrderRespDto> getOrdersByCustomerUsername(String customerUsername) {
        List<Order> list = orderRepository.findByCustomerUsername(customerUsername);
        return list.stream()
                .map(orderMapper::entityToDto)
                .toList();
    }

    public List<OrderRespDto> getOrdersBySellerUsername(String sellerUsername) {
        List<Order> list = orderRepository.findBySellerUsername(sellerUsername);
        return list.stream()
                .map(orderMapper::entityToDto)
                .toList();
    }

    public List<OrderRespDto> getAll() {
        List<Order> list = orderRepository.findAll();
        return list.stream()
                .map(orderMapper::entityToDto)
                .toList();
    }

    /**
     * Used by Admin/Seller to move an order through PLACED -> PROCESSING -> SHIPPED -> DELIVERED.
     * Cancelling an order is intentionally NOT allowed here — that is reserved for the
     * customer-only cancelOrder() method below, so only the customer who placed an
     * order can cancel it (and have their stock restored).
     */
    public void updateOrderStatus(int orderId, OrderStatus orderStatus) {
        if (orderStatus == OrderStatus.CANCELLED) {
            throw new RuntimeException("Orders can only be cancelled by the customer who placed them");
        }
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid order id"));
        order.setOrderStatus(orderStatus);
        orderRepository.save(order);
    }

    public List<OrderRespDto> getOrdersByStatus(OrderStatus orderStatus) {
        List<Order> list = orderRepository.findByOrderStatus(orderStatus);
        return list.stream()
                .map(orderMapper::entityToDto)
                .toList();
    }

    /**
     * Customer cancels their own order.
     * Only PLACED orders can be cancelled; stock is restored.
     */
    @Transactional
    public void cancelOrder(int orderId, String customerUsername) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid order id"));

        // Ensure the order belongs to this customer
        if (!order.getCustomer().getUser().getUsername().equals(customerUsername)) {
            throw new RuntimeException("You are not authorized to cancel this order");
        }

        // Only PLACED orders can be cancelled
        if (order.getOrderStatus() != OrderStatus.PLACED) {
            throw new RuntimeException("Only orders with status PLACED can be cancelled. Current status: " + order.getOrderStatus());
        }

        // Restore stock
        Product product = order.getProduct();
        product.setStockQuantity(product.getStockQuantity() + order.getQuantity());
        productRepository.save(product);

        // Update status to CANCELLED
        order.setOrderStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }
}
