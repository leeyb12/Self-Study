package com.pknu26.music.dto;

import com.pknu26.music.entity.Comment;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentDTO {

    private Long          id;
    private String        content;
    private String        author;
    private LocalDateTime createdAt;

    public static CommentDTO from(Comment comment) {
        return CommentDTO.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .author(comment.getAuthor() != null
                        ? comment.getAuthor().getUsername() : "알 수 없음")
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
