package com.pknu26.game.realtime;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

/** 방 코드별 실시간 퀴즈 상태/규칙. 두 명이 같은 문제를 풀고 점수를 겨룬다. */
@Service
public class QuizService {

    private record Q(String q, String[] options, int answer) {}

    private static final List<Q> QUESTIONS = List.of(
            new Q("대한민국의 수도는?", new String[] {"부산", "서울", "인천", "대구"}, 1),
            new Q("물의 화학식은?", new String[] {"CO2", "O2", "H2O", "NaCl"}, 2),
            new Q("태양계에서 가장 큰 행성은?", new String[] {"지구", "토성", "목성", "화성"}, 2),
            new Q("빛의 삼원색이 아닌 것은?", new String[] {"빨강", "초록", "파랑", "노랑"}, 3),
            new Q("이진수 1011은 십진수로?", new String[] {"9", "11", "13", "15"}, 1));

    private final Map<String, QuizState> rooms = new ConcurrentHashMap<>();

    private QuizState room(String roomId) {
        return rooms.computeIfAbsent(roomId, k -> {
            QuizState s = new QuizState();
            s.setTotal(QUESTIONS.size());
            return s;
        });
    }

    public synchronized QuizState join(String roomId, String playerId) {
        QuizState s = room(roomId);
        if (playerId == null || playerId.isBlank()) {
            return s;
        }
        boolean already = playerId.equals(s.getPlayerX()) || playerId.equals(s.getPlayerO());
        if (!already) {
            if (s.getPlayerX() == null) {
                s.setPlayerX(playerId);
            } else if (s.getPlayerO() == null) {
                s.setPlayerO(playerId);
            }
        }
        // 두 명이 모두 모였고 아직 시작 전이면 첫 문제 출제
        if ("waiting".equals(s.getPhase()) && s.getPlayerX() != null && s.getPlayerO() != null) {
            startQuestion(s, 0);
        }
        return s;
    }

    public synchronized QuizState answer(String roomId, String playerId, int index) {
        QuizState s = room(roomId);
        if (!"question".equals(s.getPhase())) {
            return s;
        }
        String symbol = symbolOf(s, playerId);
        if (symbol == null) {
            return s;
        }
        int correct = QUESTIONS.get(s.getQIndex()).answer();
        if ("X".equals(symbol) && !s.isAnsweredX()) {
            s.setAnsweredX(true);
            s.setPickX(index);
            if (index == correct) {
                s.setScoreX(s.getScoreX() + 1);
            }
        } else if ("O".equals(symbol) && !s.isAnsweredO()) {
            s.setAnsweredO(true);
            s.setPickO(index);
            if (index == correct) {
                s.setScoreO(s.getScoreO() + 1);
            }
        }
        if (s.isAnsweredX() && s.isAnsweredO()) {
            s.setPhase("reveal");
            s.setAnswer(correct);
        }
        return s;
    }

    public synchronized QuizState next(String roomId) {
        QuizState s = room(roomId);
        if (!"reveal".equals(s.getPhase())) {
            return s;
        }
        int nextIdx = s.getQIndex() + 1;
        if (nextIdx >= QUESTIONS.size()) {
            s.setPhase("finished");
            s.setWinner(
                    s.getScoreX() > s.getScoreO()
                            ? "X"
                            : s.getScoreX() < s.getScoreO() ? "O" : "draw");
        } else {
            startQuestion(s, nextIdx);
        }
        return s;
    }

    public synchronized QuizState reset(String roomId) {
        QuizState s = room(roomId);
        s.setScoreX(0);
        s.setScoreO(0);
        s.setWinner(null);
        if (s.getPlayerX() != null && s.getPlayerO() != null) {
            startQuestion(s, 0);
        } else {
            s.setPhase("waiting");
        }
        return s;
    }

    private void startQuestion(QuizState s, int idx) {
        Q q = QUESTIONS.get(idx);
        s.setQIndex(idx);
        s.setQuestion(q.q());
        s.setOptions(q.options());
        s.setAnswer(-1);
        s.setAnsweredX(false);
        s.setAnsweredO(false);
        s.setPickX(-1);
        s.setPickO(-1);
        s.setPhase("question");
    }

    private String symbolOf(QuizState s, String playerId) {
        if (playerId == null) {
            return null;
        }
        if (playerId.equals(s.getPlayerX())) {
            return "X";
        }
        if (playerId.equals(s.getPlayerO())) {
            return "O";
        }
        return null;
    }
}
