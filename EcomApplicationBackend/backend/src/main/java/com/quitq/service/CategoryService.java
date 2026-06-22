package com.quitq.service;

import com.quitq.dto.CategoryReqDto;
import com.quitq.exception.ResourceNotFoundException;
import com.quitq.model.Category;
import com.quitq.repository.CartRepository;
import com.quitq.repository.CategoryRepository;
import com.quitq.repository.OrderRepository;
import com.quitq.repository.ProductImageRepository;
import com.quitq.repository.ProductRepository;
import com.quitq.repository.ReviewRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final ReviewRepository reviewRepository;
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;

    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    public Category getById(int id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid category id"));
    }

    public void addCategory(CategoryReqDto dto) {
        Category category = new Category();
        category.setCategoryName(dto.categoryName());
        category.setDescription(dto.description());
        categoryRepository.save(category);
    }

    public void update(int id, CategoryReqDto dto) {
        Category existingCategory = getById(id);
        existingCategory.setCategoryName(dto.categoryName());
        existingCategory.setDescription(dto.description());
        categoryRepository.save(existingCategory);
    }

    @Transactional
    public void deleteById(int id) {
        getById(id); // throws if not found

        // Delete all products in this category (with their dependencies)
        productRepository.findByCategoryId(id).forEach(product -> {
            int productId = product.getId();

            // Delete reviews
            reviewRepository.findByProductId(productId)
                    .forEach(r -> reviewRepository.deleteById(r.getId()));

            // Delete cart entries
            cartRepository.findAll().stream()
                    .filter(c -> c.getProduct().getId() == productId)
                    .forEach(c -> cartRepository.deleteById(c.getId()));

            // Delete orders
            orderRepository.findAll().stream()
                    .filter(o -> o.getProduct().getId() == productId)
                    .forEach(o -> orderRepository.deleteById(o.getId()));

            // Delete product images
            productImageRepository.findByProductId(productId)
                    .forEach(img -> productImageRepository.deleteById(img.getId()));

            productRepository.deleteById(productId);
        });

        categoryRepository.deleteById(id);
    }
}
