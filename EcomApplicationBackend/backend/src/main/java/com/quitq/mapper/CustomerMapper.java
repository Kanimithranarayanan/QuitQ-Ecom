package com.quitq.mapper;

import com.quitq.dto.CustomerRespDto;
import com.quitq.model.Customer;
import org.springframework.stereotype.Component;

@Component
public class CustomerMapper {

    public static CustomerRespDto entityToDto(Customer customer) {
        return new CustomerRespDto(
                customer.getId(),
                customer.getName(),
                customer.getGender(),
                customer.getContactNumber(),
                customer.getAddress(),
                customer.getUser().getUsername()
        );
    }
}
