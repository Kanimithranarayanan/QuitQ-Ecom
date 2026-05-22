package com.quitq.service;

import com.quitq.daoimpl.CategoryDaoImpl;
import com.quitq.entity.Category;

import java.util.List;

public class CategoryService {

    private CategoryDaoImpl dao;

    public CategoryService(CategoryDaoImpl dao) {
        this.dao = dao;
    }

    public void addCategory(Category category) {

        if(category.getCategoryName().isEmpty()) {
            throw new RuntimeException("Category name required");
        }

        dao.insert(category);
    }

    public void deleteCategory(int id) {
        dao.delete(id);
    }

    public Category getCategoryById(int id) {
        return dao.getById(id);
    }

    public List<Category> getAllCategories() {
        return dao.getAll();
    }

    public void updateCategory(Category category) {
        dao.update(category);
    }
}