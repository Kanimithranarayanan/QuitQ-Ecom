package com.cms.service;

import com.cms.dto.JobResponseDto;
import com.cms.dto.CreateJobDto;

import com.cms.entity.Employee;
import com.cms.entity.Job;
import com.cms.exception.ResourceNotFoundException;
import com.cms.mapper.JobMapper;
import com.cms.repository.JobRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor

public class JobService {
    private final JobRepository jobRepository;
    private final EmployeeService employerService;
    private final JobMapper jobMapper;

    public Job getById(int id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid job id."));
    }

    public void addJob(String username, CreateJobDto dto) {
        Employee employer = employerService.getByUsername(username);
        Job job = jobMapper.mapDtoToEntity(dto);
        job.setEmployee(employer);
        jobRepository.save(job);
    }

    public List<JobResponseDto> getAllJobs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Job> jobPage = jobRepository.findAll(pageable);
        return jobPage.getContent().stream()
                .map(jobMapper::mapEntityToDto)
                .toList();
    }
}