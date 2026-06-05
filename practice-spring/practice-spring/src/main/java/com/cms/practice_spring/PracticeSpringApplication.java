package com.cms.practice_spring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.cms")
@EnableJpaRepositories(basePackages = "com.cms.repository")
@EntityScan(basePackages = "com.cms.entity")

@ComponentScan(basePackages = "com.cms")
public class PracticeSpringApplication {

	public static void main(String[] args) {
		SpringApplication.run(PracticeSpringApplication.class, args);
	}

}