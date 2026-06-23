package com.pknu26.phonebook.service;

import java.util.List;
import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pknu26.phonebook.dto.AuthResponse;
import com.pknu26.phonebook.dto.LoginRequest;
import com.pknu26.phonebook.dto.SignupRequest;
import com.pknu26.phonebook.entity.ContactGroup;
import com.pknu26.phonebook.entity.User;
import com.pknu26.phonebook.exception.DuplicateResourceException;
import com.pknu26.phonebook.exception.InvalidCredentialsException;
import com.pknu26.phonebook.repository.ContactGroupRepository;
import com.pknu26.phonebook.repository.UserRepository;
import com.pknu26.phonebook.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    /** 회원가입 시 자동 생성되는 기본 그룹 (이름 → 색상) */
    private static final Map<String, String> DEFAULT_GROUPS = Map.of(
        "가족", "#ef4444",
        "친구", "#3b82f6",
        "직장", "#10b981",
        "기타", "#8b5cf6"
    );

    private final UserRepository userRepo;
    private final ContactGroupRepository groupRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse signup(SignupRequest req) {
        if (userRepo.existsByUsername(req.getUsername()))
            throw new DuplicateResourceException("이미 존재하는 아이디입니다.");

        User user = User.builder()
            .username(req.getUsername())
            .password(passwordEncoder.encode(req.getPassword()))
            .role("ROLE_USER")
            .build();
        userRepo.save(user);

        createDefaultGroups(user);

        String token = tokenProvider.generateToken(user.getUsername());
        return AuthResponse.builder()
            .token(token)
            .username(user.getUsername())
            .message("회원가입 성공")
            .build();
    }
 
    public AuthResponse login(LoginRequest req) {
        User user = userRepo.findByUsername(req.getUsername())
            .orElseThrow(() -> new InvalidCredentialsException("아이디 또는 비밀번호가 올바르지 않습니다."));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword()))
            throw new InvalidCredentialsException("아이디 또는 비밀번호가 올바르지 않습니다.");
 
        String token = tokenProvider.generateToken(user.getUsername());
        return AuthResponse.builder()
            .token(token)
            .username(user.getUsername())
            .message("로그인 성공")
            .build();
    }

    private void createDefaultGroups(User user) {
        List<ContactGroup> groups = DEFAULT_GROUPS.entrySet().stream()
            .map(e -> ContactGroup.builder()
                .user(user)
                .name(e.getKey())
                .color(e.getValue())
                .build())
            .toList();
        groupRepo.saveAll(groups);
    }
}
