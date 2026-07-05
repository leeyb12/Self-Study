package com.pknu26.game.score;

import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScoreRepository extends JpaRepository<Score, Long> {

    // 높은 점수 우선 (대부분의 게임)
    List<Score> findByGameIdOrderByScoreDesc(String gameId, Pageable pageable);

    // 낮은 점수 우선 (반응속도처럼 작을수록 좋은 게임)
    List<Score> findByGameIdOrderByScoreAsc(String gameId, Pageable pageable);
}
