package com.pknu26.music.controller;

import com.pknu26.music.dto.AuthRequest;
import com.pknu26.music.security.JwtTokenProvider;
import com.pknu26.music.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider      jwtTokenProvider;
    private final UserService           userService;

    @PostMapping(value = "/register", consumes = {"application/json", "text/plain", "*/*"})
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {
        try {
            userService.register(request);
            return ResponseEntity.ok(Map.of("message", "회원가입 완료"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping(value = "/login", consumes = {"application/json", "text/plain", "*/*"})
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getUsername(), request.getPassword())
            );
            String token = jwtTokenProvider.generateToken(request.getUsername());
            return ResponseEntity.ok(Map.of("token", token));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "아이디 또는 비밀번호가 틀렸습니다."));
        }
    }
}