package com.quitq.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record OrderReqDto(
        @NotNull
        int productId,

        @NotNull
        @Min(value = 1, message = "Quantity must be at least 1")
        int quantity,

        @NotNull
        @NotBlank
        String shippingAddress
) {
}
