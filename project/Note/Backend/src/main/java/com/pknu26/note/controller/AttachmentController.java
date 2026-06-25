package com.pknu26.note.controller;

import com.pknu26.note.dto.AttachmentResponse;
import com.pknu26.note.entity.Attachment;
import com.pknu26.note.service.AttachmentService;
import com.pknu26.note.service.FileStorageService;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class AttachmentController {

    private final AttachmentService attachmentService;
    private final FileStorageService storage;

    public AttachmentController(AttachmentService attachmentService, FileStorageService storage) {
        this.attachmentService = attachmentService;
        this.storage = storage;
    }

    @GetMapping("/api/notes/{noteId}/attachments")
    public List<AttachmentResponse> list(@AuthenticationPrincipal Long userId,
                                         @PathVariable("noteId") Long noteId) {
        return attachmentService.list(userId, noteId);
    }

    @PostMapping("/api/notes/{noteId}/attachments")
    public ResponseEntity<AttachmentResponse> upload(@AuthenticationPrincipal Long userId,
                                                     @PathVariable("noteId") Long noteId,
                                                     @RequestParam("file") MultipartFile file) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(attachmentService.upload(userId, noteId, file));
    }

    @GetMapping("/api/attachments/{id}/download")
    public ResponseEntity<Resource> download(@AuthenticationPrincipal Long userId,
                                             @PathVariable("id") Long id) {
        Attachment attachment = attachmentService.getOwned(userId, id);
        Path path = storage.resolve(attachment.getStoredName());
        if (!Files.exists(path)) {
            return ResponseEntity.notFound().build();
        }
        MediaType mediaType = attachment.getContentType() != null
                ? MediaType.parseMediaType(attachment.getContentType())
                : MediaType.APPLICATION_OCTET_STREAM;
        String encodedName = URLEncoder.encode(attachment.getOriginalName(), StandardCharsets.UTF_8)
                .replace("+", "%20");
        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename*=UTF-8''" + encodedName)
                .body(new FileSystemResource(path));
    }

    @DeleteMapping("/api/attachments/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal Long userId, @PathVariable("id") Long id) {
        attachmentService.delete(userId, id);
        return ResponseEntity.noContent().build();
    }
}
