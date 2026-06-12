package com.pknu26.phonebook.security;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
 
    private final JwtTokenProvider tokenProvider;
 
    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain chain
    ) throws ServletException, IOException {
 
        String header = request.getHeader("Authorization");

        System.out.println("DEBUG: [요청 경로] " + request.getRequestURI());
        System.out.println("DEBUG: [인증 헤더] " + header);
 
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            if (tokenProvider.validateToken(token)) {
                String username = tokenProvider.getUsername(token);
                System.out.println("DEBUG: [인증 성공] 사용자: " + username);
                UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(
                        username, null,
                        List.of(new SimpleGrantedAuthority("ROLE_USER"))
                    );
                SecurityContextHolder.getContext().setAuthentication(auth);
            }else {
            System.out.println("DEBUG: [인증 실패] 유효하지 않은 토큰");
        }
    } else {
        System.out.println("DEBUG: [인증 실패] 헤더 없음");
    }
    chain.doFilter(request, response);
    }
}
