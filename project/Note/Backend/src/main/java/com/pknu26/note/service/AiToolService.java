package com.pknu26.note.service;

import com.pknu26.note.dto.AiToolRequest;
import com.pknu26.note.dto.AiToolResponse;
import com.pknu26.note.dto.ChatMessage;
import com.pknu26.note.dto.ChatRequest;
import com.pknu26.note.dto.ChatResponse;
import com.pknu26.note.exception.ApiException;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

/** 노트 텍스트에 대해 로컬 LLM(Ollama)으로 번역/교정/이어쓰기를 수행한다. */
@Service
public class AiToolService {

    private final OllamaClient ollamaClient;
    private final int maxInputChars;

    public AiToolService(OllamaClient ollamaClient,
                         @Value("${ollama.max-input-chars}") int maxInputChars) {
        this.ollamaClient = ollamaClient;
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

    /** 자유 질문 채팅. 대화 맥락(messages)을 그대로 LLM 에 전달한다. */
    public ChatResponse chat(ChatRequest request) {
        List<ChatMessage> messages = new ArrayList<>();
        messages.add(new ChatMessage("system",
                "당신은 노트 앱에 내장된 친절한 한국어 도우미입니다. 질문에 간결하고 명확하게 답하세요."));
        messages.addAll(request.messages());

        String reply = ollamaClient.chat(messages);
        if (reply.isBlank()) {
            throw new ApiException(HttpStatus.BAD_GATEWAY, "응답이 비어 있습니다.");
        }
        return new ChatResponse(reply, ollamaClient.getModel());
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
