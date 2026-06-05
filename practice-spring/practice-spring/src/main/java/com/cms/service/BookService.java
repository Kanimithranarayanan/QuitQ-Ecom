package com.cms.service;

import com.cms.dto.BookResponseDto;
import com.cms.entity.Book;
import com.cms.mapper.BookMapper;
import com.cms.repository.BookRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class BookService {
    private final BookRepository bookRepository;
    private final BookMapper bookMapper;
    public Page<BookResponseDto >getBooksByAuthor(String authorEmail,int page,int size){
        Pageable pageable= PageRequest.of(page,size);
        Page<Book> bookpage=bookRepository.findByAuthorEmail(authorEmail,pageable);
        return bookpage.map(book ->bookMapper.entityToResponseDto(book));
    }

}
