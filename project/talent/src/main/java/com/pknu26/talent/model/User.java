package com.pknu26.talent.model;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class User {
    private Long id;
    private String username;
    private String password;
    private String name;
    private String role;
    private LocalDateTime createdAt;
}
