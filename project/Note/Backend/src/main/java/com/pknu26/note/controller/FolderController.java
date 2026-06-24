package com.pknu26.note.controller;

import com.pknu26.note.dto.FolderRequest;
import com.pknu26.note.dto.FolderResponse;
import com.pknu26.note.service.FolderService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/folders")
public class FolderController {

    private final FolderService folderService;

    public FolderController(FolderService folderService) {
        this.folderService = folderService;
    }

    @GetMapping
    public List<FolderResponse> list(@AuthenticationPrincipal Long userId) {
        return folderService.findAll(userId);
    }

    @PostMapping
    public ResponseEntity<FolderResponse> create(@AuthenticationPrincipal Long userId,
                                                 @Valid @RequestBody FolderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(folderService.create(userId, request));
    }

    @PutMapping("/{id}")
    public FolderResponse rename(@AuthenticationPrincipal Long userId, @PathVariable Long id,
                                 @Valid @RequestBody FolderRequest request) {
        return folderService.rename(userId, id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal Long userId, @PathVariable Long id) {
        folderService.delete(userId, id);
        return ResponseEntity.noContent().build();
    }
}
