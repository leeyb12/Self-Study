package com.pknu26.phonebook.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.pknu26.phonebook.entity.User;
import com.pknu26.phonebook.repository.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 * SecurityContext 에 저장된 인증 정보(username)를 기준으로
 * 현재 로그인한 User 엔티티를 조회한다.
 */
@Component
@RequiredArgsConstructor
public class CurrentUser {

    private final UserRepository userRepo;

    public User get() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new IllegalStateException("인증 정보가 없습니다.");
        }
        return userRepo.findByUsername(auth.getName())
            .orElseThrow(() -> new IllegalStateException("사용자를 찾을 수 없습니다."));
    }
}
