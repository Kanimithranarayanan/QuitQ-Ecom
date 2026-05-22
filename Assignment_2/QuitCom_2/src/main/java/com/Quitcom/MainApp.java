package com.quitq;

import com.quitq.config.AppConfig;
import com.quitq.dao.CategoryDao;
import com.quitq.model.Category;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import java.util.List;
import java.util.Scanner;

public class MainApp {

    public static void main(String[] args) {

        ApplicationContext context =
                new AnnotationConfigApplicationContext(AppConfig.class);

        CategoryDao dao =
                context.getBean(CategoryDao.class);

        Scanner sc = new Scanner(System.in);

        int choice;

        do {

            System.out.println("\n1.Add Category");
            System.out.println("2.Delete Category");
            System.out.println("3.Update Category");
            System.out.println("4.Get All Categories");
            System.out.println("5.Get Category By Id");
            System.out.println("0.Exit");

            choice = sc.nextInt();

            switch (choice) {

                case 1:

                    System.out.println("Enter Category Name:");

                    sc.nextLine();

                    String categoryName = sc.nextLine();

                    Category category = new Category();

                    category.setCategoryName(categoryName);

                    dao.insert(category);

                    System.out.println("Category Added Successfully");

                    break;

                case 2:

                    System.out.println("Enter Category Id to Delete:");

                    int deleteId = sc.nextInt();

                    dao.delete(deleteId);

                    System.out.println("Category Deleted Successfully");

                    break;

                case 3:

                    System.out.println("Enter Category Id to Update:");

                    int updateId = sc.nextInt();

                    sc.nextLine();

                    System.out.println("Enter New Category Name:");

                    String newName = sc.nextLine();

                    Category updateCategory =
                            new Category(updateId, newName);

                    dao.update(updateCategory);

                    System.out.println("Category Updated Successfully");

                    break;

                case 4:

                    List<Category> list = dao.getAll();

                    list.forEach(System.out::println);

                    break;

                case 5:

                    System.out.println("Enter Category Id:");

                    int getId = sc.nextInt();

                    Category c = dao.getById(getId);

                    System.out.println(c);

                    break;

                case 0:

                    System.out.println("Thank You");

                    break;

                default:

                    System.out.println("Invalid Choice");
            }

        } while (choice != 0);

    }
}