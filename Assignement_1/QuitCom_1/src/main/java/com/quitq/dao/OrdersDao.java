package com.quitq.dao;

import com.quitq.entity.Orders;

import java.util.List;

public interface OrdersDao {

    void insert(Orders orders);

    void delete(int id);

    Orders getById(int id);

    List<Orders> getAll();

    void update(Orders orders);
}