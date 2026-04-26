package com.pknu26.music.dto;

import com.pknu26.music.entity.Song;
import lombok.Getter;

@Getter
public class SongResponse {

    private Long   id;
    private String title;
    private String artist;
    private String fileUrl;
    private String imageUrl;
    private String lyrics;

    public SongResponse(Song song) {
        this.id      = song.getId();
        this.title   = song.getTitle();
        this.artist  = song.getArtist();
        this.lyrics  = song.getLyrics();
        this.fileUrl = toUrl(song.getFilePath());

        // imagePath가 null이면 imageUrl도 null로
        this.imageUrl = song.getImagePath() != null ? toUrl(song.getImagePath()) : null;
    }

    private String toUrl(String path) {
        if (path == null || path.isBlank()) return null;

        String normalized = path.replace("\\", "/");
        String fileName   = normalized.substring(normalized.lastIndexOf("/") + 1);

        return "/music/" + fileName;
    }
}