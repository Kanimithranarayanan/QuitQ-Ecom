package com.quitq.controller;

import com.quitq.dto.AdminCreateDto;
import com.quitq.dto.SalesReportDto;
import com.quitq.dto.SellerRespDto;
import com.quitq.service.AdminService;
import com.quitq.service.ReportService;
import com.quitq.service.SellerService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final SellerService sellerService;
    private final ReportService reportService;

    /**
     * One-time admin creation endpoint.
     * IMPORTANT: After creating the first admin, remove the permitAll() rule
     * from SecurityConfig and secure or delete this endpoint.
     */
    @PostMapping("/create-admin")
    public ResponseEntity<String> createAdmin(@Valid @RequestBody AdminCreateDto dto) {
        adminService.createAdmin(dto);
        return ResponseEntity.ok("Admin account created successfully for username: " + dto.username());
    }

    @GetMapping("/sellers")
    public List<SellerRespDto> getAllSellers() {
        return sellerService.getAllSellers();
    }

    @DeleteMapping("/sellers/delete/{id}")
    public ResponseEntity<String> deleteSeller(@PathVariable int id) {
        sellerService.deleteById(id);
        return ResponseEntity.ok("Seller deleted successfully");
    }

    /**
     * Monthly revenue + top-selling products report, for the admin dashboard.
     */
    @GetMapping("/reports/sales")
    public SalesReportDto getSalesReport() {
        return reportService.getSalesReport();
    }
}