package com.quitq.service;

import com.quitq.daoimpl.UserDaoImpl;
import com.quitq.entity.User;

import java.util.List;

public class UserService {

    private UserDaoImpl dao;

    public UserService(UserDaoImpl dao) {
        this.dao = dao;
    }

    public void addUser(User user) {

        if(user.getEmail().isEmpty()) {
            throw new RuntimeException("Email cannot be empty");
        }

        dao.insert(user);
    }

    public void deleteUser(int id) {
        dao.delete(id);
    }

    public User getUserById(int id) {
        return dao.getById(id);
    }

    public List<User> getAllUsers() {
        return dao.getAll();
    }

    public void updateUser(User user) {
        dao.update(user);
    }
}