package com.pknu26.game.realtime;

import lombok.Getter;
import lombok.Setter;

/** 방 하나의 실시간 퀴즈 상태. 브로드캐스트되어 프론트에서 렌더된다. */
@Getter
@Setter
public class QuizState {

    private String phase = "waiting"; // waiting | question | reveal | finished
    private int qIndex = 0;
    private int total;
    private String question; // 현재 문제(question/reveal 단계에서만)
    private String[] options;
    private int answer = -1; // reveal 단계에서만 정답 인덱스 노출

    private String playerX;
    private String playerO;
    private int scoreX;
    private int scoreO;
    private boolean answeredX;
    private boolean answeredO;
    private int pickX = -1; // 각자 고른 보기(reveal 표시용)
    private int pickO = -1;

    private String winner; // finished 단계: "X"/"O"/"draw"
}
