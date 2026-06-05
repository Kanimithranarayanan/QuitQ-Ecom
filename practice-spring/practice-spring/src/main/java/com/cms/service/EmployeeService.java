package com.cms.service;

import com.cms.entity.Employee;
import com.cms.repository.EmployeeRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor

public class EmployeeService {
    private final EmployeeRepository  employerRepository;



    public void save(Employee employer) {
        employerRepository.save(employer);
    }

    public Employee getByUsername(String username) {
        return employerRepository.findByUserUsername(username);
    }
}