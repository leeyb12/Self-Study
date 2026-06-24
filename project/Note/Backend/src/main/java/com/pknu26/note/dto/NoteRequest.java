package com.pknu26.note.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record NoteRequest(
        @NotBlank @Size(max = 255) String title,
        String content,
        // null 이면 미분류
        Long folderId
) {
}
