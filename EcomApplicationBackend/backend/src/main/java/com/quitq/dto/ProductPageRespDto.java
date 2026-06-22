package com.quitq.dto;

import java.util.List;

public record ProductPageRespDto(
        long totalElements,
        int totalPages,
        List<ProductRespDto> data
) {
}
