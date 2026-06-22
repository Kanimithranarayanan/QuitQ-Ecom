package com.quitq.dto;

import java.util.List;

/**
 * Summary returned after a successful cart checkout —
 * all the orders created in that single checkout, grouped together.
 */
public record OrderGroupRespDto(
        String orderGroupId,
        List<OrderRespDto> orders,
        double itemsTotal,     // sum of all items' price * quantity
        double deliveryTotal,  // sum of all items' delivery charge
        double grandTotal,     // itemsTotal + deliveryTotal — amount payable
        int totalQuantity
) {
}
