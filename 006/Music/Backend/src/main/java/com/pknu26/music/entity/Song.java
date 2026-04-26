package com.pknu26.music.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "song")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Song {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "song_gen")
    @SequenceGenerator(name = "song_gen", sequenceName = "song_seq", allocationSize = 1)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String artist;

    @Column(nullable = false)
    private String filePath;

    private String imagePath;

    @Lob
    private String lyrics;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User uploader;

    // 수정 메서드
    public void update(String title, String artist, String lyrics) {
        this.title  = title;
        this.artist = artist;
        this.lyrics = lyrics;
    }
}