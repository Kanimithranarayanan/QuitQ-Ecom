package com.quitq.dto;

import jakarta.validation.constraints.NotBlank;

public record CustomerUpdateDto(
        @NotBlank(message = "Name is required")
        String name,

        String gender,

        String contactNumber,

        String address
) {}