package com.pknu26.game.ai;

import com.pknu26.game.ai.AiDtos.EscapeRequest;
import com.pknu26.game.ai.AiDtos.EscapeResponse;
import com.pknu26.game.ai.AiDtos.MysteryAskRequest;
import com.pknu26.game.ai.AiDtos.MysteryAskResponse;
import com.pknu26.game.ai.AiDtos.MysteryStartResponse;
import com.pknu26.game.ai.AiDtos.QuizRequest;
import com.pknu26.game.ai.AiDtos.QuizResponse;
import com.pknu26.game.ai.AiDtos.StoryRequest;
import com.pknu26.game.ai.AiDtos.StoryResponse;
import com.pknu26.game.ai.AiDtos.TwentyAskRequest;
import com.pknu26.game.ai.AiDtos.TwentyAskResponse;
import com.pknu26.game.ai.AiDtos.TwentyStartResponse;
import com.pknu26.game.ai.AiDtos.TypingRequest;
import com.pknu26.game.ai.AiDtos.TypingResponse;
import com.pknu26.game.ai.AiDtos.WordChainRequest;
import com.pknu26.game.ai.AiDtos.WordChainResponse;
import com.pknu26.game.ai.AiDtos.WordGuessRequest;
import com.pknu26.game.ai.AiDtos.WordGuessResponse;
import java.nio.charset.StandardCharsets;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

/** 로컬 LLM(Ollama) 프록시. 브라우저가 Ollama를 직접 부르지 않고 이 엔드포인트를 통한다. */
@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService service;

    public AiController(AiService service) {
        this.service = service;
    }

    @PostMapping("/story")
    public StoryResponse story(@RequestBody StoryRequest req) {
        return service.story(req.context(), req.action());
    }

    @PostMapping("/quiz")
    public QuizResponse quiz(@RequestBody QuizRequest req) {
        return service.quiz(req.topic(), req.difficulty(), req.count());
    }

    @PostMapping("/typing")
    public TypingResponse typing(@RequestBody TypingRequest req) {
        return service.typing(req.difficulty());
    }

    @PostMapping("/wordchain")
    public WordChainResponse wordChain(@RequestBody WordChainRequest req) {
        return service.wordChain(req.last(), req.used());
    }

    @PostMapping("/wordguess")
    public WordGuessResponse wordGuess(@RequestBody WordGuessRequest req) {
        return service.wordGuess(req.category());
    }

    @PostMapping("/twenty/start")
    public TwentyStartResponse twentyStart() {
        return service.twentyStart();
    }

    @PostMapping("/twenty/ask")
    public TwentyAskResponse twentyAsk(@RequestBody TwentyAskRequest req) {
        return service.twentyAsk(req.secret(), req.question());
    }

    @PostMapping("/escape")
    public EscapeResponse escape(@RequestBody EscapeRequest req) {
        return service.escape(req.context(), req.action());
    }

    @PostMapping("/mystery/start")
    public MysteryStartResponse mysteryStart() {
        return service.mysteryStart();
    }

    @PostMapping("/mystery/ask")
    public MysteryAskResponse mysteryAsk(@RequestBody MysteryAskRequest req) {
        return service.mysteryAsk(req.story(), req.culprit(), req.question());
    }

    // ---- 스트리밍(평문): 텍스트 어드벤처 / 방탈출 ----

    @PostMapping(value = "/story-stream", produces = MediaType.TEXT_PLAIN_VALUE + ";charset=UTF-8")
    public StreamingResponseBody storyStream(@RequestBody StoryRequest req) {
        return out ->
                service.streamStory(req.context(), req.action(), (token) -> writeToken(out, token));
    }

    @PostMapping(value = "/escape-stream", produces = MediaType.TEXT_PLAIN_VALUE + ";charset=UTF-8")
    public StreamingResponseBody escapeStream(@RequestBody EscapeRequest req) {
        return out ->
                service.streamEscape(req.context(), req.action(), (token) -> writeToken(out, token));
    }

    private void writeToken(java.io.OutputStream out, String token) {
        try {
            out.write(token.getBytes(StandardCharsets.UTF_8));
            out.flush();
        } catch (java.io.IOException e) {
            // 클라이언트 연결 종료 등 — 무시
        }
    }
}
