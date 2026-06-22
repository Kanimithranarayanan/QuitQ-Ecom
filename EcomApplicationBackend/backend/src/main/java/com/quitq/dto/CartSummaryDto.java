package com.quitq.dto;

import java.util.List;

public record CartSummaryDto(
        List<CartRespDto> items,
        double grandTotal
) {
}
