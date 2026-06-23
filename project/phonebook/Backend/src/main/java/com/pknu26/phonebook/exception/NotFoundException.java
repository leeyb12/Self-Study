package com.pknu26.phonebook.exception;

/** 요청한 리소스를 찾을 수 없을 때 (404) */
public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) {
        super(message);
    }
}
