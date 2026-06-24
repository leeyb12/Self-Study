package com.pknu26.note.service;

import com.pknu26.note.dto.AttachmentResponse;
import com.pknu26.note.entity.Attachment;
import com.pknu26.note.exception.ApiException;
import com.pknu26.note.repository.AttachmentRepository;
import com.pknu26.note.repository.NoteRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final NoteRepository noteRepository;
    private final FileStorageService storage;
    private final TextExtractor textExtractor;

    public AttachmentService(AttachmentRepository attachmentRepository, NoteRepository noteRepository,
                             FileStorageService storage, TextExtractor textExtractor) {
        this.attachmentRepository = attachmentRepository;
        this.noteRepository = noteRepository;
        this.storage = storage;
        this.textExtractor = textExtractor;
    }

    @Transactional
    public AttachmentResponse upload(Long userId, Long noteId, MultipartFile file) {
        requireOwnedNote(userId, noteId);
        String storedName = storage.store(file);
        Attachment saved = attachmentRepository.save(Attachment.builder()
                .noteId(noteId)
                .userId(userId)
                .originalName(file.getOriginalFilename())
                .storedName(storedName)
                .contentType(file.getContentType())
                .sizeBytes(file.getSize())
                .build());
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<AttachmentResponse> list(Long userId, Long noteId) {
        requireOwnedNote(userId, noteId);
        return attachmentRepository.findByNoteIdOrderByCreatedAtAsc(noteId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public Attachment getOwned(Long userId, Long attachmentId) {
        return attachmentRepository.findByIdAndUserId(attachmentId, userId)
                .orElseThrow(() -> ApiException.notFound("첨부파일을 찾을 수 없습니다."));
    }

    @Transactional
    public void delete(Long userId, Long attachmentId) {
        Attachment attachment = getOwned(userId, attachmentId);
        attachmentRepository.delete(attachment);
        storage.delete(attachment.getStoredName());
    }

    /** 노트의 모든 첨부파일을 디스크에서 삭제한다(행은 노트 삭제 시 FK CASCADE 로 제거됨). */
    @Transactional(readOnly = true)
    public void deleteFilesForNote(Long noteId) {
        for (Attachment a : attachmentRepository.findByNoteIdOrderByCreatedAtAsc(noteId)) {
            storage.delete(a.getStoredName());
        }
    }

    /** 노트에 달린 모든 첨부파일에서 추출한 텍스트를 합쳐 반환한다 (요약용). */
    @Transactional(readOnly = true)
    public String collectExtractedText(Long noteId) {
        StringBuilder sb = new StringBuilder();
        for (Attachment a : attachmentRepository.findByNoteIdOrderByCreatedAtAsc(noteId)) {
            String text = textExtractor.extract(
                    storage.resolve(a.getStoredName()), a.getContentType(), a.getOriginalName());
            if (!text.isBlank()) {
                sb.append("\n\n[첨부파일: ").append(a.getOriginalName()).append("]\n").append(text);
            }
        }
        return sb.toString();
    }

    private AttachmentResponse toResponse(Attachment a) {
        boolean extractable = textExtractor.isExtractable(a.getContentType(), a.getOriginalName());
        return AttachmentResponse.from(a, extractable);
    }

    private void requireOwnedNote(Long userId, Long noteId) {
        if (noteRepository.findByIdAndUserId(noteId, userId).isEmpty()) {
            throw ApiException.notFound("노트를 찾을 수 없습니다.");
        }
    }
}
