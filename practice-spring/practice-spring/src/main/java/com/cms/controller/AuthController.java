package com.cms.controller;

import com.cms.dto.TokenDto;
import com.cms.dto.UserRegisterDto;
import com.cms.entity.Employee;
import com.cms.entity.JobSeeker;
import com.cms.entity.User;
import com.cms.enums.Role;
import com.cms.service.EmployeeService;
import com.cms.service.JobSeekerService;
import com.cms.service.UserService;

import com.cms.utility.JwtUtility;
import lombok.AllArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;


@RestController
@AllArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    private final EmployeeService employerService;
    private final JobSeekerService jobSeekerService;
    private final JwtUtility jwtUtility;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public void register(@RequestBody UserRegisterDto dto) {
        User user = new User();
        user.setUsername(dto.username());
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setRole(dto.role());
        User savedUser = userService.save(user);

        if (dto.role() == Role.EMPLOYER) {
            Employee employer = new Employee();
            employer.setCompanyName(dto.companyName());
            employer.setUser(savedUser);
            employerService.save(employer);
        } else if (dto.role() == Role.SEEKER) {
            JobSeeker seeker = new JobSeeker();
            seeker.setName(dto.name());
            seeker.setEmail(dto.email());
            seeker.setResumeSummary(dto.resumeSummary());
            seeker.setUser(savedUser);
            jobSeekerService.save(seeker);
        }
    }

    @GetMapping("/login")
    public TokenDto login(Principal principal) {
        String username = principal.getName();
        String token = jwtUtility.generateToken(username);
        return new TokenDto(username, token);
    }
}