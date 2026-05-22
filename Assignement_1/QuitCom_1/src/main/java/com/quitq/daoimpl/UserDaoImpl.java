package com.quitq.daoimpl;

import com.quitq.dao.UserDao;
import com.quitq.entity.User;
import org.hibernate.Session;
import org.hibernate.Transaction;

import java.util.List;

public class UserDaoImpl implements UserDao {

    private Session session;

    public UserDaoImpl(Session session) {
        this.session = session;
    }

    @Override
    public void insert(User user) {

        Transaction tx = session.beginTransaction();

        session.persist(user);

        tx.commit();

        System.out.println("User inserted");
    }

    @Override
    public void delete(int id) {

        User user = session.get(User.class, id);

        if(user != null) {

            Transaction tx = session.beginTransaction();

            session.remove(user);

            tx.commit();

            System.out.println("User deleted");
        }
    }

    @Override
    public User getById(int id) {

        return session.get(User.class, id);
    }

    @Override
    public List<User> getAll() {

        return session
                .createQuery("from User", User.class)
                .list();
    }

    @Override
    public void update(User user) {

        Transaction tx = session.beginTransaction();

        session.merge(user);

        tx.commit();

        System.out.println("User updated");
    }
}