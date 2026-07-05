package com.pknu26.game.realtime;

import lombok.Getter;
import lombok.Setter;

/** 방 하나의 틱택토 상태. 브로드캐스트되어 프론트에서 그대로 렌더된다. */
@Getter
@Setter
public class GameState {

    private String[] board = new String[9]; // 각 칸 "X"/"O"/null
    private int size = 3; // 보드 한 변 길이 (틱택토 3, 오목 15)
    private String turn = "X"; // 현재 차례
    private String playerX; // X 플레이어의 playerId (없으면 null)
    private String playerO; // O 플레이어의 playerId
    private String winner; // "X"/"O"/"draw"/null
}
