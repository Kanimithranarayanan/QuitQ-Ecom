package com.cms.dto;
import com.cms.enums.Role;

public record UserRegisterDto (

            String username,
            String password,
            Role role,
            String name,
            String email,
            String resumeSummary,
            String companyName
    ) {}

