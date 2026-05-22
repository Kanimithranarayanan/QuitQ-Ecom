package com.quitq.dao;

import com.quitq.entity.Product;

import java.util.List;

public interface ProductDao {

    void insert(Product product);

    void delete(int id);

    Product getById(int id);

    List<Product> getAll();

    void update(Product product);
}