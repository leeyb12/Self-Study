package com.pknu26.music.repository;

import com.pknu26.music.entity.Song;
import com.pknu26.music.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SongRepository extends JpaRepository<Song, Long> {
    List<Song> findAllByOrderByIdDesc();
    List<Song> findAllByUploaderOrderByIdDesc(User uploader); // ← 추가
}