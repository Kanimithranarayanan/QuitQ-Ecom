package com.quitq.dto;

import com.quitq.enums.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Request body for checking out the customer's entire cart in one go.
 * Creates one Order per cart item, all sharing the same orderGroupId.
 */
public record CheckoutReqDto(
        @NotNull
        @NotBlank
        String shippingAddress,

        // Only Cash on Delivery is supported right now, but the field is
        // kept so more payment methods can be added later without breaking
        // the API contract.
        PaymentMethod paymentMethod
) {
}
