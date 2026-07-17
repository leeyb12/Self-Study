package com.pknu26.music.service;

import com.pknu26.music.dto.BoardDTO;
import com.pknu26.music.dto.CommentDTO;
import com.pknu26.music.entity.*;
import com.pknu26.music.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
public class BoardService {

    private final BoardRepository     boardRepository;
    private final BoardFileRepository boardFileRepository;
    private final CommentRepository   commentRepository;
    private final UserRepository      userRepository;

    private static final String STORAGE_PATH = "C:/music_storage/board/";

    public List<BoardDTO> getAll() {
        return boardRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(BoardDTO::from)
                .collect(Collectors.toList());
    }

    public BoardDTO.PageResponse getPage(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<BoardDTO> boardPage = boardRepository.findAll(pageable)
                .map(BoardDTO::from);

        return BoardDTO.PageResponse.builder()
                .content(boardPage.getContent())
                .page(boardPage.getNumber())
                .totalPages(boardPage.getTotalPages())
                .totalElements(boardPage.getTotalElements())
                .hasNext(boardPage.hasNext())
                .hasPrev(boardPage.hasPrevious())
                .build();
    }

    public BoardDTO getOne(Long id) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글 없음: " + id));
        return BoardDTO.from(board);
    }

    @Transactional
    public BoardDTO create(String title, String content,
                           List<MultipartFile> files,
                           String username) throws IOException {
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("유저 없음"));

        Board board = boardRepository.save(Board.builder()
                .title(title)
                .content(content)
                .author(author)
                .build());

        if (files != null) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) saveFile(board, file);
            }
        }

        return BoardDTO.from(board);
    }

    @Transactional
    public BoardDTO update(Long id, String title, String content,
                           List<MultipartFile> files,
                           String username) throws IOException {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글 없음: " + id));

        if (!board.getAuthor().getUsername().equals(username)) {
            throw new SecurityException("수정 권한 없음");
        }

        board.update(title, content);

        if (files != null) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) saveFile(board, file);
            }
        }

        return BoardDTO.from(board);
    }

    @Transactional
    public void delete(Long id, String username) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글 없음: " + id));

        if (!board.getAuthor().getUsername().equals(username)) {
            throw new SecurityException("삭제 권한 없음");
        }

        board.getFiles().forEach(f -> deleteFile(f.getFilePath()));
        boardRepository.delete(board);
    }

    @Transactional
    public void deleteFile(Long fileId, String username) {
        BoardFile file = boardFileRepository.findById(fileId)
                .orElseThrow(() -> new IllegalArgumentException("파일 없음"));

        if (!file.getBoard().getAuthor().getUsername().equals(username)) {
            throw new SecurityException("삭제 권한 없음");
        }

        deleteFile(file.getFilePath());
        boardFileRepository.delete(file);
    }

    public List<CommentDTO> getComments(Long boardId) {
        return commentRepository.findAllByBoardIdOrderByCreatedAtAsc(boardId)
                .stream()
                .map(CommentDTO::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentDTO addComment(Long boardId, String content, String username) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("게시글 없음"));
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("유저 없음"));

        Comment comment = commentRepository.save(Comment.builder()
                .board(board)
                .content(content)
                .author(author)
                .build());

        return CommentDTO.from(comment);
    }

    @Transactional
    public void deleteComment(Long commentId, String username) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글 없음"));

        if (!comment.getAuthor().getUsername().equals(username)) {
            throw new SecurityException("삭제 권한 없음");
        }

        commentRepository.delete(comment);
    }

    private void saveFile(Board board, MultipartFile file) throws IOException {
        new File(STORAGE_PATH).mkdirs();

        String ext      = getExt(file.getOriginalFilename());
        String fileName = UUID.randomUUID().toString() + ext;
        String path     = STORAGE_PATH + fileName;
        file.transferTo(new File(path));

        String type = file.getContentType() != null
                && file.getContentType().startsWith("audio") ? "audio" : "image";

        boardFileRepository.save(BoardFile.builder()
                .board(board)
                .fileName(file.getOriginalFilename())
                .filePath(path)
                .fileType(type)
                .build());
    }

    private String getExt(String name) {
        if (name == null || !name.contains(".")) return "";
        return name.substring(name.lastIndexOf("."));
    }

    private void deleteFile(String path) {
        if (path == null) return;
        File f = new File(path);
        if (f.exists()) f.delete();
    }
}
