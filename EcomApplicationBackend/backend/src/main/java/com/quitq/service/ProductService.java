package com.quitq.service;

import com.quitq.dto.ProductPageRespDto;
import com.quitq.dto.ProductReqDto;
import com.quitq.dto.ProductRespDto;
import com.quitq.exception.ResourceNotFoundException;
import com.quitq.mapper.ProductMapper;
import com.quitq.model.Category;
import com.quitq.model.Product;
import com.quitq.model.ProductImage;
import com.quitq.model.Seller;
import com.quitq.repository.CartRepository;
import com.quitq.repository.OrderRepository;
import com.quitq.repository.ProductImageRepository;
import com.quitq.repository.ProductRepository;
import com.quitq.repository.ReviewRepository;
import com.quitq.utility.FileUtility;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final CategoryService categoryService;
    private final SellerService sellerService;
    private final ProductMapper productMapper;
    private final ReviewRepository reviewRepository;
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;

    private static final String UPLOAD_LOC = "uploads/products";

    public List<Product> getAll() {
        return productRepository.findAll();
    }

    public List<ProductRespDto> getAllAsDto() {
        return productRepository.findAll()
                .stream()
                .map(productMapper::mapEntityToDto)
                .toList();
    }

    public ProductPageRespDto getAllWithPagination(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> pages = productRepository.findAll(pageable);
        return productMapper.mapPageToDto(pages);
    }

    public Product getById(int id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid product id"));
    }

    public ProductRespDto getProductDetailsById(int id) {
        Product product = getById(id);
        return productMapper.mapEntityToDto(product);
    }

    public ProductRespDto addProduct(ProductReqDto dto, String sellerUsername) {
        Category category = categoryService.getById(dto.categoryId());
        Seller seller = sellerService.getByUsername(sellerUsername);
        Product product = productMapper.mapDtoToEntity(dto, category, seller);
        Product savedProduct = productRepository.save(product);
        return productMapper.mapEntityToDto(savedProduct);
    }

    public void update(int id, ProductReqDto dto, String sellerUsername) {
        Product existingProduct = getById(id);
        Category category = categoryService.getById(dto.categoryId());
        existingProduct.setProductName(dto.productName());
        existingProduct.setDescription(dto.description());
        existingProduct.setPrice(dto.price());
        existingProduct.setStockQuantity(dto.stockQuantity());
        existingProduct.setImageUrl(dto.imageUrl());
        existingProduct.setCategory(category);
        productRepository.save(existingProduct);
    }

    @Transactional
    public void deleteById(int id) {
        getById(id); // throws if not found

        // Delete reviews for this product
        reviewRepository.findByProductId(id)
                .forEach(review -> reviewRepository.deleteById(review.getId()));

        // Delete cart entries for this product
        cartRepository.findAll().stream()
                .filter(cart -> cart.getProduct().getId() == id)
                .forEach(cart -> cartRepository.deleteById(cart.getId()));

        // Delete orders for this product
        orderRepository.findAll().stream()
                .filter(order -> order.getProduct().getId() == id)
                .forEach(order -> orderRepository.deleteById(order.getId()));

        // Delete product images
        productImageRepository.findByProductId(id)
                .forEach(img -> productImageRepository.deleteById(img.getId()));

        // Delete the product
        productRepository.deleteById(id);
    }

    public List<ProductRespDto> getByCategoryId(int categoryId) {
        categoryService.getById(categoryId);
        List<Product> list = productRepository.findByCategoryId(categoryId);
        return list.stream()
                .map(productMapper::mapEntityToDto)
                .toList();
    }

    public List<ProductRespDto> getBySellerUsername(String username) {
        List<Product> list = productRepository.findBySellerUserUsername(username);
        return list.stream()
                .map(productMapper::mapEntityToDto)
                .toList();
    }

    public List<ProductRespDto> searchByName(String keyword) {
        List<Product> list = productRepository.searchByProductName(keyword);
        return list.stream()
                .map(productMapper::mapEntityToDto)
                .toList();
    }

    public List<ProductRespDto> getByPriceRange(double minPrice, double maxPrice) {
        List<Product> list = productRepository.findByPriceRange(minPrice, maxPrice);
        return list.stream()
                .map(productMapper::mapEntityToDto)
                .toList();
    }

    public void uploadImages(int productId, List<MultipartFile> files) throws IOException {
        Product product = getById(productId);

        Path uploadPath = Paths.get(UPLOAD_LOC);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        for (MultipartFile file : files) {
            FileUtility.validateFile(file);

            String originalFilename = file.getOriginalFilename();
            String ext = originalFilename.substring(originalFilename.lastIndexOf("."));
            String fileName = UUID.randomUUID() + ext;
            Path destinationPath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), destinationPath, StandardCopyOption.REPLACE_EXISTING);

            ProductImage image = new ProductImage();
            image.setImagePath(fileName);
            image.setProduct(product);
            productImageRepository.save(image);
        }
    }
}
