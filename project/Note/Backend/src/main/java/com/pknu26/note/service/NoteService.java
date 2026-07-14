package com.pknu26.note.service;

import com.pknu26.note.dto.NoteRequest;
import com.pknu26.note.dto.NoteResponse;
import com.pknu26.note.entity.Note;
import com.pknu26.note.exception.ApiException;
import com.pknu26.note.repository.FolderRepository;
import com.pknu26.note.repository.NoteRepository;
import java.util.List;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NoteService {

    private static final Set<String> COVERS = Set.of(
            "classic", "navy", "forest", "crimson", "craft", "mint",
            "charcoal", "plum", "ocean", "rose", "amber", "lavender");
    private static final Set<String> PAPERS = Set.of("plain", "lined", "grid", "dotted");
    private static final String DEFAULT_COVER = "classic";
    private static final String DEFAULT_PAPER = "plain";
    private static final int PREVIEW_CHARS = 140;

    private final NoteRepository noteRepository;
    private final FolderRepository folderRepository;
    private final AttachmentService attachmentService;
    private final PageService pageService;

    public NoteService(NoteRepository noteRepository, FolderRepository folderRepository,
                       AttachmentService attachmentService, PageService pageService) {
        this.noteRepository = noteRepository;
        this.folderRepository = folderRepository;
        this.attachmentService = attachmentService;
        this.pageService = pageService;
    }

    /**
     * 활성 노트(휴지통 제외) 목록.
     * @param folderId null 이면 전체, 0 이면 미분류, 그 외에는 해당 폴더의 노트
     */
    @Transactional(readOnly = true)
    public List<NoteResponse> findAll(Long userId, Long folderId) {
        List<Note> notes;
        if (folderId == null) {
            notes = noteRepository.findByUserIdAndDeletedAtIsNullOrderByUpdatedAtDesc(userId);
        } else if (folderId == 0L) {
            notes = noteRepository.findByUserIdAndFolderIdIsNullAndDeletedAtIsNullOrderByUpdatedAtDesc(userId);
        } else {
            notes = noteRepository.findByUserIdAndFolderIdAndDeletedAtIsNullOrderByUpdatedAtDesc(userId, folderId);
        }
        return notes.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public NoteResponse findOne(Long userId, Long noteId) {
        return toResponse(getActiveNote(userId, noteId));
    }

    /** 노트를 만들고 빈 1페이지를 함께 생성한다. */
    @Transactional
    public NoteResponse create(Long userId, NoteRequest request) {
        validateFolder(userId, request.folderId());
        Note note = noteRepository.save(Note.builder()
                .userId(userId)
                .folderId(request.folderId())
                .title(request.title())
                .cover(normalize(request.cover(), COVERS, DEFAULT_COVER))
                .paper(normalize(request.paper(), PAPERS, DEFAULT_PAPER))
                .build());
        pageService.createFirstPage(note.getId());
        return toResponse(note);
    }

    @Transactional
    public NoteResponse update(Long userId, Long noteId, NoteRequest request) {
        validateFolder(userId, request.folderId());
        Note note = getActiveNote(userId, noteId);
        note.update(
                request.folderId(),
                request.title(),
                normalize(request.cover(), COVERS, note.getCover()),
                normalize(request.paper(), PAPERS, note.getPaper()));
        return toResponse(note);
    }

    /** 휴지통으로 이동(소프트 삭제). */
    @Transactional
    public void delete(Long userId, Long noteId) {
        Note note = getActiveNote(userId, noteId);
        note.moveToTrash();
    }

    // ===================== 휴지통 =====================

    @Transactional(readOnly = true)
    public List<NoteResponse> findTrash(Long userId) {
        return noteRepository.findByUserIdAndDeletedAtIsNotNullOrderByDeletedAtDesc(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public NoteResponse restore(Long userId, Long noteId) {
        Note note = getOwnedNote(userId, noteId);
        note.restore();
        return toResponse(note);
    }

    /** 완전 삭제: 첨부 파일까지 디스크에서 제거 후 행 삭제(첨부/페이지 행은 FK CASCADE). */
    @Transactional
    public void deletePermanent(Long userId, Long noteId) {
        Note note = getOwnedNote(userId, noteId);
        attachmentService.deleteFilesForNote(noteId);
        noteRepository.delete(note);
    }

    /** 휴지통 비우기: 휴지통의 모든 노트를 완전 삭제. */
    @Transactional
    public void emptyTrash(Long userId) {
        List<Note> trashed = noteRepository.findByUserIdAndDeletedAtIsNotNullOrderByDeletedAtDesc(userId);
        for (Note note : trashed) {
            attachmentService.deleteFilesForNote(note.getId());
        }
        noteRepository.deleteAll(trashed);
    }

    private NoteResponse toResponse(Note note) {
        return NoteResponse.of(
                note,
                pageService.countPages(note.getId()),
                pageService.preview(note.getId(), PREVIEW_CHARS));
    }

    /** 허용된 프리셋이 아니면 기본값으로 되돌린다. */
    private String normalize(String value, Set<String> allowed, String fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }
        if (!allowed.contains(value)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "지원하지 않는 스타일입니다: " + value);
        }
        return value;
    }

    private Note getActiveNote(Long userId, Long noteId) {
        return noteRepository.findByIdAndUserIdAndDeletedAtIsNull(noteId, userId)
                .orElseThrow(() -> ApiException.notFound("노트를 찾을 수 없습니다."));
    }

    private Note getOwnedNote(Long userId, Long noteId) {
        return noteRepository.findByIdAndUserId(noteId, userId)
                .orElseThrow(() -> ApiException.notFound("노트를 찾을 수 없습니다."));
    }

    /** 폴더를 지정했다면 그 폴더가 본인 소유인지 확인한다. */
    private void validateFolder(Long userId, Long folderId) {
        if (folderId != null && !folderRepository.existsByIdAndUserId(folderId, userId)) {
            throw ApiException.notFound("폴더를 찾을 수 없습니다.");
        }
    }
}
