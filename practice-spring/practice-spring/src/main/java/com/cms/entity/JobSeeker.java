package com.cms.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter


public class JobSeeker {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    private int id;
    private String name;
    private String email;
    private String resumeSummary;
    @OneToOne
    private User user;


}
