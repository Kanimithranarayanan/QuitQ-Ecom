package com.quitq.dto;

import java.time.Instant;

public record ReviewRespDto(
        int reviewId,
        int rating,
        String comment,
        String customerName,
        String productName,
        Instant createdAt
) {
}
