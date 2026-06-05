package com.cms.controller;

import com.cms.dto.CreateJobDto;
import com.cms.dto.JobResponseDto;
import com.cms.service.JobService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping ("/api/jobs")
@AllArgsConstructor
public class JobController {
    private final JobService jobService;

    @PostMapping
    public void postJob(Principal principal, @Valid @RequestBody CreateJobDto dto) {
        String username = principal.getName();
        jobService.addJob(username, dto);
    }


    @GetMapping
    public List<JobResponseDto> browseJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return jobService.getAllJobs(page, size);
    }
}




