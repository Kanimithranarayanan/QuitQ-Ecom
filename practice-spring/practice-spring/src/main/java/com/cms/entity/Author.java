package com.cms.entity;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Getter
@Setter
public class Author {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;
    private String email;
}
