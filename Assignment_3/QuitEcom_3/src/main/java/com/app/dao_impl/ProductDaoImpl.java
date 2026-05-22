package com.app.dao_impl;

import com.app.dao.ProductDao;
import com.app.exception.ResourceNotFoundException;
import com.app.model.Product;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@Transactional
public class ProductDaoImpl implements ProductDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void addProduct(Product product) {

        entityManager.persist(product);
    }

    @Override
    public List<Product> getAllProducts() {

        return entityManager
                .createQuery("FROM Product", Product.class)
                .getResultList();
    }

    @Override
    public Product getById(int id)
            throws ResourceNotFoundException {

        Product product =
                entityManager.find(Product.class, id);

        if (product == null) {

            throw new ResourceNotFoundException(
                    "Product Id not found");
        }

        return product;
    }

    @Override
    public void update(Product product) {

        entityManager.merge(product);
    }

    @Override
    public void delete(int id)
            throws ResourceNotFoundException {

        Product product = getById(id);

        entityManager.remove(product);
    }
}