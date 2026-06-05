package com.cms.repository;

import com.cms.entity.JobSeeker;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobSeekerRepository extends JpaRepository<JobSeeker,Integer> {
    JobSeeker findByUserUsername(String username);
}
