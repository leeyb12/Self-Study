package com.pknu26.note.dto;

import jakarta.validation.constraints.NotBlank;

/** 채팅 메시지. role 은 "user" 또는 "assistant". */
public record ChatMessage(
        @NotBlank String role,
        @NotBlank String content
) {
}
