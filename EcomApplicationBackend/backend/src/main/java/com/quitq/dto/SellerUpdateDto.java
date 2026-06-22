package com.quitq.dto;

import jakarta.validation.constraints.NotBlank;

public record SellerUpdateDto(
        @NotBlank(message = "Name is required")
        String name,

        String contactNumber,

        String address
) {}