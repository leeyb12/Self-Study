package com.pknu26.note.controller;

import com.pknu26.note.dto.PageRequest;
import com.pknu26.note.dto.PageResponse;
import com.pknu26.note.service.PageService;
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
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PageController {

    private final PageService pageService;

    public PageController(PageService pageService) {
        this.pageService = pageService;
    }

    @GetMapping("/api/notes/{noteId}/pages")
    public List<PageResponse> list(@AuthenticationPrincipal Long userId,
                                   @PathVariable("noteId") Long noteId) {
        return pageService.list(userId, noteId);
    }

    /** 맨 뒤에 새 페이지 추가. */
    @PostMapping("/api/notes/{noteId}/pages")
    public ResponseEntity<PageResponse> add(@AuthenticationPrincipal Long userId,
                                            @PathVariable("noteId") Long noteId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pageService.add(userId, noteId));
    }

    @PutMapping("/api/pages/{id}")
    public PageResponse update(@AuthenticationPrincipal Long userId,
                               @PathVariable("id") Long id,
                               @RequestBody PageRequest request) {
        return pageService.update(userId, id, request);
    }

    @DeleteMapping("/api/pages/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal Long userId,
                                       @PathVariable("id") Long id) {
        pageService.delete(userId, id);
        return ResponseEntity.noContent().build();
    }
}
