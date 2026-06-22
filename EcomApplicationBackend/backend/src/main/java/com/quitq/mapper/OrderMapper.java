package com.quitq.mapper;

import com.quitq.dto.OrderRespDto;
import com.quitq.model.Order;
import org.springframework.stereotype.Component;

@Component
public class OrderMapper {

    public OrderRespDto entityToDto(Order order) {
        return new OrderRespDto(
                order.getId(),
                order.getProduct().getProductName(),
                order.getCustomer().getName(),
                order.getQuantity(),
                order.getTotalAmount(),
                order.getDeliveryCharge(),
                order.getTotalAmount() + order.getDeliveryCharge(),
                order.getShippingAddress(),
                order.getOrderStatus(),
                order.getPaymentMethod(),
                order.getOrderGroupId(),
                order.getCreatedAt()
        );
    }
}
