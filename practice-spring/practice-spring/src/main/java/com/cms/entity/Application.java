package com.cms.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Getter
@Setter

public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @CreationTimestamp
    @Column(updatable = false)
    private Instant appliedAt;
    @ManyToOne
    private JobSeeker jobSeeker;
    @ManyToOne
    private Job job;

}
