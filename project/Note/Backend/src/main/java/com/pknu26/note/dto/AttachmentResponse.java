package com.pknu26.note.dto;

import com.pknu26.note.entity.Attachment;
import java.time.LocalDateTime;

public record AttachmentResponse(
        Long id,
        String originalName,
        String contentType,
        long sizeBytes,
        boolean textExtractable,
        LocalDateTime createdAt
) {
    public static AttachmentResponse from(Attachment a, boolean textExtractable) {
        return new AttachmentResponse(
                a.getId(),
                a.getOriginalName(),
                a.getContentType(),
                a.getSizeBytes(),
                textExtractable,
                a.getCreatedAt()
        );
    }
}
