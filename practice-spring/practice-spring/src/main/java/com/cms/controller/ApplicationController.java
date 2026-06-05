package com.cms.controller;

import com.cms.dto.ApplicationResponseDto;
import com.cms.service.ApplicationService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@AllArgsConstructor

public class ApplicationController {
    private final ApplicationService applicationService;

    @PostMapping("/api/applications")
    public void apply(Principal principal, @RequestParam int jobId) {
        String username = principal.getName();
        applicationService.apply(username, jobId);
    }

    @GetMapping("/api/my-applications")
    public List<ApplicationResponseDto> viewMyApplications(
            Principal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        String username = principal.getName();
        return applicationService.getMyApplications(username, page, size);
    }
}
