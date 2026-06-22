package com.quitq.controller;

import com.quitq.dto.CustomerReqDto;
import com.quitq.dto.CustomerRespDto;
import com.quitq.dto.CustomerUpdateDto;
import com.quitq.service.CustomerService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/customer")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping("/all")
    public List<CustomerRespDto> getAll() {
        return customerService.getAll();
    }

    @GetMapping("/profile")
    public CustomerRespDto getProfile(Principal principal) {
        return customerService.getProfile(principal.getName());
    }

    @PostMapping("/add")
    public ResponseEntity<String> addCustomer(@Valid @RequestBody CustomerReqDto dto) {
        customerService.addCustomer(dto);
        return ResponseEntity.ok("Customer registered successfully");
    }

    @PutMapping("/update-profile")
    public ResponseEntity<String> updateProfile(Principal principal,
                                                @Valid @RequestBody CustomerUpdateDto dto) {
        customerService.updateProfile(principal.getName(), dto);
        return ResponseEntity.ok("Profile updated successfully");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteById(@PathVariable int id) {
        customerService.deleteById(id);
        return ResponseEntity.ok("Customer deleted successfully");
    }
}
