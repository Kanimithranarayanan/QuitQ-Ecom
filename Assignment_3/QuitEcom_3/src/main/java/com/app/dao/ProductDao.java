package com.app.dao;

import com.app.exception.ResourceNotFoundException;
import com.app.model.Product;

import java.util.List;

public interface ProductDao {

    void addProduct(Product product);

    List<Product> getAllProducts();

    Product getById(int id) throws ResourceNotFoundException;

    void update(Product product);

    void delete(int id) throws ResourceNotFoundException;
}