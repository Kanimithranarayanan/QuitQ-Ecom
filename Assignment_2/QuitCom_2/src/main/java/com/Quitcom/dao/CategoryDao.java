package com.quitq.dao;

import com.quitq.model.Category;

import java.util.List;

public interface CategoryDao {

    void insert(Category category);

    void update(Category category);

    void delete(int id);

    Category getById(int id);

    List<Category> getAll();
}