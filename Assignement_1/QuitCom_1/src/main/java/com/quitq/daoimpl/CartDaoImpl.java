package com.quitq.daoimpl;

import com.quitq.dao.CartDao;
import com.quitq.entity.Cart;
import org.hibernate.Session;
import org.hibernate.Transaction;

import java.util.List;

public class CartDaoImpl implements CartDao {

    private Session session;

    public CartDaoImpl(Session session) {
        this.session = session;
    }

    @Override
    public void insert(Cart cart) {

        Transaction tx = session.beginTransaction();

        session.persist(cart);

        tx.commit();

        System.out.println("Cart inserted");
    }

    @Override
    public void delete(int id) {

        Cart cart = session.get(Cart.class, id);

        if(cart != null) {

            Transaction tx = session.beginTransaction();

            session.remove(cart);

            tx.commit();

            System.out.println("Cart deleted");
        }
    }

    @Override
    public Cart getById(int id) {

        return session.get(Cart.class, id);
    }

    @Override
    public List<Cart> getAll() {

        return session
                .createQuery("from Cart", Cart.class)
                .list();
    }

    @Override
    public void update(Cart cart) {

        Transaction tx = session.beginTransaction();

        session.merge(cart);

        tx.commit();

        System.out.println("Cart updated");
    }
}