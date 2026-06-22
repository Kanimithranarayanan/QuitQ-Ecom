package com.quitq.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Maps http://localhost:8088/uploads/products/<file> to the
        // physical folder <project-root>/uploads/products/<file>
        registry.addResourceHandler("/uploads/products/**")
                .addResourceLocations("file:uploads/products/");
    }
}
