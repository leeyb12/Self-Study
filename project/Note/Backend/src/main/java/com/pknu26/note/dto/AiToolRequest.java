package com.pknu26.note.dto;

import jakarta.validation.constraints.NotBlank;

public record AiToolRequest(
        // translate | polish | continue
        @NotBlank String action,
        @NotBlank String text,
        // translate 일 때 대상 언어 (예: "English", "한국어"). 그 외 동작에서는 무시.
        String targetLang
) {
}
