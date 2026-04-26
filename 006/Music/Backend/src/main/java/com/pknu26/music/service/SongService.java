package com.pknu26.music.service;

import com.pknu26.music.dto.SongResponse;
import com.pknu26.music.entity.Song;
import com.pknu26.music.entity.User;
import com.pknu26.music.repository.SongRepository;
import com.pknu26.music.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SongService {

    private final SongRepository songRepository;
    private final UserRepository userRepository;

    private static final String STORAGE_PATH = "C:/music_storage/";

    public void upload(String title, String artist, String lyrics,
                       MultipartFile musicFile, MultipartFile imageFile,
                       String username) throws IOException {

        User uploader = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("유저 없음"));

        String musicExt      = getExt(musicFile.getOriginalFilename());
        String musicFileName = UUID.randomUUID().toString() + musicExt;
        String musicPath     = STORAGE_PATH + musicFileName;
        musicFile.transferTo(new File(musicPath));

        String imagePath = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageExt      = getExt(imageFile.getOriginalFilename());
            String imageFileName = UUID.randomUUID().toString() + imageExt;
            imagePath = STORAGE_PATH + imageFileName;
            imageFile.transferTo(new File(imagePath));
        }

        songRepository.save(Song.builder()
                .title(title)
                .artist(artist)
                .lyrics(lyrics)
                .filePath(musicPath)
                .imagePath(imagePath)
                .uploader(uploader)
                .build());
    }

    @Transactional
    public void update(Long id, String title, String artist,
                       String lyrics, String username) {
        Song song = songRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("곡 없음: " + id));

        if (!song.getUploader().getUsername().equals(username)) {
            throw new SecurityException("수정 권한 없음");
        }

        song.update(title, artist, lyrics);
    }

    @Transactional
    public void delete(Long id, String username) {
        Song song = songRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("곡 없음: " + id));

        if (!song.getUploader().getUsername().equals(username)) {
            throw new SecurityException("삭제 권한 없음");
        }

        // 파일도 함께 삭제
        deleteFile(song.getFilePath());
        deleteFile(song.getImagePath());

        songRepository.delete(song);
    }

    public List<SongResponse> getAll(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("유저 없음"));

        return songRepository.findAllByUploaderOrderByIdDesc(user)
                .stream()
                .map(SongResponse::new)
                .collect(Collectors.toList());
    }

    public SongResponse getOne(Long id) {
        Song song = songRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("곡 없음: " + id));
        return new SongResponse(song);
    }

    private String getExt(String originalFilename) {
        if (originalFilename == null || !originalFilename.contains(".")) return "";
        return originalFilename.substring(originalFilename.lastIndexOf("."));
    }

    private void deleteFile(String path) {
        if (path == null) return;
        File file = new File(path);
        if (file.exists()) file.delete();
    }
}