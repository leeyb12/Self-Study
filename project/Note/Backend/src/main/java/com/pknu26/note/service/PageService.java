package com.pknu26.note.service;

import com.pknu26.note.dto.PageRequest;
import com.pknu26.note.dto.PageResponse;
import com.pknu26.note.entity.Page;
import com.pknu26.note.exception.ApiException;
import com.pknu26.note.repository.NoteRepository;
import com.pknu26.note.repository.PageRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PageService {

    private final PageRepository pageRepository;
    private final NoteRepository noteRepository;

    public PageService(PageRepository pageRepository, NoteRepository noteRepository) {
        this.pageRepository = pageRepository;
        this.noteRepository = noteRepository;
    }

    @Transactional(readOnly = true)
    public List<PageResponse> list(Long userId, Long noteId) {
        requireOwnedNote(userId, noteId);
        return pageRepository.findByNoteIdOrderByPageNoAsc(noteId).stream()
                .map(PageResponse::from)
                .toList();
    }

    /** 노트 생성 시 빈 1페이지를 만든다. (소유권 검증은 호출자가 이미 수행) */
    @Transactional
    public Page createFirstPage(Long noteId) {
        return pageRepository.save(Page.builder().noteId(noteId).pageNo(1).content("").build());
    }

    /** 맨 뒤에 새 페이지를 추가한다. */
    @Transactional
    public PageResponse add(Long userId, Long noteId) {
        requireOwnedNote(userId, noteId);
        int next = pageRepository.countByNoteId(noteId) + 1;
        Page page = pageRepository.save(
                Page.builder().noteId(noteId).pageNo(next).content("").build());
        return PageResponse.from(page);
    }

    @Transactional
    public PageResponse update(Long userId, Long pageId, PageRequest request) {
        Page page = getOwnedPage(userId, pageId);
        page.updateContent(request.content());
        return PageResponse.from(page);
    }

    /** 페이지 삭제. 마지막 한 장은 삭제할 수 없고, 삭제 후 번호를 다시 매긴다. */
    @Transactional
    public void delete(Long userId, Long pageId) {
        Page page = getOwnedPage(userId, pageId);
        Long noteId = page.getNoteId();
        if (pageRepository.countByNoteId(noteId) <= 1) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "마지막 페이지는 삭제할 수 없습니다.");
        }
        pageRepository.delete(page);
        pageRepository.flush();

        List<Page> remaining = pageRepository.findByNoteIdOrderByPageNoAsc(noteId);
        for (int i = 0; i < remaining.size(); i++) {
            remaining.get(i).renumber(i + 1);
        }
    }

    /** 첫 페이지의 내용을 설정한다 (AI 가 노트를 생성할 때 사용). */
    @Transactional
    public void writeFirstPage(Long noteId, String content) {
        pageRepository.findFirstByNoteIdOrderByPageNoAsc(noteId)
                .ifPresent(page -> page.updateContent(content));
    }

    /** 카드 미리보기용: 첫 페이지 내용 일부. */
    @Transactional(readOnly = true)
    public String preview(Long noteId, int maxChars) {
        String content = pageRepository.findFirstByNoteIdOrderByPageNoAsc(noteId)
                .map(Page::getContent)
                .orElse("");
        if (content == null) {
            return "";
        }
        return content.length() > maxChars ? content.substring(0, maxChars) : content;
    }

    @Transactional(readOnly = true)
    public int countPages(Long noteId) {
        return pageRepository.countByNoteId(noteId);
    }

    /** 요약용: 모든 페이지 내용을 페이지 구분과 함께 이어붙인다. */
    @Transactional(readOnly = true)
    public String collectContent(Long noteId) {
        StringBuilder sb = new StringBuilder();
        for (Page page : pageRepository.findByNoteIdOrderByPageNoAsc(noteId)) {
            if (page.getContent() != null && !page.getContent().isBlank()) {
                sb.append("\n\n[").append(page.getPageNo()).append("페이지]\n")
                        .append(page.getContent());
            }
        }
        return sb.toString();
    }

    private Page getOwnedPage(Long userId, Long pageId) {
        Page page = pageRepository.findById(pageId)
                .orElseThrow(() -> ApiException.notFound("페이지를 찾을 수 없습니다."));
        requireOwnedNote(userId, page.getNoteId());
        return page;
    }

    private void requireOwnedNote(Long userId, Long noteId) {
        if (noteRepository.findByIdAndUserIdAndDeletedAtIsNull(noteId, userId).isEmpty()) {
            throw ApiException.notFound("노트를 찾을 수 없습니다.");
        }
    }
}
