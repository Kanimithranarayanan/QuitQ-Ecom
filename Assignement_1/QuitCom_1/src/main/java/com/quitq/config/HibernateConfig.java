package com.quitq.config;

import com.quitq.entity.*;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

public class HibernateConfig {

    private static SessionFactory sessionFactory;

    public static SessionFactory getSessionFactory() {

        if (sessionFactory == null) {

            Configuration cfg = new Configuration();

            cfg.configure("hibernate.cfg.xml");

            cfg.addAnnotatedClass(User.class);
            cfg.addAnnotatedClass(Category.class);
            cfg.addAnnotatedClass(Product.class);
            cfg.addAnnotatedClass(Cart.class);
            cfg.addAnnotatedClass(Orders.class);

            sessionFactory = cfg.buildSessionFactory();
        }

        return sessionFactory;
    }
}