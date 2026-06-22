package com.quitq.controller;

import com.quitq.dto.ReviewReqDto;
import com.quitq.dto.ReviewRespDto;
import com.quitq.service.ReviewService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/review")
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    private final ReviewService reviewService;

    // Customer adds a review for a product
    @PostMapping("/add")
    public ResponseEntity<String> addReview(@Valid @RequestBody ReviewReqDto dto, Principal principal) {
        reviewService.addReview(dto, principal.getName());
        return ResponseEntity.ok("Review added successfully");
    }

    // Get all reviews for a product — public
    @GetMapping("/by-product/{productId}")
    public List<ReviewRespDto> getReviewsByProduct(@PathVariable int productId) {
        return reviewService.getReviewsByProduct(productId);
    }

    // Customer views their own reviews
    @GetMapping("/my-reviews")
    public List<ReviewRespDto> getMyReviews(Principal principal) {
        return reviewService.getMyReviews(principal.getName());
    }

    // Customer deletes their own review
    @DeleteMapping("/delete/{reviewId}")
    public ResponseEntity<String> deleteReview(@PathVariable int reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok("Review deleted successfully");
    }
}
