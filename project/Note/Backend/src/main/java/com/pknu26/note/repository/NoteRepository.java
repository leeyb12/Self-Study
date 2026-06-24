package com.pknu26.note.repository;

import com.pknu26.note.entity.Note;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoteRepository extends JpaRepository<Note, Long> {

    // ----- 활성 노트(휴지통 제외) -----
    List<Note> findByUserIdAndDeletedAtIsNullOrderByUpdatedAtDesc(Long userId);

    List<Note> findByUserIdAndFolderIdAndDeletedAtIsNullOrderByUpdatedAtDesc(Long userId, Long folderId);

    List<Note> findByUserIdAndFolderIdIsNullAndDeletedAtIsNullOrderByUpdatedAtDesc(Long userId);

    // 활성 노트 단건 (조회/수정/소프트삭제 대상)
    Optional<Note> findByIdAndUserIdAndDeletedAtIsNull(Long id, Long userId);

    // ----- 휴지통 -----
    List<Note> findByUserIdAndDeletedAtIsNotNullOrderByDeletedAtDesc(Long userId);

    // 상태와 무관하게 소유 노트 단건 (복원/완전삭제 대상)
    Optional<Note> findByIdAndUserId(Long id, Long userId);
}
