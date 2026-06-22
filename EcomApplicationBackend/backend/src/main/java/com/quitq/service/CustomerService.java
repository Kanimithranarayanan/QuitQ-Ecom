package com.quitq.service;

import com.quitq.dto.CustomerReqDto;
import com.quitq.dto.CustomerRespDto;
import com.quitq.dto.CustomerUpdateDto;
import com.quitq.enums.Role;
import com.quitq.exception.ResourceNotFoundException;
import com.quitq.mapper.CustomerMapper;
import com.quitq.model.Customer;
import com.quitq.model.User;
import com.quitq.repository.CustomerRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;

    public Customer getById(int id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid customer id"));
    }

    public Customer getByUsername(String username) {
        Customer customer = customerRepository.findByUserUsername(username);
        if (customer == null) throw new ResourceNotFoundException("Customer not found for username: " + username);
        return customer;
    }

    public List<CustomerRespDto> getAll() {
        List<Customer> list = customerRepository.findAll();
        return list.stream()
                .map(CustomerMapper::entityToDto)
                .toList();
    }

    public CustomerRespDto getProfile(String username) {
        Customer customer = getByUsername(username);
        return CustomerMapper.entityToDto(customer);
    }

    public void addCustomer(CustomerReqDto dto) {
        String encodedPassword = passwordEncoder.encode(dto.password());

        User user = new User();
        user.setUsername(dto.username());
        user.setPassword(encodedPassword);
        user.setRole(Role.CUSTOMER);
        user = userService.save(user);

        Customer customer = new Customer();
        customer.setName(dto.name());
        customer.setGender(dto.gender());
        customer.setContactNumber(dto.contactNumber());
        customer.setAddress(dto.address());
        customer.setUser(user);

        customerRepository.save(customer);
    }

    public void updateProfile(String username, CustomerUpdateDto dto) {
        Customer customer = getByUsername(username);
        customer.setName(dto.name());
        customer.setGender(dto.gender());
        customer.setContactNumber(dto.contactNumber());
        customer.setAddress(dto.address());
        customerRepository.save(customer);
    }

    public void deleteById(int id) {
        getById(id);
        customerRepository.deleteById(id);
    }
}