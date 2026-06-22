package com.quitq.mapper;

import com.quitq.dto.ProductPageRespDto;
import com.quitq.dto.ProductReqDto;
import com.quitq.dto.ProductRespDto;
import com.quitq.model.Category;
import com.quitq.model.Product;
import com.quitq.model.ProductImage;
import com.quitq.model.Seller;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProductMapper {

    // Base URL where uploaded product images are served from
    private static final String IMAGE_BASE_URL = "http://localhost:8088/uploads/products/";

    public Product mapDtoToEntity(ProductReqDto dto, Category category, Seller seller) {
        Product product = new Product();
        product.setProductName(dto.productName());
        product.setDescription(dto.description());
        product.setPrice(dto.price());
        product.setStockQuantity(dto.stockQuantity());
        product.setImageUrl(dto.imageUrl());
        product.setCategory(category);
        product.setSeller(seller);
        return product;
    }

    public ProductRespDto mapEntityToDto(Product product) {
        // Convert each ProductImage filename into a full accessible URL
        List<String> imagePaths = product.getImages()
                .stream()
                .map(image -> IMAGE_BASE_URL + image.getImagePath())
                .toList();

        return new ProductRespDto(
                product.getId(),
                product.getProductName(),
                product.getDescription(),
                product.getPrice(),
                product.getStockQuantity(),
                product.getImageUrl(),
                imagePaths,
                product.getCategory().getCategoryName(),
                product.getSeller().getName()
        );
    }

    public ProductPageRespDto mapPageToDto(Page<Product> pages) {
        long totalElements = pages.getTotalElements();
        int totalPages = pages.getTotalPages();
        List<ProductRespDto> data = pages.getContent()
                .stream()
                .map(this::mapEntityToDto)
                .toList();
        return new ProductPageRespDto(totalElements, totalPages, data);
    }
}
