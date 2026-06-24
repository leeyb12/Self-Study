package com.pknu26.note.repository;

import com.pknu26.note.entity.Attachment;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {

    List<Attachment> findByNoteIdOrderByCreatedAtAsc(Long noteId);

    Optional<Attachment> findByIdAndUserId(Long id, Long userId);
}
