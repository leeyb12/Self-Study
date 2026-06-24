package com.pknu26.note.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "notes")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 단순화를 위해 연관관계 매핑 대신 외래키 컬럼을 직접 사용한다.
    @Column(name = "user_id", nullable = false)
    private Long userId;

    // NULL 이면 미분류 노트.
    @Column(name = "folder_id")
    private Long folderId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // NULL 이면 활성, 값이 있으면 휴지통에 있는 노트.
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Builder
    private Note(Long userId, Long folderId, String title, String content) {
        this.userId = userId;
        this.folderId = folderId;
        this.title = title;
        this.content = content;
    }

    public void update(Long folderId, String title, String content) {
        this.folderId = folderId;
        this.title = title;
        this.content = content;
    }

    public void moveToTrash() {
        this.deletedAt = LocalDateTime.now();
    }

    public void restore() {
        this.deletedAt = null;
    }
}
