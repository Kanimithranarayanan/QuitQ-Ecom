package com.quitq.main;

import com.quitq.config.HibernateConfig;
import com.quitq.daoimpl.*;
import com.quitq.entity.*;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

import java.time.LocalDateTime;
import java.util.List;

public class MainApp {

    public static void main(String[] args) {

        SessionFactory factory = HibernateConfig.getSessionFactory();
        Session session = factory.openSession();
        CategoryDaoImpl categoryDao = new CategoryDaoImpl(session);
        UserDaoImpl userDao = new UserDaoImpl(session);
        ProductDaoImpl productDao = new ProductDaoImpl(session);
        CartDaoImpl cartDao = new CartDaoImpl(session);
        OrdersDaoImpl ordersDao = new OrdersDaoImpl(session);

        try {

            Category category = new Category();
            category.setCategoryName("Electronics");

            categoryDao.insert(category);
            User seller = new User();

            seller.setUsername("electronics_hub");
            seller.setPassword("seller123");

           
            seller.setEmail("sales" + System.currentTimeMillis() + "@ehub.com");

            seller.setRole("seller");
            seller.setName("EHub Electronics");
            seller.setContactNumber("9876543210");
            seller.setAddress("Chennai");

            userDao.insert(seller);

            User customer = new User();

            customer.setUsername("john_customer");
            customer.setPassword("john123");  
            customer.setEmail("john" + System.currentTimeMillis() + "@gmail.com");

            customer.setRole("customer");
            customer.setName("John Doe");
            customer.setContactNumber("9999999999");
            customer.setAddress("Bangalore");

            userDao.insert(customer);
            Product product = new Product();

            product.setProductName("Gaming Laptop");
            product.setDescription("16GB RAM Laptop");
            product.setPrice(85000);
            product.setStockQuantity(10);

            product.setCategory(category);
            product.setSeller(seller);

            productDao.insert(product);

            Cart cart = new Cart();

            cart.setQuantity(2);
            cart.setUser(customer);
            cart.setProduct(product);

            cartDao.insert(cart);
            Orders order = new Orders();

            order.setUser(customer);
            order.setOrderDate(LocalDateTime.now());
            order.setTotalAmount(170000);
            order.setStatus("processing");
            order.setShippingAddress("Chennai");

            ordersDao.insert(order);

            System.out.println("\n===== USERS =====");

            List<User> users = userDao.getAll();

            for(User u : users) {

                System.out.println(
                        u.getId() + " "
                                + u.getUsername() + " "
                                + u.getEmail()
                );
            }

            System.out.println("\n===== PRODUCT =====");

            Product fetchedProduct = productDao.getById(product.getId());

            if(fetchedProduct != null) {

                System.out.println(
                        fetchedProduct.getProductName()
                                + " - "
                                + fetchedProduct.getPrice()
                );
            }

            fetchedProduct.setPrice(90000);

            productDao.update(fetchedProduct);

            System.out.println("\nProduct Updated");


            cartDao.delete(cart.getId());

            System.out.println("\nCart Deleted");

        }

        catch (Exception e) {

            e.printStackTrace();
        }

        finally {

            session.close();
            factory.close();
        }
    }
}
