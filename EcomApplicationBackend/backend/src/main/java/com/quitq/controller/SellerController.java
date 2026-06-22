package com.quitq.controller;

import com.quitq.dto.SellerReqDto;
import com.quitq.dto.SellerRespDto;
import com.quitq.dto.SellerUpdateDto;
import com.quitq.service.SellerService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@AllArgsConstructor
@RequestMapping("/api/seller")
@CrossOrigin(origins = "http://localhost:5173")
public class SellerController {

    private final SellerService sellerService;

    @PostMapping("/add")
    public ResponseEntity<String> addSeller(@Valid @RequestBody SellerReqDto dto) {
        sellerService.addSeller(dto);
        return ResponseEntity.ok("Seller registered successfully");
    }

    @GetMapping("/profile")
    public SellerRespDto getProfile(Principal principal) {
        return sellerService.getProfile(principal.getName());
    }

    @PutMapping("/update-profile")
    public ResponseEntity<String> updateProfile(Principal principal,
                                                @Valid @RequestBody SellerUpdateDto dto) {
        sellerService.updateProfile(principal.getName(), dto);
        return ResponseEntity.ok("Profile updated successfully");
    }
}