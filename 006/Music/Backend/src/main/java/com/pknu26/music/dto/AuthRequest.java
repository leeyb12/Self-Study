package com.pknu26.music.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
public class AuthRequest {

    private final String username;
    private final String password;

    @JsonCreator
    public AuthRequest(
            @JsonProperty("username") String username,
            @JsonProperty("password") String password) {
        this.username = username;
        this.password = password;
    }

    @Override
    public String toString() {
        return "AuthRequest{username='" + username + "'}";
    }
}