package com.pknu26.telephonebook.dto;

import lombok.*;

@Getter @Builder
public class AuthResponse {
    private String token;
    private String username;
    private String message;
}
