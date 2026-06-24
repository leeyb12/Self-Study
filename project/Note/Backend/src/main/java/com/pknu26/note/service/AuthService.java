package com.pknu26.note.service;

import com.pknu26.note.dto.LoginRequest;
import com.pknu26.note.dto.SignupRequest;
import com.pknu26.note.dto.TokenResponse;
import com.pknu26.note.entity.User;
import com.pknu26.note.exception.ApiException;
import com.pknu26.note.repository.UserRepository;
import com.pknu26.note.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public TokenResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw ApiException.conflict("이미 가입된 이메일입니다.");
        }
        User user = userRepository.save(User.builder()
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .build());
        return issueToken(user);
    }

    @Transactional(readOnly = true)
    public TokenResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> ApiException.unauthorized("이메일 또는 비밀번호가 올바르지 않습니다."));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw ApiException.unauthorized("이메일 또는 비밀번호가 올바르지 않습니다.");
        }
        return issueToken(user);
    }

    private TokenResponse issueToken(User user) {
        String token = tokenProvider.createToken(user.getId(), user.getEmail());
        return TokenResponse.bearer(token, user.getId(), user.getEmail());
    }
}
