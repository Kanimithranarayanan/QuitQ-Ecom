package com.quitq.mapper;

import com.quitq.dto.ReviewRespDto;
import com.quitq.model.Review;
import org.springframework.stereotype.Component;

@Component
public class ReviewMapper {

    public ReviewRespDto mapEntityToDto(Review review) {
        return new ReviewRespDto(
                review.getId(),
                review.getRating(),
                review.getComment(),
                review.getCustomer().getName(),
                review.getProduct().getProductName(),
                review.getCreatedAt()
        );
    }
}
