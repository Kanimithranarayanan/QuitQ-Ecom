package com.quitq.controller;

import com.quitq.dto.ProductPageRespDto;
import com.quitq.dto.ProductReqDto;
import com.quitq.dto.ProductRespDto;
import com.quitq.service.ProductService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/product")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private final ProductService productService;

    // Returns List<ProductRespDto> so frontend always gets consistent productId field
    @GetMapping("/all")
    public List<ProductRespDto> getAll() {
        return productService.getAllAsDto();
    }

    @GetMapping("/all/v2")
    public ProductPageRespDto getAllWithPagination(@RequestParam int page,
                                                   @RequestParam int size) {
        return productService.getAllWithPagination(page, size);
    }

    @GetMapping("/get-one/{id}")
    public ProductRespDto getById(@PathVariable int id) {
        return productService.getProductDetailsById(id);
    }

    @PostMapping("/add")
    public ResponseEntity<ProductRespDto> addProduct(@Valid @RequestBody ProductReqDto dto, Principal principal) {
        ProductRespDto savedProduct = productService.addProduct(dto, principal.getName());
        return ResponseEntity.ok(savedProduct);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> update(@PathVariable int id,
                       @Valid @RequestBody ProductReqDto dto,
                       Principal principal) {
        productService.update(id, dto, principal.getName());
        return ResponseEntity.ok("Product updated successfully");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteById(@PathVariable int id) {
        productService.deleteById(id);
        return ResponseEntity.ok("Product deleted successfully");
    }

    @GetMapping("/by-category/{categoryId}")
    public List<ProductRespDto> getByCategoryId(@PathVariable int categoryId) {
        return productService.getByCategoryId(categoryId);
    }

    @GetMapping("/by-seller")
    public List<ProductRespDto> getBySellerUsername(@RequestParam String sellerUsername) {
        return productService.getBySellerUsername(sellerUsername);
    }

    @GetMapping("/search")
    public List<ProductRespDto> searchByName(@RequestParam String keyword) {
        return productService.searchByName(keyword);
    }

    @GetMapping("/by-price-range")
    public List<ProductRespDto> getByPriceRange(@RequestParam double minPrice,
                                                @RequestParam double maxPrice) {
        return productService.getByPriceRange(minPrice, maxPrice);
    }

    // Upload one or more images for a given product (seller only)
    @PostMapping("/images/upload/{productId}")
    public void uploadImages(@PathVariable int productId,
                             @RequestParam("files") List<MultipartFile> files) throws IOException {
        // files = the actual images the seller is uploading for this product
        productService.uploadImages(productId, files);
    }
}
