package com.app.dao_impl;

import com.app.dao.AuthDao;
import com.app.model.User;
import jakarta.persistence.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

@Repository
@Transactional
public class AuthDaoImpl implements AuthDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public User login(String username, String password) {

        String hql =
                "FROM User WHERE username=:u AND password=:p";

        TypedQuery<User> query =
                entityManager.createQuery(hql, User.class);

        query.setParameter("u", username);
        query.setParameter("p", password);

        return query.getSingleResult();
    }
}