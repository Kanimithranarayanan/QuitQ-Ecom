package com.quitq.config;

import com.quitq.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorize -> authorize

                        // Public Auth
                        .requestMatchers(HttpMethod.GET,  "/api/auth/login").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/auth/reset-password").permitAll()

                        // Public Registration
                        .requestMatchers(HttpMethod.POST, "/api/customer/add").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/seller/add").permitAll()

                        // Admin Creation (one-time)
                        .requestMatchers(HttpMethod.POST, "/api/admin/create-admin").permitAll()

                        // Public Product browsing
                        .requestMatchers(HttpMethod.GET, "/api/product/all").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/product/all/v2").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/product/get-one/{id}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/product/by-category/{categoryId}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/product/search").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/product/by-price-range").permitAll()

                        // Public Category browsing
                        .requestMatchers(HttpMethod.GET, "/api/category/all").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/category/get-one/{id}").permitAll()

                        // Public Review reading — anyone can see reviews
                        .requestMatchers(HttpMethod.GET, "/api/review/by-product/{productId}").permitAll()

                        // Image Upload — Seller only
                        .requestMatchers(HttpMethod.POST, "/api/image/upload").hasAuthority("SELLER")
                        .requestMatchers(HttpMethod.POST, "/api/product/images/upload/{productId}").hasAuthority("SELLER")

                        // Static uploaded images — public access
                        .requestMatchers("/uploads/**").permitAll()

                        // Seller
                        .requestMatchers(HttpMethod.GET,    "/api/seller/profile").hasAuthority("SELLER")
                        .requestMatchers(HttpMethod.PUT,    "/api/seller/update-profile").hasAuthority("SELLER")
                        .requestMatchers(HttpMethod.POST,   "/api/product/add").hasAuthority("SELLER")
                        .requestMatchers(HttpMethod.PUT,    "/api/product/update/{id}").hasAuthority("SELLER")
                        .requestMatchers(HttpMethod.DELETE, "/api/product/delete/{id}").hasAnyAuthority("SELLER", "ADMIN")
                        .requestMatchers(HttpMethod.GET,    "/api/product/by-seller").hasAuthority("SELLER")
                        .requestMatchers(HttpMethod.GET,    "/api/order/seller-orders").hasAuthority("SELLER")

                        // Customer
                        .requestMatchers(HttpMethod.GET,    "/api/customer/profile").hasAuthority("CUSTOMER")
                        .requestMatchers(HttpMethod.PUT,    "/api/customer/update-profile").hasAuthority("CUSTOMER")
                        .requestMatchers(HttpMethod.GET,    "/api/cart/my-cart").hasAuthority("CUSTOMER")
                        .requestMatchers(HttpMethod.POST,   "/api/cart/add").hasAuthority("CUSTOMER")
                        .requestMatchers(HttpMethod.PUT,    "/api/cart/update/{cartId}").hasAuthority("CUSTOMER")
                        .requestMatchers(HttpMethod.DELETE, "/api/cart/remove/{cartId}").hasAuthority("CUSTOMER")
                        .requestMatchers(HttpMethod.DELETE, "/api/cart/clear").hasAuthority("CUSTOMER")
                        .requestMatchers(HttpMethod.POST,   "/api/order/place").hasAuthority("CUSTOMER")
                        .requestMatchers(HttpMethod.POST,   "/api/order/checkout-cart").hasAuthority("CUSTOMER")
                        .requestMatchers(HttpMethod.GET,    "/api/order/my-orders").hasAuthority("CUSTOMER")
                        .requestMatchers(HttpMethod.PUT,    "/api/order/cancel/{orderId}").hasAuthority("CUSTOMER")

                        // Review — Customer only (add, view mine, delete)
                        .requestMatchers(HttpMethod.POST,   "/api/review/add").hasAuthority("CUSTOMER")
                        .requestMatchers(HttpMethod.GET,    "/api/review/my-reviews").hasAuthority("CUSTOMER")
                        .requestMatchers(HttpMethod.DELETE, "/api/review/delete/{reviewId}").hasAuthority("CUSTOMER")

                        // Admin
                        .requestMatchers(HttpMethod.GET,    "/api/order/all").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.GET,    "/api/admin/reports/sales").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.PUT,    "/api/order/update-status/{orderId}").hasAnyAuthority("ADMIN", "SELLER")
                        .requestMatchers(HttpMethod.GET,    "/api/customer/all").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/customer/delete/{id}").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.GET,    "/api/admin/sellers").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/admin/sellers/delete/{id}").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.POST,   "/api/category/add").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.PUT,    "/api/category/update/{id}").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/category/delete/{id}").hasAuthority("ADMIN")

                        .anyRequest().authenticated()
                );
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        http.httpBasic(Customizer.withDefaults());
        return http.build();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider(
            UserService userService,
            PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider dao = new DaoAuthenticationProvider(userService);
        dao.setPasswordEncoder(passwordEncoder);
        return dao;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
        org.springframework.web.cors.CorsConfiguration configuration =
                new org.springframework.web.cors.CorsConfiguration();
        configuration.addAllowedOrigin("http://localhost:5173");
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);
        org.springframework.web.cors.UrlBasedCorsConfigurationSource source =
                new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
