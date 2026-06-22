package com.quitq.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CustomerReqDto(
        @NotNull
        @NotBlank
        String name,

        String gender,

        String contactNumber,

        String address,

        @NotNull
        @NotBlank
        @Size(min = 4)
        String username,

        @NotNull
        @NotBlank
        String password
) {
}
