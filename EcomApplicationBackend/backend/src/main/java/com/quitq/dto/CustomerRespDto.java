package com.quitq.dto;

public record CustomerRespDto(
        int customerId,
        String name,
        String gender,
        String contactNumber,
        String address,
        String username
) {
}
