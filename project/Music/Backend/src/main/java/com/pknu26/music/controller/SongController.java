package com.pknu26.music.controller;

import com.pknu26.music.dto.SongResponse;
import com.pknu26.music.service.SongService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/songs")
@RequiredArgsConstructor
public class SongController {

    private final SongService songService;

    @GetMapping
    public ResponseEntity<List<SongResponse>> getAll(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(songService.getAll(userDetails.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SongResponse> getOne(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(songService.getOne(id, userDetails.getUsername()));
    }

   @PostMapping
    public ResponseEntity<?> upload(
            @RequestParam("title")     String title,
            @RequestParam("artist")    String artist,
            @RequestParam(value = "lyrics", required = false, defaultValue = "") String lyrics,
            @RequestParam("musicFile") MultipartFile musicFile,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {

        songService.upload(title, artist, lyrics, musicFile, imageFile,
                        userDetails.getUsername());
        return ResponseEntity.ok("업로드 완료");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable("id")    Long id,
            @RequestParam("title")  String title,
            @RequestParam("artist") String artist,
            @RequestParam(value = "lyrics", required = false, defaultValue = "") String lyrics,
            @AuthenticationPrincipal UserDetails userDetails) {

        songService.update(id, title, artist, lyrics, userDetails.getUsername());
        return ResponseEntity.ok("수정 완료");
    }

    @PutMapping("/{id}/image")
    public ResponseEntity<?> updateImage(
            @PathVariable("id")        Long id,
            @RequestParam("imageFile") MultipartFile imageFile,
            @AuthenticationPrincipal   UserDetails userDetails) throws IOException {

        return ResponseEntity.ok(
                songService.updateImage(id, imageFile, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        songService.delete(id, userDetails.getUsername());
        return ResponseEntity.ok("삭제 완료");
    }
}