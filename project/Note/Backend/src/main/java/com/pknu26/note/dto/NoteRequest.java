package com.pknu26.note.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record NoteRequest(
        @NotBlank @Size(max = 255) String title,
        // null 이면 미분류
        Long folderId,
        // null 이면 기본값(classic / plain)
        String cover,
        String paper
) {
}
