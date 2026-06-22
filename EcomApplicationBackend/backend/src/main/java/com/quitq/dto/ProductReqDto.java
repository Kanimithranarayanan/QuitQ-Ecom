package com.quitq.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProductReqDto(
        @NotNull
        @NotBlank
        String productName,

        String description,

        @NotNull
        @Min(value = 0, message = "Price cannot be negative")
        double price,

        @NotNull
        @Min(value = 0, message = "Stock cannot be negative")
        int stockQuantity,

        String imageUrl,

        @NotNull
        int categoryId
) {
}
