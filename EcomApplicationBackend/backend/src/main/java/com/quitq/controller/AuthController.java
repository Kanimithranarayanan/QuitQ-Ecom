package com.quitq.controller;

import com.quitq.dto.LoginResponseDto;
import com.quitq.dto.ResetPasswordDto;
import com.quitq.dto.TokenDto;
import com.quitq.model.User;
import com.quitq.service.UserService;
import com.quitq.utility.JwtUtility;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
@AllArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtUtility jwtUtility;

    @GetMapping("/login")
    public TokenDto login(Principal principal) {
        String username = principal.getName();
        String token = jwtUtility.generateToken(username);
        return new TokenDto(username, token);
    }

    @GetMapping("/user-details")
    public LoginResponseDto getUserDetails(Principal principal) {
        User user = (User) userService.loadUserByUsername(principal.getName());
        return new LoginResponseDto(
                user.getId(),
                user.getUsername(),
                user.getRole().toString()
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordDto dto) {
        userService.resetPassword(dto);
        return ResponseEntity.ok("Password reset successfully. You can now login with your new password.");
    }
}