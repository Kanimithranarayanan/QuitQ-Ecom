package com.quitq.Ecom;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = "com.quitq.model")
@EnableJpaRepositories(basePackages = "com.quitq.repository")
// ADD THIS LINE: ComponentScan ensure inputs for @Service and @RestController classes
@ComponentScan(basePackages = "com.quitq")
public class PracticeSpringApplication {

	public static void main(String[] args) {
		SpringApplication.run(PracticeSpringApplication.class, args);
	}

}