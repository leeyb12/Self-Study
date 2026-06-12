package com.pknu26.phonebook.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.pknu26.phonebook.dto.AuthResponse;
import com.pknu26.phonebook.dto.LoginRequest;
import com.pknu26.phonebook.dto.SignupRequest;
import com.pknu26.phonebook.entity.User;
import com.pknu26.phonebook.repository.UserRepository;
import com.pknu26.phonebook.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
 
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
 
    public AuthResponse signup(SignupRequest req) {
        if (userRepo.existsByUsername(req.getUsername()))
            throw new RuntimeException("이미 존재하는 아이디입니다.");
 
        User user = User.builder()
            .username(req.getUsername())
            .password(passwordEncoder.encode(req.getPassword()))
            .role("ROLE_USER")
            .build();
        userRepo.save(user);
 
        String token = tokenProvider.generateToken(user.getUsername());
        return AuthResponse.builder()
            .token(token)
            .username(user.getUsername())
            .message("회원가입 성공")
            .build();
    }
 
    public AuthResponse login(LoginRequest req) {
        User user = userRepo.findByUsername(req.getUsername())
            .orElseThrow(() -> new RuntimeException("아이디 또는 비밀번호가 올바르지 않습니다."));
 
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword()))
            throw new RuntimeException("아이디 또는 비밀번호가 올바르지 않습니다.");
 
        String token = tokenProvider.generateToken(user.getUsername());
        return AuthResponse.builder()
            .token(token)
            .username(user.getUsername())
            .message("로그인 성공")
            .build();
    }
}
