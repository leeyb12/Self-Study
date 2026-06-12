package com.pknu26.music.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pknu26.music.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findAllByBoardIdOrderByCreatedAtAsc(Long boardId);
}
