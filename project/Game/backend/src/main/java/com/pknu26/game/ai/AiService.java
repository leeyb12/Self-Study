package com.pknu26.game.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pknu26.game.ai.AiDtos.EscapeResponse;
import com.pknu26.game.ai.AiDtos.MysteryAskResponse;
import com.pknu26.game.ai.AiDtos.MysteryStartResponse;
import com.pknu26.game.ai.AiDtos.QuizResponse;
import com.pknu26.game.ai.AiDtos.StoryResponse;
import com.pknu26.game.ai.AiDtos.TwentyAskResponse;
import com.pknu26.game.ai.AiDtos.TwentyStartResponse;
import com.pknu26.game.ai.AiDtos.TypingResponse;
import com.pknu26.game.ai.AiDtos.WordChainResponse;
import com.pknu26.game.ai.AiDtos.WordGuessResponse;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.function.Consumer;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

/**
 * 로컬 Ollama를 호출해 게임용 텍스트를 생성한다.
 * format:json 으로 구조화된 JSON을 강제한 뒤 DTO로 파싱한다.
 */
@Service
public class AiService {

    private final RestClient client;
    private final String baseUrl;
    private final String model;
    private final ObjectMapper mapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public AiService(
            @Value("${ollama.base-url:http://localhost:11434}") String baseUrl,
            @Value("${ollama.model:gemma4:e2b}") String model) {
        this.baseUrl = baseUrl;
        this.model = model;
        SimpleClientHttpRequestFactory rf = new SimpleClientHttpRequestFactory();
        rf.setConnectTimeout(Duration.ofSeconds(5));
        rf.setReadTimeout(Duration.ofSeconds(120)); // 로컬 모델은 느릴 수 있음
        this.client = RestClient.builder().baseUrl(baseUrl).requestFactory(rf).build();
    }

    // ---- 스트리밍(평문): 서사 게임용 ----

    public void streamStory(String context, String action, Consumer<String> onToken) {
        String ctx = (context == null || context.isBlank()) ? "(없음 - 새 모험을 시작한다)" : context;
        String act = (action == null || action.isBlank()) ? "시작" : action;
        streamGenerate(narrativePrompt("한국어 텍스트 어드벤처 진행자", ctx, act, "이야기가 끝나면"), onToken);
    }

    public void streamEscape(String context, String action, Consumer<String> onToken) {
        String ctx = (context == null || context.isBlank())
                ? "(방금 잠긴 방에서 깨어났다)"
                : context;
        String act = (action == null || action.isBlank()) ? "시작" : action;
        streamGenerate(
                narrativePrompt("방탈출 게임 진행자(플레이어는 잠긴 방을 탈출해야 한다)", ctx, act, "탈출에 성공하면"),
                onToken);
    }

    private String narrativePrompt(String role, String context, String action, String endCond) {
        return """
                너는 %s(이)다.
                지금까지의 이야기와 플레이어의 행동을 받아, 다음 상황을 2~4문장으로 생생하게 묘사하라.
                묘사 뒤 마지막 줄에 아래 중 하나만 출력하라(다른 말 금지):
                - 계속되면: CHOICES: 행동1 | 행동2 | 행동3
                - %s: END
                [지금까지]
                %s
                [플레이어 행동]
                %s
                """
                .formatted(role, endCond, context, action);
    }

