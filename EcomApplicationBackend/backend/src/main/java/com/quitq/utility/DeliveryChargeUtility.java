package com.quitq.utility;

/**
 * Centralizes the delivery charge calculation so it's defined in exactly
 * one place. Currently a flat 2% of the item total (price * quantity).
 * Change DELIVERY_CHARGE_PERCENT here to adjust it everywhere at once.
 */
public final class DeliveryChargeUtility {

    public static final double DELIVERY_CHARGE_PERCENT = 2.0; // percent

    private DeliveryChargeUtility() {
    }

    public static double calculate(double itemTotal) {
        double charge = itemTotal * (DELIVERY_CHARGE_PERCENT / 100.0);
        // round to 2 decimal places (currency)
        return Math.round(charge * 100.0) / 100.0;
    }
}
