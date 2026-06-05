package com.cms.repository;

import com.cms.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository  extends JpaRepository<Book,Integer> {
    Page<Book> findByAuthorEmail(String email, Pageable pageable);

}
