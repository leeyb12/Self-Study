package com.pknu26.music.dto;

import java.time.LocalDateTime;

import com.pknu26.music.entity.Board;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardDTO {

    private Long          id;
    private String        title;
    private String        content;
    private String        author;
    private LocalDateTime createdAt;

    public static BoardDTO from(Board board) {
        return BoardDTO.builder()
                .id(board.getId())
                .title(board.getTitle())
                .content(board.getContent())
                .author(board.getAuthor().getUsername())
                .createdAt(board.getCreatedAt())
                .build();
    }
}