    /** Ollama /api/generate 를 stream=true 로 호출하고 토큰을 하나씩 onToken 으로 흘려보낸다. */
    private void streamGenerate(String prompt, Consumer<String> onToken) {
        try {
            Map<String, Object> body = new LinkedHashMap<>();
            body.put("model", model);
            body.put("prompt", prompt);
            body.put("stream", true);
            HttpRequest req = HttpRequest.newBuilder(URI.create(baseUrl + "/api/generate"))
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(120))
                    .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(body)))
                    .build();
            HttpResponse<java.util.stream.Stream<String>> resp =
                    httpClient.send(req, HttpResponse.BodyHandlers.ofLines());
            resp.body().forEach(line -> {
                if (line == null || line.isBlank()) {
                    return;
                }
                try {
                    Map<?, ?> chunk = mapper.readValue(line, Map.class);
                    Object token = chunk.get("response");
                    if (token != null) {
                        onToken.accept(String.valueOf(token));
                    }
                } catch (Exception ignore) {
                    // 파싱 불가한 라인은 건너뛴다
                }
            });
        } catch (Exception e) {
            onToken.accept("\n[오류] 로컬 LLM(Ollama)에 연결할 수 없습니다.");
        }
    }

    public StoryResponse story(String context, String action) {
        String ctx = (context == null || context.isBlank()) ? "(없음 - 새 모험을 시작한다)" : context;
        String act = (action == null || action.isBlank()) ? "시작" : action;
        String prompt =
                """
                너는 한국어 텍스트 어드벤처 게임의 진행자다.
                지금까지의 이야기와 플레이어의 행동을 받아, 다음 상황을 2~4문장으로 생생하게 묘사하고
                플레이어가 취할 수 있는 행동 2~3개를 제시하라.
                반드시 아래 JSON 형식으로만 답하라(다른 설명 금지):
                {"narration": "상황 묘사", "choices": ["행동1", "행동2"], "ending": false}
                이야기가 결말에 도달하면 ending을 true로 하고 choices는 빈 배열로 하라.
                [지금까지의 이야기]
                %s
                [플레이어 행동]
                %s
                """
                        .formatted(ctx, act);
        return parse(generate(prompt), StoryResponse.class);
    }

    public QuizResponse quiz(String topic, String difficulty, Integer count) {
        int n = (count == null || count < 1 || count > 10) ? 5 : count;
        String diff = (difficulty == null || difficulty.isBlank()) ? "보통" : difficulty;
        String subject = (topic == null || topic.isBlank()) ? "일반 상식" : topic;
        String prompt =
                """
                한국어 4지선다 상식 퀴즈 %d개를 만들어라. 난이도: %s. 주제: %s.
                반드시 아래 JSON만 출력하라(다른 설명 금지):
                {"questions":[{"q":"질문","options":["보기1","보기2","보기3","보기4"],"answer":0}]}
                answer는 정답 보기의 인덱스(0~3)다. 보기는 정확히 4개여야 한다.
                """
                        .formatted(n, diff, subject);
        return parse(generate(prompt), QuizResponse.class);
    }

    public TypingResponse typing(String difficulty) {
        String diff = (difficulty == null || difficulty.isBlank()) ? "normal" : difficulty;
        String prompt =
                """
                Generate ONE English sentence for a typing practice game. Difficulty: %s.
                Keep it 8-16 words, common vocabulary, minimal punctuation, no quotation marks.
                Output JSON only: {"sentence": "..."}
                """
                        .formatted(diff);
        return parse(generate(prompt), TypingResponse.class);
    }

    public WordChainResponse wordChain(String last, List<String> used) {
        String usedStr = (used == null || used.isEmpty()) ? "(없음)" : String.join(", ", used);
        String prompt =
                """
                끝말잇기 게임. '%s'(으)로 시작하는 한국어 표준 명사 하나를 골라라.
                규칙: 반드시 '%s'로 시작, 두 글자 이상, 고유명사 금지, 아래 사용된 단어는 제외.
                사용된 단어: %s
                적절한 단어가 없으면 word를 빈 문자열로 하라. JSON만: {"word":"단어"}
                """
                        .formatted(last, last, usedStr);
        return parse(generate(prompt), WordChainResponse.class);
    }

    public WordGuessResponse wordGuess(String category) {
        String cat = (category == null || category.isBlank()) ? "일상 사물" : category;
        String prompt =
                """
                단어 맞히기 게임. 주제 '%s'에서 한국어 명사 하나를 비밀 단어로 정하라.
                그 단어를 직접 언급하지 않는 힌트 3개를 애매한 것부터 구체적인 순서로 만들어라.
                JSON만: {"word":"비밀단어","hints":["힌트1","힌트2","힌트3"]}
                """
                        .formatted(cat);
        return parse(generate(prompt), WordGuessResponse.class);
    }

    public TwentyStartResponse twentyStart() {
        String prompt =
                """
                스무고개 게임을 시작한다. 일상적인 사물/동물/음식 중 하나를 비밀 답으로 정하라.
                너무 어렵지 않은 것으로. JSON만: {"secret":"답"}
                """;
        return parse(generate(prompt), TwentyStartResponse.class);
    }

    public TwentyAskResponse twentyAsk(String secret, String question) {
        String prompt =
                """
                스무고개 게임. 비밀 답은 '%s'. 플레이어의 질문: '%s'
                이 질문에 '예', '아니오', '애매함' 중 하나로만 답하라. 답을 누설하지 마라.
                JSON만: {"answer":"예"}
                """
                        .formatted(secret, question);
        return parse(generate(prompt), TwentyAskResponse.class);
    }

    public EscapeResponse escape(String context, String action) {
        String ctx = (context == null || context.isBlank()) ? "(방금 잠긴 방에서 깨어났다)" : context;
        String act = (action == null || action.isBlank()) ? "시작" : action;
        String prompt =
                """
                너는 방탈출 게임 진행자다. 플레이어는 잠긴 방에 갇혀 단서를 찾아 탈출해야 한다.
                플레이어의 행동에 따라 다음 상황을 2~4문장으로 묘사하고, 가능한 행동 2~3개를 제시하라.
                탈출에 성공하면 escaped를 true, choices는 빈 배열로.
                JSON만: {"narration":"묘사","choices":["행동1","행동2"],"escaped":false}
                [지금까지]
                %s
                [플레이어 행동]
                %s
                """
                        .formatted(ctx, act);
        return parse(generate(prompt), EscapeResponse.class);
    }

    public MysteryStartResponse mysteryStart() {
        String prompt =
                """
                너는 추리 게임 진행자다. 짧은 살인 또는 도난 미스터리를 설정하라.
                사건 개요 2~3문장, 용의자 이름 3명, 그리고 그중 진범 1명을 정하라.
                JSON만: {"story":"사건 개요","suspects":["이름1","이름2","이름3"],"culprit":"진범 이름"}
                """;
        return parse(generate(prompt), MysteryStartResponse.class);
    }

    public MysteryAskResponse mysteryAsk(String story, String culprit, String question) {
        String prompt =
                """
                추리 게임 진행자. 사건: %s
                진범은 '%s'(플레이어에게 절대 직접 누설 금지).
                플레이어의 조사/질문: '%s'
                진범을 바로 알려주지 말고 단서를 조금씩 주는 방식으로 1~2문장으로 답하라.
                JSON만: {"answer":"..."}
                """
                        .formatted(story, culprit, question);
        return parse(generate(prompt), MysteryAskResponse.class);
    }

    /** Ollama /api/generate 호출 → 모델이 생성한 response 문자열 반환. */
    private String generate(String prompt) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("model", model);
        body.put("prompt", prompt);
        body.put("stream", false);
        body.put("format", "json");
        try {
            Map<?, ?> res = client
                    .post()
                    .uri("/api/generate")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(Map.class);
            Object response = res == null ? null : res.get("response");
            if (response == null) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "LLM 응답이 비어 있습니다");
            }
            return String.valueOf(response);
        } catch (RestClientException e) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "로컬 LLM(Ollama)에 연결할 수 없습니다. Ollama 실행/모델(pull) 여부를 확인하세요.");
        }
    }

    private <T> T parse(String json, Class<T> type) {
        try {
            return mapper.readValue(json, type);
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY, "LLM 응답을 해석하지 못했습니다. 다시 시도해 주세요.");
        }
    }
}
