package com.quitq.dto;

public record SellerRespDto(
        int sellerId,
        String name,
        String contactNumber,
        String address,
        String username
) {}