package com.quitq.dao;

import com.quitq.entity.Cart;

import java.util.List;

public interface CartDao {

    void insert(Cart cart);

    void delete(int id);

    Cart getById(int id);

    List<Cart> getAll();

    void update(Cart cart);
}