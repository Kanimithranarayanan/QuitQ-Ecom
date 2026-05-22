package com.quitq.daoimpl;

import com.quitq.dao.OrdersDao;
import com.quitq.entity.Orders;
import org.hibernate.Session;
import org.hibernate.Transaction;

import java.util.List;

public class OrdersDaoImpl implements OrdersDao {

    private Session session;

    public OrdersDaoImpl(Session session) {
        this.session = session;
    }

    @Override
    public void insert(Orders orders) {

        Transaction tx = session.beginTransaction();

        session.persist(orders);

        tx.commit();

        System.out.println("Order inserted");
    }

    @Override
    public void delete(int id) {

        Orders orders = session.get(Orders.class, id);

        if(orders != null) {

            Transaction tx = session.beginTransaction();

            session.remove(orders);

            tx.commit();

            System.out.println("Order deleted");
        }
    }

    @Override
    public Orders getById(int id) {

        return session.get(Orders.class, id);
    }

    @Override
    public List<Orders> getAll() {

        return session
                .createQuery("from Orders", Orders.class)
                .list();
    }

    @Override
    public void update(Orders orders) {

        Transaction tx = session.beginTransaction();

        session.merge(orders);

        tx.commit();

        System.out.println("Order updated");
    }
}