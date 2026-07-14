package com.pknu26.game.ai;

import java.util.List;

/** 로컬 LLM 프록시의 요청/응답 DTO 모음. */
public final class AiDtos {

    private AiDtos() {}

    // ---- 텍스트 어드벤처 ----
    public record StoryRequest(String context, String action) {}

    public record StoryResponse(String narration, List<String> choices, boolean ending) {}

    // ---- 상식 퀴즈 ----
    public record QuizRequest(String topic, String difficulty, Integer count) {}

    public record QuizQuestion(String q, List<String> options, int answer) {}

    public record QuizResponse(List<QuizQuestion> questions) {}

    // ---- 타이핑 문장 ----
    public record TypingRequest(String difficulty) {}

    public record TypingResponse(String sentence) {}

    // ---- 끝말잇기 ----
    public record WordChainRequest(String last, List<String> used) {}

    public record WordChainResponse(String word) {}

    // ---- 단어 맞히기(설명 → 정답) ----
    public record WordGuessRequest(String category) {}

    public record WordGuessResponse(String word, List<String> hints) {}

    // ---- 스무고개 ----
    public record TwentyStartResponse(String secret) {}

    public record TwentyAskRequest(String secret, String question) {}

    public record TwentyAskResponse(String answer) {}

    // ---- AI 방탈출 ----
    public record EscapeRequest(String context, String action) {}

    public record EscapeResponse(String narration, List<String> choices, boolean escaped) {}

    // ---- 추리(마피아 진행자) ----
    public record MysteryStartResponse(String story, List<String> suspects, String culprit) {}

    public record MysteryAskRequest(String story, String culprit, String question) {}

    public record MysteryAskResponse(String answer) {}
}
