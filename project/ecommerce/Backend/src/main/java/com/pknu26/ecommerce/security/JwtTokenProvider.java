package com.pknu26.ecommerce.security;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class JwtTokenProvider {
 
    private final SecretKey key;
    private final long accessTokenExpiry;
    private final long refreshTokenExpiry;
 
    public JwtTokenProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-token-expiry}") long accessTokenExpiry,
            @Value("${jwt.refresh-token-expiry}") long refreshTokenExpiry) {
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        this.accessTokenExpiry = accessTokenExpiry;
        this.refreshTokenExpiry = refreshTokenExpiry;
    }
 
    // Access Token 생성
    public String generateAccessToken(Long memberId, String email, String role) {
        return Jwts.builder()
            .subject(String.valueOf(memberId))
            .claim("email", email)
            .claim("role", role)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + accessTokenExpiry))
            .signWith(key)
            .compact();
    }
 
    // Refresh Token 생성
    public String generateRefreshToken(Long memberId) {
        return Jwts.builder()
            .subject(String.valueOf(memberId))
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + refreshTokenExpiry))
            .signWith(key)
            .compact();
    }
 
    // 토큰 유효성 검사
    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.warn("JWT 만료: {}", e.getMessage());
        } catch (JwtException | IllegalArgumentException e) {
            log.warn("JWT 오류: {}", e.getMessage());
        }
        return false;
    }
 
    // Claims 추출
    public Claims getClaims(String token) {
        return Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
 
    public Long getMemberId(String token) {
        return Long.parseLong(getClaims(token).getSubject());
    }
 
    public String getRole(String token) {
        return getClaims(token).get("role", String.class);
    }
}
