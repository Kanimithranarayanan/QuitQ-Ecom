package com.quitq.service;

import com.quitq.daoimpl.CartDaoImpl;
import com.quitq.entity.Cart;

import java.util.List;

public class CartService {

    private CartDaoImpl dao;

    public CartService(CartDaoImpl dao) {
        this.dao = dao;
    }

    public void addToCart(Cart cart) {

        // CORRECT
        if(cart.getQuantity() <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        dao.insert(cart);
    }

    public void deleteCart(int id) {
        dao.delete(id);
    }

    public Cart getCartById(int id) {
        return dao.getById(id);
    }

    public List<Cart> getAllCartItems() {
        return dao.getAll();
    }

    public void updateCart(Cart cart) {
        dao.update(cart);
    }
}