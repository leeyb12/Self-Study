package com.pknu26.music.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "board_file")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardFile {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "board_file_gen")
    @SequenceGenerator(name = "board_file_gen", sequenceName = "board_file_seq", allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id")
    private Board board;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String filePath;

    @Column(nullable = false)
    private String fileType;
}
