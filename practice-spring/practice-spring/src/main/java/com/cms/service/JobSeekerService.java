package com.cms.service;

import com.cms.entity.JobSeeker;
import com.cms.repository.JobSeekerRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor

public class JobSeekerService {
    private final JobSeekerRepository jobSeekerRepository;

    public void save(JobSeeker seeker) {
        jobSeekerRepository.save(seeker);
    }

    public JobSeeker getByUsername(String username) {
        return jobSeekerRepository.findByUserUsername(username);
    }
}