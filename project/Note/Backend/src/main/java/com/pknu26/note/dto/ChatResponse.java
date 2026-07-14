package com.pknu26.note.dto;

public record ChatResponse(
        String reply,
        String model,
        // 실제로 수행한 작업 (없으면 null): "create_note" | "create_folder"
        String action,
        // 생성된 노트/폴더의 id (작업을 수행한 경우)
        Long createdId
) {
    public static ChatResponse text(String reply, String model) {
        return new ChatResponse(reply, model, null, null);
    }

    public static ChatResponse performed(String reply, String model, String action, Long createdId) {
        return new ChatResponse(reply, model, action, createdId);
    }
}
