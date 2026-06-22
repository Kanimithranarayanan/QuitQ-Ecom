package com.quitq.service;

import com.quitq.dto.SellerReqDto;
import com.quitq.dto.SellerRespDto;
import com.quitq.dto.SellerUpdateDto;
import com.quitq.enums.Role;
import com.quitq.exception.ResourceNotFoundException;
import com.quitq.model.Product;
import com.quitq.model.Seller;
import com.quitq.model.User;
import com.quitq.repository.CartRepository;
import com.quitq.repository.OrderRepository;
import com.quitq.repository.ProductImageRepository;
import com.quitq.repository.ProductRepository;
import com.quitq.repository.ReviewRepository;
import com.quitq.repository.SellerRepository;
import com.quitq.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class SellerService {

    private final SellerRepository sellerRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ReviewRepository reviewRepository;

    public Seller getById(int id) {
        return sellerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid seller id"));
    }

    public Seller getByUsername(String username) {
        Seller seller = sellerRepository.findByUserUsername(username);
        if (seller == null) throw new ResourceNotFoundException("Seller not found for username: " + username);
        return seller;
    }

    public List<SellerRespDto> getAllSellers() {
        return sellerRepository.findAll()
                .stream()
                .map(s -> new SellerRespDto(
                        s.getId(),
                        s.getName(),
                        s.getContactNumber(),
                        s.getAddress(),
                        s.getUser().getUsername()))
                .toList();
    }

    public SellerRespDto getProfile(String username) {
        Seller s = getByUsername(username);
        return new SellerRespDto(
                s.getId(),
                s.getName(),
                s.getContactNumber(),
                s.getAddress(),
                s.getUser().getUsername());
    }

    public void addSeller(SellerReqDto dto) {
        String encodedPassword = passwordEncoder.encode(dto.password());

        User user = new User();
        user.setUsername(dto.username());
        user.setPassword(encodedPassword);
        user.setRole(Role.SELLER);
        user = userService.save(user);

        Seller seller = new Seller();
        seller.setName(dto.name());
        seller.setContactNumber(dto.contactNumber());
        seller.setAddress(dto.address());
        seller.setUser(user);

        sellerRepository.save(seller);
    }

    public void updateProfile(String username, SellerUpdateDto dto) {
        Seller seller = getByUsername(username);
        seller.setName(dto.name());
        seller.setContactNumber(dto.contactNumber());
        seller.setAddress(dto.address());
        sellerRepository.save(seller);
    }

    @Transactional
    public void deleteById(int id) {
        Seller seller = getById(id);

        // Get all products for this seller
        List<Product> products = productRepository.findBySellerUserUsername(
                seller.getUser().getUsername());

        for (Product product : products) {
            // Delete reviews for this product
            reviewRepository.findByProductId(product.getId())
                    .forEach(review -> reviewRepository.deleteById(review.getId()));

            // Delete cart entries for this product
            cartRepository.findAll().stream()
                    .filter(cart -> cart.getProduct().getId() == product.getId())
                    .forEach(cart -> cartRepository.deleteById(cart.getId()));

            // Delete orders for this product
            orderRepository.findAll().stream()
                    .filter(order -> order.getProduct().getId() == product.getId())
                    .forEach(order -> orderRepository.deleteById(order.getId()));

            // Delete product images
            productImageRepository.findByProductId(product.getId())
                    .forEach(img -> productImageRepository.deleteById(img.getId()));

            // Delete the product itself
            productRepository.deleteById(product.getId());
        }

        // Delete the seller record
        User user = seller.getUser();
        sellerRepository.deleteById(id);

        // Delete the user account
        userRepository.deleteById(user.getId());
    }
}
