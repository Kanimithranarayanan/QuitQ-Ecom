package com.quitq.service;

import com.quitq.dto.ReviewReqDto;
import com.quitq.dto.ReviewRespDto;
import com.quitq.exception.ResourceNotFoundException;
import com.quitq.mapper.ReviewMapper;
import com.quitq.model.Customer;
import com.quitq.model.Product;
import com.quitq.model.Review;
import com.quitq.repository.ReviewRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductService productService;
    private final CustomerService customerService;
    private final ReviewMapper reviewMapper;

    public void addReview(ReviewReqDto dto, String customerUsername) {
        Product product = productService.getById(dto.productId());
        Customer customer = customerService.getByUsername(customerUsername);

        Review review = new Review();
        review.setRating(dto.rating());
        review.setComment(dto.comment());
        review.setProduct(product);
        review.setCustomer(customer);

        reviewRepository.save(review);
    }

    public List<ReviewRespDto> getReviewsByProduct(int productId) {
        List<Review> list = reviewRepository.findByProductId(productId);
        return list.stream()
                .map(reviewMapper::mapEntityToDto)
                .toList();
    }

    public List<ReviewRespDto> getMyReviews(String customerUsername) {
        List<Review> list = reviewRepository.findByCustomerUserUsername(customerUsername);
        return list.stream()
                .map(reviewMapper::mapEntityToDto)
                .toList();
    }

    public void deleteReview(int reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        reviewRepository.delete(review);
    }
}
