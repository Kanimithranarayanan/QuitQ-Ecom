package com.quitq.dao;

import com.quitq.entity.User;

import java.util.List;

public interface UserDao {

    void insert(User user);

    void delete(int id);

    User getById(int id);

    List<User> getAll();

    void update(User user);
}