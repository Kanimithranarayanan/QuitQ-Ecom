package com.quitq.daoimpl;

import com.quitq.dao.CategoryDao;
import com.quitq.entity.Category;
import org.hibernate.Session;
import org.hibernate.Transaction;

import java.util.List;

public class CategoryDaoImpl implements CategoryDao {

    private Session session;

    public CategoryDaoImpl(Session session) {
        this.session = session;
    }

    @Override
    public void insert(Category category) {

        Transaction tx = session.beginTransaction();

        session.persist(category);

        tx.commit();

        System.out.println("Category inserted");
    }

    @Override
    public void delete(int id) {

        Category category = session.get(Category.class, id);

        if(category != null) {

            Transaction tx = session.beginTransaction();

            session.remove(category);

            tx.commit();

            System.out.println("Category deleted");
        }
    }

    @Override
    public Category getById(int id) {

        return session.get(Category.class, id);
    }

    @Override
    public List<Category> getAll() {

        return session
                .createQuery("from Category", Category.class)
                .list();
    }

    @Override
    public void update(Category category) {

        Transaction tx = session.beginTransaction();

        session.merge(category);

        tx.commit();

        System.out.println("Category updated");
    }
}