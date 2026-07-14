package com.pknu26.note.repository;

import com.pknu26.note.entity.Page;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PageRepository extends JpaRepository<Page, Long> {

    List<Page> findByNoteIdOrderByPageNoAsc(Long noteId);

    Optional<Page> findFirstByNoteIdOrderByPageNoAsc(Long noteId);

    int countByNoteId(Long noteId);
}
