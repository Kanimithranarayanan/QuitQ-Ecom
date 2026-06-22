package com.quitq.service;

import com.quitq.dto.ResetPasswordDto;
import com.quitq.exception.ResourceNotFoundException;
import com.quitq.model.User;
import com.quitq.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {

    private static final Logger logger =
            LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            @Lazy PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        logger.info("Fetching user details by given username {}", username);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Invalid Credentials"));

        logger.info("User details fetched for user {}", user.getUsername());

        return user;
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public void resetPassword(ResetPasswordDto dto) {

        User user = userRepository.findByUsername(dto.username())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No account found for username: "
                                        + dto.username()));

        user.setPassword(passwordEncoder.encode(dto.newPassword()));
        userRepository.save(user);
    }
}