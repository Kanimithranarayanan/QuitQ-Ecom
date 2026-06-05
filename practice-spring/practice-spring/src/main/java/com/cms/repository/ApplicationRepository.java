package com.cms.repository;

import com.cms.entity.Application;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


public interface ApplicationRepository extends JpaRepository<Application,Integer> {
    @Query("""
            select a from Application a
            where a.jobSeeker.user.username = ?1
            """)
    Page<Application> findByJobSeekerUsername(String username, Pageable pageable);
}


