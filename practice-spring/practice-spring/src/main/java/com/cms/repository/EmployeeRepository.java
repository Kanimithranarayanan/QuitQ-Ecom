package com.cms.repository;

import com.cms.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public  interface EmployeeRepository extends JpaRepository <Employee,Integer>{
    Employee findByUserUsername(String username);

}