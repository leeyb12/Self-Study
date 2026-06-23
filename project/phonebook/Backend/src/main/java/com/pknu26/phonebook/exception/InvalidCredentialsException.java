package com.pknu26.phonebook.exception;

/** 로그인 자격 증명이 올바르지 않을 때 (401) */
public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException(String message) {
        super(message);
    }
}
