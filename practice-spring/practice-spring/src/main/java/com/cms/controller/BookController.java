package com.cms.controller;

import com.cms.dto.BookResponseDto;
import com.cms.service.BookService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@AllArgsConstructor
@RequestMapping("/api/book")

public class BookController {
    private final BookService bookService;
    @GetMapping("/api/author/books/v3")
    public Page<BookResponseDto> getMyBooksWithPagination(
            @RequestParam int page,
            @RequestParam int size,
            Principal principal) {
        String loggedInUserEmail = principal.getName();
        return bookService.getBooksByAuthor(loggedInUserEmail, page, size);
    }
}
