package com.pknu26.music.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.pknu26.music.dto.BoardDTO;
import com.pknu26.music.entity.Board;
import com.pknu26.music.entity.User;
import com.pknu26.music.repository.BoardRepository;
import com.pknu26.music.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository boardRepository;
    private final UserRepository  userRepository;

    public List<BoardDTO> getAll() {
        return boardRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(BoardDTO::from)
                .collect(Collectors.toList());
    }

    public BoardDTO getOne(Long id) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글 없음: " + id));
        return BoardDTO.from(board);
    }

    public BoardDTO create(BoardDTO dto, String username) {
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("유저 없음"));

        Board saved = boardRepository.save(Board.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .author(author)
                .build());

        return BoardDTO.from(saved);
    }

    public void delete(Long id, String username) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글 없음: " + id));

        if (!board.getAuthor().getUsername().equals(username)) {
            throw new SecurityException("삭제 권한 없음");
        }
        boardRepository.delete(board);
    }
}