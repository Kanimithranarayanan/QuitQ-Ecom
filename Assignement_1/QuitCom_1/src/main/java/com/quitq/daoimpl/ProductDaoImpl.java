package com.quitq.daoimpl;

import com.quitq.dao.ProductDao;
import com.quitq.entity.Product;
import org.hibernate.Session;
import org.hibernate.Transaction;

import java.util.List;

public class ProductDaoImpl implements ProductDao {

    private Session session;

    public ProductDaoImpl(Session session) {
        this.session = session;
    }

    @Override
    public void insert(Product product) {

        Transaction tx = session.beginTransaction();

        session.persist(product);

        tx.commit();

        System.out.println("Product inserted");
    }

    @Override
    public void delete(int id) {

        Product product = session.get(Product.class, id);

        if(product != null) {

            Transaction tx = session.beginTransaction();

            session.remove(product);

            tx.commit();

            System.out.println("Product deleted");
        }
    }

    @Override
    public Product getById(int id) {

        return session.get(Product.class, id);
    }

    @Override
    public List<Product> getAll() {

        return session
                .createQuery("from Product", Product.class)
                .list();
    }

    @Override
    public void update(Product product) {

        Transaction tx = session.beginTransaction();

        session.merge(product);

        tx.commit();

        System.out.println("Product updated");
    }
}