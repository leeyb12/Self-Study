package com.pknu26.note.dto;

public record TokenResponse(
        String accessToken,
        String tokenType,
        Long userId,
        String email
) {
    public static TokenResponse bearer(String accessToken, Long userId, String email) {
        return new TokenResponse(accessToken, "Bearer", userId, email);
    }
}
