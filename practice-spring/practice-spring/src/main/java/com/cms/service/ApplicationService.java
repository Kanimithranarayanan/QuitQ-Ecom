package com.cms.service;

import com.cms.dto.ApplicationResponseDto;
import com.cms.entity.Application;
import com.cms.entity.Job;
import com.cms.entity.JobSeeker;
import com.cms.mapper.ApplicationMapper;
import com.cms.repository.ApplicationRepository;
import lombok.AllArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor

public class ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final JobService jobService;
    private final JobSeekerService jobSeekerService;
    private final ApplicationMapper applicationMapper;

    public void apply(String username, int jobId) {
        JobSeeker seeker = jobSeekerService.getByUsername(username);
        Job job = jobService.getById(jobId);

        Application application = new Application();
        application.setJobSeeker(seeker);
        application.setJob(job);

        applicationRepository.save(application);
    }

    public List<ApplicationResponseDto> getMyApplications(String username, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Application> appPage = applicationRepository.findByJobSeekerUsername(username, pageable);
        return appPage.getContent().stream()
                .map(applicationMapper::mapEntityToDto)
                .toList();
    }
}