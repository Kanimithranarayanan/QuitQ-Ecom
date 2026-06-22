package com.quitq.service;

import com.quitq.dto.CategoryReqDto;
import com.quitq.exception.ResourceNotFoundException;
import com.quitq.model.Category;
import com.quitq.repository.CartRepository;
import com.quitq.repository.CategoryRepository;
import com.quitq.repository.OrderRepository;
import com.quitq.repository.ProductImageRepository;
import com.quitq.repository.ProductRepository;
import com.quitq.repository.ReviewRepository;
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
public class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductImageRepository productImageRepository;

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private CartRepository cartRepository;

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private CategoryService categoryService;

    private Category category;
    private Category category1;
    private Category category2;

    // common sample data for all test cases in categoryService
    // sequence:- sample data loads - test case runs - sample data deloads
    @BeforeEach
    void setUp() {
        category = new Category();
        category.setId(1);
        category.setCategoryName("mobiles");
        category.setDescription("all mobile phones");

        category1 = new Category();
        category1.setId(2);
        category1.setCategoryName("laptops");
        category1.setDescription("all laptops");

        category2 = new Category(); // 555
        category2.setId(3);
        category2.setCategoryName("headphones");
        category2.setDescription("all headphones");
    }

    @Test
    public void getAllCategories_MustReturnSomething() {
        when(categoryRepository.findAll()).thenReturn(List.of(category, category1));

        List<Category> actualCall = categoryService.getAll();

        assertThat(actualCall).hasSize(2);
        assertThat(actualCall.getFirst().getCategoryName()).isEqualToIgnoringCase("mobiles");
        assertThat(actualCall.get(1).getCategoryName()).isEqualToIgnoringCase("laptops");
    }

    @Test
    public void getAllCategories_ReturnsEmptyList() {
        when(categoryRepository.findAll()).thenReturn(List.of());

        // actual call
        List<Category> actualCall = categoryService.getAll();

        assertThat(actualCall).hasSize(0);
        assertThat(actualCall).isEmpty();
    }

    @Test
    void getById_categoryExists() {
        when(categoryRepository.findById(100)).thenReturn(Optional.of(category));
        when(categoryRepository.findById(200)).thenReturn(Optional.of(category1));

        assertThat(categoryService.getById(100).getId()).isEqualTo(1);
        assertThat(categoryService.getById(200).getId()).isEqualTo(2);
        assertThat(categoryService.getById(100).getCategoryName()).isEqualTo("mobiles");
        assertThat(categoryService.getById(200).getCategoryName()).isEqualTo("laptops");
    }

    @Test
    void getById_categoryDoesNotExist() {
        when(categoryRepository.findById(100)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> categoryService.getById(100))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Invalid category id");

        verify(categoryRepository, times(1)).findById(100);
    }

    @Test
    void addCategory_mustSaveCategory() {
        when(categoryRepository.save(any(Category.class))).thenReturn(category2);

        CategoryReqDto dto = new CategoryReqDto("headphones", "all headphones"); // category2

        categoryService.addCategory(dto);

        // addCategory is void so we just verify save got called with correct values
        verify(categoryRepository, times(1)).save(any(Category.class));
    }

    @Test
    void addCategory_mustCallSaveOnlyOnce() {
        CategoryReqDto dto = new CategoryReqDto("tablets", "all tablets");

        categoryService.addCategory(dto);

        // checking repo call happens only once, not extra times
        verify(categoryRepository, times(1)).save(any(Category.class));
        verify(categoryRepository, never()).findAll();
    }

    @Test
    void deleteCategory_mustDeleteWhenNoProductsLinked() {
        when(categoryRepository.findById(100)).thenReturn(Optional.of(category));
        when(productRepository.findByCategoryId(100)).thenReturn(List.of());

        // when thenReturn does not work in void method tests
        doNothing().when(categoryRepository).deleteById(100);

        categoryService.deleteById(100);

        // check if repo call happens only once
        verify(categoryRepository, times(1)).deleteById(100);
        verify(categoryRepository, times(1)).findById(100);
        verify(productRepository, times(1)).findByCategoryId(100);
    }

    @Test
    void deleteCategory_throwsWhenCategoryDoesNotExist() {
        when(categoryRepository.findById(100)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> categoryService.deleteById(100))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Invalid category id");

        // delete should never be called since getById throws first
        verify(categoryRepository, never()).deleteById(anyInt());
    }
}
