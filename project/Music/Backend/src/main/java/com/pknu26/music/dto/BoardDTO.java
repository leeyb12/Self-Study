package com.pknu26.music.dto;

import com.pknu26.music.entity.Board;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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
    private List<FileDTO> files;
    private int           commentCount;

    @Getter
    @AllArgsConstructor
    public static class FileDTO {
        private Long   id;
        private String fileName;
        private String fileUrl;
        private String fileType;
    }

    public static BoardDTO from(Board board) {
        List<FileDTO> files = board.getFiles().stream()
                .map(f -> new FileDTO(
                        f.getId(),
                        f.getFileName(),
                        "/board-files/" + extractFileName(f.getFilePath()),
                        f.getFileType()
                ))
                .collect(Collectors.toList());

        return BoardDTO.builder()
                .id(board.getId())
                .title(board.getTitle())
                .content(board.getContent())
                .author(board.getAuthor() != null
                        ? board.getAuthor().getUsername() : "알 수 없음")
                .createdAt(board.getCreatedAt())
                .files(files)
                .commentCount(board.getComments().size())
                .build();
    }

    private static String extractFileName(String path) {
        if (path == null) return "";
        return path.replace("\\", "/")
                   .substring(path.replace("\\", "/").lastIndexOf("/") + 1);
    }
}