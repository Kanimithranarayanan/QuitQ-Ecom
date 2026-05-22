package com.app;

import com.app.config.AppConfig;
import com.app.dao.AuthDao;
import com.app.dao.ProductDao;
import com.app.exception.ResourceNotFoundException;
import com.app.model.Category;
import com.app.model.Product;
import com.app.model.User;
import jakarta.persistence.NoResultException;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import java.util.Scanner;

public class App {

    public static void main(String[] args) {

        AnnotationConfigApplicationContext context =
                new AnnotationConfigApplicationContext(AppConfig.class);

        AuthDao authDao =
                context.getBean(AuthDao.class);

        ProductDao productDao =
                context.getBean(ProductDao.class);

        Scanner sc = new Scanner(System.in);

        System.out.println("=================================");
        System.out.println("     QUITQ PRODUCT SYSTEM");
        System.out.println("=================================");

        System.out.println("Enter Username:");
        String username = sc.next();

        System.out.println("Enter Password:");
        String password = sc.next();

        try {

            User user = authDao.login(username, password);

            System.out.println("---------------------------------");
            System.out.println("Login Successful");
            System.out.println("Welcome " + username);
            System.out.println("---------------------------------");

            while (true) {

                System.out.println("\n========= MENU =========");
                System.out.println("1. Add Product");
                System.out.println("2. View All Products");
                System.out.println("3. Update Product");
                System.out.println("4. Delete Product");
                System.out.println("0. Exit");
                System.out.println("========================");

                System.out.println("Enter Choice:");
                int op = sc.nextInt();

                if (op == 0) {

                    System.out.println("Application Closed");
                    break;
                }

                switch (op) {

                    case 1:

                        sc.nextLine();

                        System.out.println("Enter Product Name:");
                        String pname = sc.nextLine();

                        System.out.println("Enter Description:");
                        String desc = sc.nextLine();

                        System.out.println("Enter Price:");
                        double price = sc.nextDouble();

                        System.out.println("Enter Stock Quantity:");
                        int stock = sc.nextInt();

                        System.out.println("Enter Category Id:");
                        int categoryId = sc.nextInt();

                        Category category = new Category();

                        // setting category id
                        // because product table uses foreign key
                        try {
                            java.lang.reflect.Field field =
                                    Category.class.getDeclaredField("id");

                            field.setAccessible(true);
                            field.set(category, categoryId);

                        } catch (Exception e) {
                            e.printStackTrace();
                        }

                        Product product =
                                new Product(
                                        pname,
                                        desc,
                                        price,
                                        stock,
                                        category,
                                        user
                                );

                        productDao.addProduct(product);

                        System.out.println("Product Added Successfully");

                        break;

                    case 2:

                        System.out.println("\n------ PRODUCT LIST ------");

                        productDao
                                .getAllProducts()
                                .forEach(System.out::println);

                        break;

                    case 3:

                        try {

                            System.out.println("Enter Product Id:");
                            int id = sc.nextInt();

                            Product p =
                                    productDao.getById(id);

                            sc.nextLine();

                            System.out.println("Enter New Product Name:");
                            String newName = sc.nextLine();

                            System.out.println("Enter New Price:");
                            double newPrice = sc.nextDouble();

                            System.out.println("Enter New Stock:");
                            int newStock = sc.nextInt();

                            p.setProductName(newName);
                            p.setPrice(newPrice);

                            // stock setter if available
                            try {
                                java.lang.reflect.Method method =
                                        Product.class.getMethod(
                                                "setStockQuantity",
                                                int.class);

                                method.invoke(p, newStock);

                            } catch (Exception e) {
                                e.printStackTrace();
                            }

                            productDao.update(p);

                            System.out.println("Product Updated Successfully");

                        } catch (ResourceNotFoundException e) {

                            System.out.println(e.getMessage());
                        }

                        break;

                    case 4:

                        try {

                            System.out.println("Enter Product Id:");
                            int id = sc.nextInt();

                            productDao.delete(id);

                            System.out.println("Product Deleted Successfully");

                        } catch (ResourceNotFoundException e) {

                            System.out.println(e.getMessage());
                        }

                        break;

                    default:

                        System.out.println("Invalid Option");
                }
            }

        } catch (NoResultException e) {

            System.out.println("Invalid Username or Password");
        }

        context.close();
    }
}