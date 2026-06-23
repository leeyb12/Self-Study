package com.pknu26.ecommerce.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException {

    private final HttpStatus status;
    private final String code;

    public BusinessException(String message, HttpStatus status, String code) {
        super(message);
        this.status = status;
        this.code = code;
    }

    // 자주 쓰는 예외 팩토리 메서드
    public static BusinessException notFound(String resource) {
        return new BusinessException (
            resource + "을(를) 찾을 수 없습니다.",
            HttpStatus.NOT_FOUND,
            "NOT_FOUND"
        );
    }

    public static BusinessException badRequest(String message) {
        return new BusinessException(message, HttpStatus.BAD_REQUEST, "BAD_REQUEST");
    }

    public static BusinessException unauthorized(String message) {
        return new BusinessException(message, HttpStatus.UNAUTHORIZED, "UNAUTHORIZED");
    }

    public static BusinessException forbidden(String message) {
        return new BusinessException(message, HttpStatus.FORBIDDEN, "FORBIDDEN");
    }

    public static BusinessException conflict(String message) {
        return new BusinessException(message, HttpStatus.CONFLICT, "CONFLICT");
    }
}
