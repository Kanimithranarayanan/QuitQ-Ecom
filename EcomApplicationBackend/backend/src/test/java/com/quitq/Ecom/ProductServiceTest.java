package com.quitq.Ecom;
import com.quitq.dto.ProductReqDto;
import com.quitq.dto.ProductRespDto;
import com.quitq.exception.ResourceNotFoundException;
import com.quitq.mapper.ProductMapper;
import com.quitq.model.Category;
import com.quitq.model.Product;
import com.quitq.model.Seller;
import com.quitq.repository.CartRepository;
import com.quitq.repository.OrderRepository;
import com.quitq.repository.ProductImageRepository;
import com.quitq.repository.ProductRepository;
import com.quitq.repository.ReviewRepository;
import com.quitq.service.CategoryService;
import com.quitq.service.ProductService;
import com.quitq.service.SellerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductImageRepository productImageRepository;

    @Mock
    private CategoryService categoryService;

    @Mock
    private SellerService sellerService;

    @Mock
    private ProductMapper productMapper;

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private CartRepository cartRepository;

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private ProductService productService;

    private Product product;
    private Product product1;
    private Category category;
    private Seller seller;
    private ProductRespDto productRespDto;

    // common sample data for all test cases in productService
    // sequence:- sample data loads - test case runs - sample data deloads
    @BeforeEach
    void setUp() {
        category = new Category();
        category.setId(1);
        category.setCategoryName("mobiles");

        seller = new Seller();
        seller.setId(1);
        seller.setName("rahul electronics");

        product = new Product();
        product.setId(1);
        product.setProductName("iphone 14");
        product.setPrice(60000);
        product.setStockQuantity(10);
        product.setCategory(category);
        product.setSeller(seller);

        product1 = new Product();
        product1.setId(2);
        product1.setProductName("oneplus 12");
        product1.setPrice(45000);
        product1.setStockQuantity(5);
        product1.setCategory(category);
        product1.setSeller(seller);

        // sample dto used for mapper return, not the actual entity
        productRespDto = new ProductRespDto(1, "iphone 14", "good phone", 60000,
                10, null, List.of(), "mobiles", "rahul electronics");
    }

    @Test
    public void getAllProducts_MustReturnSomething() {
        when(productRepository.findAll()).thenReturn(List.of(product, product1));

        List<Product> actualCall = productService.getAll();

        assertThat(actualCall).hasSize(2);
        assertThat(actualCall.getFirst().getProductName()).isEqualToIgnoringCase("iphone 14");
        assertThat(actualCall.get(1).getProductName()).isEqualToIgnoringCase("oneplus 12");
    }

    @Test
    public void getAllProducts_ReturnsEmptyList() {
        when(productRepository.findAll()).thenReturn(List.of());

        // actual call
        List<Product> actualCall = productService.getAll();

        assertThat(actualCall).hasSize(0);
        assertThat(actualCall).isEmpty();
    }

    @Test
    void getById_productExists() {
        when(productRepository.findById(100)).thenReturn(Optional.of(product));
        when(productRepository.findById(200)).thenReturn(Optional.of(product1));

        assertThat(productService.getById(100).getId()).isEqualTo(1);
        assertThat(productService.getById(200).getId()).isEqualTo(2);
        assertThat(productService.getById(100).getProductName()).isEqualTo("iphone 14");
        assertThat(productService.getById(200).getProductName()).isEqualTo("oneplus 12");
    }

    @Test
    void getById_productDoesNotExist() {
        when(productRepository.findById(100)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.getById(100))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Invalid product id");

        verify(productRepository, times(1)).findById(100);
    }

    @Test
    void addProduct_mustSaveAndReturnDto() {
        ProductReqDto dto = new ProductReqDto("iphone 14", "good phone", 60000, 10, null, 1);

        when(categoryService.getById(1)).thenReturn(category);
        when(sellerService.getByUsername("rahul123")).thenReturn(seller);
        when(productMapper.mapDtoToEntity(dto, category, seller)).thenReturn(product);
        when(productRepository.save(any(Product.class))).thenReturn(product);
        when(productMapper.mapEntityToDto(product)).thenReturn(productRespDto);

        ProductRespDto actualCall = productService.addProduct(dto, "rahul123");

        assertThat(actualCall.productName()).isEqualTo("iphone 14");
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    void addProduct_mustCallSaveOnlyOnce() {
        ProductReqDto dto = new ProductReqDto("oneplus 12", "good phone", 45000, 5, null, 1);

        when(categoryService.getById(1)).thenReturn(category);
        when(sellerService.getByUsername("seller1")).thenReturn(seller);
        when(productMapper.mapDtoToEntity(dto, category, seller)).thenReturn(product1);
        when(productRepository.save(any(Product.class))).thenReturn(product1);
        when(productMapper.mapEntityToDto(product1)).thenReturn(productRespDto);

        productService.addProduct(dto, "seller1");

        // checking repo call happens only once, not extra times
        verify(productRepository, times(1)).save(any(Product.class));
        verify(productRepository, never()).findAll();
    }

    @Test
    void deleteProduct_mustDeleteWhenNoDependenciesExist() {
        when(productRepository.findById(100)).thenReturn(Optional.of(product));
        when(reviewRepository.findByProductId(100)).thenReturn(List.of());
        when(cartRepository.findAll()).thenReturn(List.of());
        when(orderRepository.findAll()).thenReturn(List.of());
        when(productImageRepository.findByProductId(100)).thenReturn(List.of());

        // when thenReturn does not work in void method tests
        doNothing().when(productRepository).deleteById(100);

        productService.deleteById(100);

        // check if repo call happens only once
        verify(productRepository, times(1)).deleteById(100);
        verify(productRepository, times(1)).findById(100);
    }

    @Test
    void deleteProduct_throwsWhenProductDoesNotExist() {
        when(productRepository.findById(100)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.deleteById(100))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Invalid product id");

        // delete should never be called since getById throws first
        verify(productRepository, never()).deleteById(anyInt());
    }
}
