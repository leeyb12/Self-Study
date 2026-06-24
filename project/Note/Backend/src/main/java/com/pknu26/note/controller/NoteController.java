package com.pknu26.note.controller;

import com.pknu26.note.dto.NoteRequest;
import com.pknu26.note.dto.NoteResponse;
import com.pknu26.note.dto.SummaryResponse;
import com.pknu26.note.service.NoteService;
import com.pknu26.note.service.SummaryService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    private final NoteService noteService;
    private final SummaryService summaryService;

    public NoteController(NoteService noteService, SummaryService summaryService) {
        this.noteService = noteService;
        this.summaryService = summaryService;
    }

    @GetMapping
    public List<NoteResponse> list(@AuthenticationPrincipal Long userId,
                                   @RequestParam(required = false) Long folderId) {
        // folderId 미지정=전체, 0=미분류, 그 외=해당 폴더
        return noteService.findAll(userId, folderId);
    }

    @GetMapping("/trash")
    public List<NoteResponse> trash(@AuthenticationPrincipal Long userId) {
        return noteService.findTrash(userId);
    }

    @GetMapping("/{id}")
    public NoteResponse get(@AuthenticationPrincipal Long userId, @PathVariable Long id) {
        return noteService.findOne(userId, id);
    }

    @PostMapping
    public ResponseEntity<NoteResponse> create(@AuthenticationPrincipal Long userId,
                                               @Valid @RequestBody NoteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(noteService.create(userId, request));
    }

    @PutMapping("/{id}")
    public NoteResponse update(@AuthenticationPrincipal Long userId, @PathVariable Long id,
                               @Valid @RequestBody NoteRequest request) {
        return noteService.update(userId, id, request);
    }

    /** 휴지통으로 이동(소프트 삭제). */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal Long userId, @PathVariable Long id) {
        noteService.delete(userId, id);
        return ResponseEntity.noContent().build();
    }

    /** 휴지통 비우기 (전체 완전 삭제). "/{id}" 보다 먼저 매칭되도록 리터럴 경로 사용. */
    @DeleteMapping("/trash")
    public ResponseEntity<Void> emptyTrash(@AuthenticationPrincipal Long userId) {
        noteService.emptyTrash(userId);
        return ResponseEntity.noContent().build();
    }

    /** 휴지통에서 복원. */
    @PostMapping("/{id}/restore")
    public NoteResponse restore(@AuthenticationPrincipal Long userId, @PathVariable Long id) {
        return noteService.restore(userId, id);
    }

    /** 완전 삭제. */
    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<Void> deletePermanent(@AuthenticationPrincipal Long userId,
                                                @PathVariable Long id) {
        noteService.deletePermanent(userId, id);
        return ResponseEntity.noContent().build();
    }

    /** 노트 본문 + 첨부파일을 로컬 LLM(Ollama)으로 요약한다. */
    @PostMapping("/{id}/summarize")
    public SummaryResponse summarize(@AuthenticationPrincipal Long userId, @PathVariable Long id) {
        return summaryService.summarize(userId, id);
    }
}
