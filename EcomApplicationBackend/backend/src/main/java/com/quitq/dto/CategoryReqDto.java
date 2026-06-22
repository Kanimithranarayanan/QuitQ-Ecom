package com.quitq.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CategoryReqDto(
        @NotNull
        @NotBlank
        String categoryName,

        String description
) {
}
