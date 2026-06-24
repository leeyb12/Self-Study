package com.pknu26.note.service;

import com.pknu26.note.dto.SummaryResponse;
import com.pknu26.note.entity.Note;
import com.pknu26.note.exception.ApiException;
import com.pknu26.note.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SummaryService {

    private final NoteRepository noteRepository;
    private final AttachmentService attachmentService;
    private final OllamaClient ollamaClient;
    private final int maxInputChars;

    public SummaryService(NoteRepository noteRepository, AttachmentService attachmentService,
                          OllamaClient ollamaClient,
                          @Value("${ollama.max-input-chars}") int maxInputChars) {
        this.noteRepository = noteRepository;
        this.attachmentService = attachmentService;
        this.ollamaClient = ollamaClient;
        this.maxInputChars = maxInputChars;
    }

    @Transactional(readOnly = true)
    public SummaryResponse summarize(Long userId, Long noteId) {
        Note note = noteRepository.findByIdAndUserId(noteId, userId)
                .orElseThrow(() -> ApiException.notFound("노트를 찾을 수 없습니다."));

        StringBuilder source = new StringBuilder();
        source.append("# 제목: ").append(note.getTitle()).append("\n\n");
        if (note.getContent() != null && !note.getContent().isBlank()) {
            source.append("## 본문\n").append(note.getContent());
        }
        source.append(attachmentService.collectExtractedText(noteId));

        String material = source.toString().strip();
        if (material.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "요약할 내용이 없습니다. 본문을 작성하거나 파일을 첨부하세요.");
        }
        if (material.length() > maxInputChars) {
            material = material.substring(0, maxInputChars);
        }

        String prompt = buildPrompt(material);
        String summary = ollamaClient.generate(prompt);
        if (summary.isBlank()) {
            throw new ApiException(HttpStatus.BAD_GATEWAY, "요약 결과가 비어 있습니다.");
        }
        return new SummaryResponse(summary, ollamaClient.getModel());
    }

    private String buildPrompt(String material) {
        return """
                다음 노트와 첨부 자료의 내용을 한국어로 간결하게 요약해 주세요.
                - 핵심 내용을 3~6개의 불릿 포인트로 정리하세요.
                - 마지막에 한 문장으로 전체 요지를 정리하세요.
                - 자료에 없는 내용은 추측하지 마세요.

                ===== 자료 시작 =====
                %s
                ===== 자료 끝 =====
                """.formatted(material);
    }
}
