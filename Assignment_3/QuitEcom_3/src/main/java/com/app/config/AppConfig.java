package com.app.config;

import jakarta.persistence.EntityManagerFactory;
import org.springframework.context.annotation.*;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.jpa.*;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.Properties;

@Configuration
@ComponentScan(basePackages = "com.app")
@EnableTransactionManagement
public class AppConfig {

    @Bean
    public DataSource getDataSource() {

        DriverManagerDataSource ds =
                new DriverManagerDataSource();

        ds.setUrl("jdbc:mysql://localhost:3306/quitq_db");
        ds.setUsername("root");
        ds.setPassword("Kani@1215");

        ds.setDriverClassName("com.mysql.cj.jdbc.Driver");

        return ds;
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(
            DataSource dataSource) {

        LocalContainerEntityManagerFactoryBean emf =
                new LocalContainerEntityManagerFactoryBean();

        emf.setDataSource(dataSource);

        emf.setPackagesToScan("com.app.model");

        emf.setJpaVendorAdapter(
                new HibernateJpaVendorAdapter());

        Properties props = new Properties();

        props.setProperty("hibernate.hbm2ddl.auto", "update");

        props.setProperty("hibernate.dialect",
                "org.hibernate.dialect.MySQLDialect");

        emf.setJpaProperties(props);

        return emf;
    }

    @Bean
    public JpaTransactionManager transactionManager(
            LocalContainerEntityManagerFactoryBean emf) {

        JpaTransactionManager tx =
                new JpaTransactionManager();

        tx.setEntityManagerFactory(emf.getObject());

        return tx;
    }
}