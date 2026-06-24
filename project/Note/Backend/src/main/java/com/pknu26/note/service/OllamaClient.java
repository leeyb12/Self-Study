package com.pknu26.note.service;

import com.pknu26.note.dto.ChatMessage;
import com.pknu26.note.exception.ApiException;
import java.time.Duration;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

/** 로컬 Ollama 서버(/api/generate)를 호출하는 클라이언트. */
@Component
public class OllamaClient {

    private record GenerateRequest(String model, String prompt, boolean stream) {
    }

    private record GenerateResponse(String response) {
    }

    private record ChatPayload(String model, List<ChatMessage> messages, boolean stream) {
    }

    private record ChatReplyMessage(String role, String content) {
    }

    private record ChatPayloadResponse(ChatReplyMessage message) {
    }

    private final RestClient client;
    private final String model;

    public OllamaClient(@Value("${ollama.base-url}") String baseUrl,
                        @Value("${ollama.model}") String model,
                        @Value("${ollama.timeout-seconds}") long timeoutSeconds) {
        this.model = model;

        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(5));
        factory.setReadTimeout(Duration.ofSeconds(timeoutSeconds));

        this.client = RestClient.builder()
                .baseUrl(baseUrl)
                .requestFactory(factory)
                .build();
    }

    public String getModel() {
        return model;
    }

    /** 프롬프트를 전달하고 생성된 텍스트를 반환한다. */
    public String generate(String prompt) {
        try {
            GenerateResponse response = client.post()
                    .uri("/api/generate")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(new GenerateRequest(model, prompt, false))
                    .retrieve()
                    .body(GenerateResponse.class);

            return response != null && response.response() != null
                    ? response.response().trim()
                    : "";
        } catch (ResourceAccessException e) {
            throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Ollama 서버에 연결할 수 없습니다. (ollama serve 실행 여부를 확인하세요)");
        } catch (RestClientResponseException e) {
            throw new ApiException(HttpStatus.BAD_GATEWAY,
                    "Ollama 오류 (" + e.getStatusCode().value() + "): 모델 '" + model + "' 사용 가능 여부를 확인하세요.");
        }
    }

    /** 대화 메시지 목록을 전달하고 어시스턴트 응답 텍스트를 반환한다. */
    public String chat(List<ChatMessage> messages) {
        try {
            ChatPayloadResponse response = client.post()
                    .uri("/api/chat")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(new ChatPayload(model, messages, false))
                    .retrieve()
                    .body(ChatPayloadResponse.class);

            return response != null && response.message() != null
                    && response.message().content() != null
                    ? response.message().content().trim()
                    : "";
        } catch (ResourceAccessException e) {
            throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Ollama 서버에 연결할 수 없습니다. (ollama serve 실행 여부를 확인하세요)");
        } catch (RestClientResponseException e) {
            throw new ApiException(HttpStatus.BAD_GATEWAY,
                    "Ollama 오류 (" + e.getStatusCode().value() + "): 모델 '" + model + "' 사용 가능 여부를 확인하세요.");
        }
    }
}
