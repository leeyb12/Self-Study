package com.pknu26.phonebook.dto;

import lombok.Builder;
import lombok.Getter;

@Getter 
@Builder
public class AuthResponse {
    private String token;
    private String username;
    private String message;
}
