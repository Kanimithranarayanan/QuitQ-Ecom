package com.cms.mapper;

import com.cms.dto.BookResponseDto;
import com.cms.entity.Book;
import org.springframework.stereotype.Component;

@Component
public class BookMapper {
    public BookResponseDto entityToResponseDto(Book book){
        return new BookResponseDto(
                book.getId(),
                book.getTitle(),
                book.getAuthor().getName(),
                book.getAuthor().getEmail()

        );
    }
}
