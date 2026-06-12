package com.pknu26.music.repository;

import com.pknu26.music.entity.BoardFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoardFileRepository extends JpaRepository<BoardFile, Long> {
    List<BoardFile> findAllByBoardId(Long boardId);
}