package com.quitq.service;

import com.quitq.dto.AdminCreateDto;
import com.quitq.enums.Role;
import com.quitq.model.User;
import com.quitq.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void createAdmin(AdminCreateDto dto) {
        if (userRepository.findByUsername(dto.username()).isPresent()) {
            throw new RuntimeException("Username '" + dto.username() + "' is already taken");
        }
        User user = new User();
        user.setUsername(dto.username());
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setRole(Role.ADMIN);
        userRepository.save(user);
    }
}