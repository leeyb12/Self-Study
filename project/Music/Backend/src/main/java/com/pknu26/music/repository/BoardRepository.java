package com.pknu26.music.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pknu26.music.entity.Board;

public interface BoardRepository extends JpaRepository<Board, Long> {
    List<Board> findAllByOrderByCreatedAtDesc();
}
