package com.quitq.service;

import com.quitq.daoimpl.ProductDaoImpl;
import com.quitq.entity.Product;

import java.util.List;

public class ProductService {

    private ProductDaoImpl dao;

    public ProductService(ProductDaoImpl dao) {
        this.dao = dao;
    }

    public void addProduct(Product product) {

        if(product.getPrice() <= 0) {
            throw new RuntimeException("Invalid product price");
        }

        dao.insert(product);
    }

    public void deleteProduct(int id) {
        dao.delete(id);
    }

    public Product getProductById(int id) {
        return dao.getById(id);
    }

    public List<Product> getAllProducts() {
        return dao.getAll();
    }

    public void updateProduct(Product product) {
        dao.update(product);
    }
}