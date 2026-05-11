package com.pknu26.music.controller;

import com.pknu26.music.dto.BoardDTO;
import com.pknu26.music.dto.CommentDTO;
import com.pknu26.music.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @GetMapping
    public ResponseEntity<List<BoardDTO>> getAll() {
        return ResponseEntity.ok(boardService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BoardDTO> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(boardService.getOne(id));
    }

    @PostMapping
    public ResponseEntity<BoardDTO> create(
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam(required = false) List<MultipartFile> files,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {
        return ResponseEntity.ok(
                boardService.create(title, content, files, userDetails.getUsername()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BoardDTO> update(
            @PathVariable Long id,
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam(required = false) List<MultipartFile> files,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {
        return ResponseEntity.ok(
                boardService.update(id, title, content, files, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        boardService.delete(id, userDetails.getUsername());
        return ResponseEntity.ok("삭제 완료");
    }

    @DeleteMapping("/files/{fileId}")
    public ResponseEntity<?> deleteFile(
            @PathVariable Long fileId,
            @AuthenticationPrincipal UserDetails userDetails) {
        boardService.deleteFile(fileId, userDetails.getUsername());
        return ResponseEntity.ok("파일 삭제 완료");
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<CommentDTO>> getComments(@PathVariable Long id) {
        return ResponseEntity.ok(boardService.getComments(id));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentDTO> addComment(
            @PathVariable Long id,
            @RequestParam String content,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                boardService.addComment(id, content, userDetails.getUsername()));
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserDetails userDetails) {
        boardService.deleteComment(commentId, userDetails.getUsername());
        return ResponseEntity.ok("댓글 삭제 완료");
    }
}