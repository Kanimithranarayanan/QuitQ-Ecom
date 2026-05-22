package com.quitq.dao;

import com.quitq.model.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class CategoryDaoImpl implements CategoryDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void insert(Category category) {

        String sql =
                "insert into categories(category_name) values(?)";

        jdbcTemplate.update(sql,
                category.getCategoryName());
    }

    @Override
    public void update(Category category) {

        String sql =
                "update categories set category_name=? where id=?";

        jdbcTemplate.update(sql,
                category.getCategoryName(),
                category.getId());
    }

    @Override
    public void delete(int id) {

        String sql =
                "delete from categories where id=?";

        jdbcTemplate.update(sql, id);
    }

    @Override
    public Category getById(int id) {

        String sql =
                "select * from categories where id=?";

        RowMapper<Category> rowMapper =
                new RowMapper<Category>() {
                    @Override
                    public Category mapRow(ResultSet rs,
                                           int rowNum)
                            throws SQLException {

                        Category category = new Category();

                        category.setId(rs.getInt("id"));

                        category.setCategoryName(
                                rs.getString("category_name"));

                        return category;
                    }
                };

        return jdbcTemplate.queryForObject(sql,
                rowMapper,
                id);
    }

    @Override
    public List<Category> getAll() {

        String sql =
                "select * from categories";

        RowMapper<Category> rowMapper =
                new RowMapper<Category>() {
                    @Override
                    public Category mapRow(ResultSet rs,
                                           int rowNum)
                            throws SQLException {

                        Category category = new Category();

                        category.setId(rs.getInt("id"));

                        category.setCategoryName(
                                rs.getString("category_name"));

                        return category;
                    }
                };

        return jdbcTemplate.query(sql, rowMapper);
    }
}