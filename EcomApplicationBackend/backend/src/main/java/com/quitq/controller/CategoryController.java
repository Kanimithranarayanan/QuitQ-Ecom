package com.quitq.controller;

import com.quitq.dto.CategoryReqDto;
import com.quitq.model.Category;
import com.quitq.service.CategoryService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/category")
@CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("/all")
    public List<Category> getAll() {
        return categoryService.getAll();
    }

    @GetMapping("/get-one/{id}")
    public Category getById(@PathVariable int id) {
        return categoryService.getById(id);
    }

    @PostMapping("/add")
    public void addCategory(@Valid @RequestBody CategoryReqDto dto) {
        categoryService.addCategory(dto);
    }

    @PutMapping("/update/{id}")
    public void update(@PathVariable int id, @Valid @RequestBody CategoryReqDto dto) {
        categoryService.update(id, dto);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteById(@PathVariable int id) {
        categoryService.deleteById(id);
    }
}
