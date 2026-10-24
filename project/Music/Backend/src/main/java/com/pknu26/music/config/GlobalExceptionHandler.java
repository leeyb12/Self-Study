package com.pknu26.music.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleNotFound(IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<?> handleUnauthorized(UsernameNotFoundException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", e.getMessage()));
    }

    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<?> handleForbidden(SecurityException e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", e.getMessage()));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<?> handleConflict(IllegalStateException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", e.getMessage()));
    }

    // 정적 리소스 못 찾는 경우 — ExceptionHandler에서 제외 (그냥 404 반환)
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<?> handleNoResource(
            NoResourceFoundException e, HttpServletRequest request) {
        String path = request.getRequestURI();
        // /music/** /board-files/** 경로는 핸들러에서 처리하지 않음
        if (path.startsWith("/music/") || path.startsWith("/board-files/")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "리소스를 찾을 수 없습니다."));
    }

    // 일반 예외 — API 경로일 때만 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneral(
            Exception e, HttpServletRequest request) {
        String path = request.getRequestURI();

        // 정적 파일 경로는 핸들러에서 제외
        if (path.startsWith("/music/") || path.startsWith("/board-files/")) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        log.error("Unhandled request error for {} {}", request.getMethod(), path, e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "서버 내부 오류가 발생했습니다."));
    }
}
