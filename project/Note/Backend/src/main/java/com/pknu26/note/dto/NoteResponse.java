package com.pknu26.note.dto;

import com.pknu26.note.entity.Note;
import java.time.LocalDateTime;

public record NoteResponse(
        Long id,
        String title,
        Long folderId,
        String cover,
        String paper,
        int pageCount,
        // 카드 미리보기용: 첫 페이지 내용 일부
        String preview,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static NoteResponse of(Note note, int pageCount, String preview) {
        return new NoteResponse(
                note.getId(),
                note.getTitle(),
                note.getFolderId(),
                note.getCover(),
                note.getPaper(),
                pageCount,
                preview,
                note.getCreatedAt(),
                note.getUpdatedAt()
        );
    }
}
