package com.pknu26.phonebook.exception;

/** 이미 존재하는 리소스를 다시 만들려 할 때 (409) */
public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }
}
