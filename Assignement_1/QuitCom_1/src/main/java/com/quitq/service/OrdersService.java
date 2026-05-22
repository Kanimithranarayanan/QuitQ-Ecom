package com.quitq.service;

import com.quitq.daoimpl.OrdersDaoImpl;
import com.quitq.entity.Orders;

import java.util.List;

public class OrdersService {

    private OrdersDaoImpl dao;

    public OrdersService(OrdersDaoImpl dao) {
        this.dao = dao;
    }

    public void placeOrder(Orders orders) {

        if(orders.getTotalAmount() <= 0) {
            throw new RuntimeException("Invalid order amount");
        }

        dao.insert(orders);
    }

    public void deleteOrder(int id) {
        dao.delete(id);
    }

    public Orders getOrderById(int id) {
        return dao.getById(id);
    }

    public List<Orders> getAllOrders() {
        return dao.getAll();
    }

    public void updateOrder(Orders orders) {
        dao.update(orders);
    }
}