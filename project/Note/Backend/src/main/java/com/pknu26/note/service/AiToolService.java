package com.pknu26.note.service;

import com.pknu26.note.dto.AiToolRequest;
import com.pknu26.note.dto.AiToolResponse;
import com.pknu26.note.dto.ChatMessage;
import com.pknu26.note.dto.ChatRequest;
import com.pknu26.note.dto.ChatResponse;
import com.pknu26.note.dto.FolderRequest;
import com.pknu26.note.dto.FolderResponse;
import com.pknu26.note.dto.NoteRequest;
import com.pknu26.note.dto.NoteResponse;
import com.pknu26.note.exception.ApiException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/** 노트 텍스트에 대해 로컬 LLM(Ollama)으로 번역/교정/이어쓰기를 수행하고, 채팅에서 작업을 실행한다. */
@Service
public class AiToolService {

    private final OllamaClient ollamaClient;
    private final NoteService noteService;
    private final FolderService folderService;
    private final PageService pageService;
    private final ObjectMapper objectMapper;
    private final int maxInputChars;

    public AiToolService(OllamaClient ollamaClient, NoteService noteService,
                         FolderService folderService, PageService pageService,
                         ObjectMapper objectMapper,
                         @Value("${ollama.max-input-chars}") int maxInputChars) {
        this.ollamaClient = ollamaClient;
        this.noteService = noteService;
        this.folderService = folderService;
        this.pageService = pageService;
        this.objectMapper = objectMapper;
        this.maxInputChars = maxInputChars;
    }

    public AiToolResponse run(AiToolRequest request) {
        String text = request.text() == null ? "" : request.text().strip();
        if (text.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "처리할 텍스트가 없습니다.");
        }
        if (text.length() > maxInputChars) {
            text = text.substring(0, maxInputChars);
        }

        String prompt = switch (request.action()) {
            case "translate" -> translatePrompt(text, request.targetLang());
            case "polish" -> polishPrompt(text);
            case "continue" -> continuePrompt(text);
            default -> throw new ApiException(HttpStatus.BAD_REQUEST,
                    "알 수 없는 동작입니다: " + request.action());
        };

        String result = ollamaClient.generate(prompt);
        if (result.isBlank()) {
            throw new ApiException(HttpStatus.BAD_GATEWAY, "결과가 비어 있습니다.");
        }
        return new AiToolResponse(result, ollamaClient.getModel());
    }

    private static final String SYSTEM_PROMPT = """
            당신은 노트 앱에 내장된 친절한 한국어 도우미입니다.

            사용자가 노트나 폴더를 "만들어 줘/작성해 줘/저장해 줘"라고 요청하면,
            설명이나 코드블록 없이 아래 JSON 객체 '하나만' 출력하세요.

            노트 생성: {"action":"create_note","title":"제목","content":"본문(마크다운 가능)"}
            폴더 생성: {"action":"create_folder","name":"폴더 이름"}

            노트 생성 시 사용자가 내용을 지정하지 않았다면 요청에 어울리는 내용을 직접 작성해 채우세요.
            그 외의 모든 질문에는 JSON 없이 평범한 한국어 텍스트로 간결하게 답하세요.
            """;

    /** 자유 질문 채팅 + 작업 실행(노트/폴더 생성). */
    public ChatResponse chat(Long userId, ChatRequest request) {
        List<ChatMessage> messages = new ArrayList<>();
        messages.add(new ChatMessage("system", SYSTEM_PROMPT));
        messages.addAll(request.messages());

        String reply = ollamaClient.chat(messages);
        if (reply.isBlank()) {
            throw new ApiException(HttpStatus.BAD_GATEWAY, "응답이 비어 있습니다.");
        }

        return extractAction(reply)
                .map(node -> execute(userId, node, reply))
                .orElseGet(() -> ChatResponse.text(reply, ollamaClient.getModel()));
    }

    /** 모델 응답에서 action JSON 을 관대하게 추출한다(코드블록/앞뒤 설명 허용). */
    private Optional<JsonNode> extractAction(String reply) {
        int start = reply.indexOf('{');
        int end = reply.lastIndexOf('}');
        if (start < 0 || end <= start) {
            return Optional.empty();
        }
        try {
            JsonNode node = objectMapper.readTree(reply.substring(start, end + 1));
            return node.hasNonNull("action") ? Optional.of(node) : Optional.empty();
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    private ChatResponse execute(Long userId, JsonNode node, String rawReply) {
        String model = ollamaClient.getModel();
        String action = node.get("action").asString();

        switch (action) {
            case "create_note" -> {
                String title = text(node, "title", "제목 없음");
                String content = text(node, "content", "");
                NoteResponse note = noteService.create(userId, new NoteRequest(title, null, null, null));
                pageService.writeFirstPage(note.id(), content);
                return ChatResponse.performed(
                        "✅ '" + title + "' 노트를 생성했어요.", model, action, note.id());
            }
            case "create_folder" -> {
                String name = text(node, "name", "새 폴더");
                FolderResponse folder = folderService.create(userId, new FolderRequest(name));
                return ChatResponse.performed(
                        "✅ '" + name + "' 폴더를 만들었어요.", model, action, folder.id());
            }
            // 모델이 알 수 없는 action 을 지어냈다면 그냥 일반 답변으로 취급한다.
            default -> {
                return ChatResponse.text(rawReply, model);
            }
        }
    }

    private String text(JsonNode node, String field, String fallback) {
        String value = node.hasNonNull(field) ? node.get(field).asString() : "";
        return value.isBlank() ? fallback : value;
    }

    private String translatePrompt(String text, String targetLang) {
        String lang = (targetLang == null || targetLang.isBlank()) ? "English" : targetLang.strip();
        return """
                다음 텍스트를 %s(으)로 번역해 주세요.
                - 번역 결과만 출력하고, 설명이나 따옴표는 붙이지 마세요.
                - 원문의 줄바꿈과 마크다운 서식은 최대한 유지하세요.

                === 원문 ===
                %s
                """.formatted(lang, text);
    }

    private String polishPrompt(String text) {
        return """
                다음 텍스트의 맞춤법과 문법 오류를 교정하고 자연스럽고 매끄럽게 다듬어 주세요.
                - 원래 의미와 언어(한국어면 한국어)를 유지하세요.
                - 다듬어진 전체 텍스트만 출력하고, 설명은 붙이지 마세요.
                - 마크다운 서식은 유지하세요.

                === 원문 ===
                %s
                """.formatted(text);
    }

    private String continuePrompt(String text) {
        return """
                다음 글에 자연스럽게 이어지는 내용을 작성해 주세요.
                - 원문과 같은 언어와 문체를 유지하세요.
                - 원문은 다시 출력하지 말고, 이어지는 부분만 출력하세요.

                === 지금까지의 글 ===
                %s
                """.formatted(text);
    }
}
