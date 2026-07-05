package com.pknu26.game.score;

import com.pknu26.game.score.ScoreDtos.ScoreRequest;
import com.pknu26.game.score.ScoreDtos.ScoreResponse;
import java.util.List;
import java.util.stream.IntStream;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/scores")
public class ScoreController {

    private static final int MAX_LIMIT = 100;

    private final ScoreRepository repository;

    public ScoreController(ScoreRepository repository) {
        this.repository = repository;
    }

    /** 점수 등록 */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ScoreResponse submit(@RequestBody ScoreRequest req) {
        if (req.gameId() == null || req.gameId().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "gameId is required");
        }
        String name = req.playerName() == null ? "" : req.playerName().trim();
        if (name.isEmpty()) {
            name = "익명";
        }
        if (name.length() > 20) {
            name = name.substring(0, 20);
        }

        Score saved = repository.save(
                Score.builder()
                        .gameId(req.gameId().trim())
                        .playerName(name)
                        .score(req.score())
                        .build());

        // 등록 결과 자체는 순위 계산 없이 반환
        return toResponse(0, saved);
    }

    /** gameId별 상위 랭킹 조회 */
    @GetMapping
    public List<ScoreResponse> top(
            @RequestParam String gameId,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "desc") String order) {

        Pageable pageable = PageRequest.of(0, Math.max(1, Math.min(limit, MAX_LIMIT)));
        List<Score> scores = "asc".equalsIgnoreCase(order)
                ? repository.findByGameIdOrderByScoreAsc(gameId, pageable)
                : repository.findByGameIdOrderByScoreDesc(gameId, pageable);

        return IntStream.range(0, scores.size())
                .mapToObj(i -> toResponse(i + 1, scores.get(i)))
                .toList();
    }

    private ScoreResponse toResponse(long rank, Score s) {
        return new ScoreResponse(
                rank, s.getId(), s.getGameId(), s.getPlayerName(), s.getScore(), s.getCreatedAt());
    }
}
