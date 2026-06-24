package com.pknu26.note.dto;

import com.pknu26.note.entity.Note;
import java.time.LocalDateTime;

public record NoteResponse(
        Long id,
        String title,
        String content,
        Long folderId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static NoteResponse from(Note note) {
        return new NoteResponse(
                note.getId(),
                note.getTitle(),
                note.getContent(),
                note.getFolderId(),
                note.getCreatedAt(),
                note.getUpdatedAt()
        );
    }
}
