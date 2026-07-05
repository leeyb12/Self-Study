package com.pknu26.game.score;

import java.time.Instant;

/** 점수 관련 요청/응답 DTO 모음. */
public final class ScoreDtos {

    private ScoreDtos() {}

    /** 점수 등록 요청 본문 */
    public record ScoreRequest(String gameId, String playerName, long score) {}

    /** 점수 응답 (순위 포함) */
    public record ScoreResponse(
            long rank,
            Long id,
            String gameId,
            String playerName,
            long score,
            Instant createdAt) {}
}
