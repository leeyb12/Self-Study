package com.pknu26.game.realtime;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

/** 방 코드별 틱택토 상태를 메모리에 보관하고 규칙을 적용한다. */
@Service
public class TicTacToeService {

    private static final int[][] LINES = {
        {0, 1, 2}, {3, 4, 5}, {6, 7, 8},
        {0, 3, 6}, {1, 4, 7}, {2, 5, 8},
        {0, 4, 8}, {2, 4, 6},
    };

    private final Map<String, GameState> rooms = new ConcurrentHashMap<>();

    private GameState room(String roomId) {
        return rooms.computeIfAbsent(roomId, k -> new GameState());
    }

    /** 방 입장. 빈 자리에 X, O 순으로 배정(이미 배정됐으면 유지). */
    public synchronized GameState join(String roomId, String playerId) {
        GameState s = room(roomId);
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
            // 두 자리가 다 찼으면 관전자로 둔다(배정 없음)
        }
        return s;
    }

    /** 수 두기. 본인 차례이고 빈 칸이며 아직 승부가 안 났을 때만 반영. */
    public synchronized GameState move(String roomId, String playerId, int index) {
        GameState s = room(roomId);
        if (s.getWinner() != null || index < 0 || index >= 9 || s.getBoard()[index] != null) {
            return s;
        }
        String symbol = symbolOf(s, playerId);
        if (symbol == null || !symbol.equals(s.getTurn())) {
            return s; // 관전자이거나 자기 차례가 아님
        }
        s.getBoard()[index] = symbol;
        String winner = winner(s.getBoard());
        if (winner != null) {
            s.setWinner(winner);
        } else if (isFull(s.getBoard())) {
            s.setWinner("draw");
        } else {
            s.setTurn(symbol.equals("X") ? "O" : "X");
        }
        return s;
    }

    /** 판 초기화(플레이어 자리는 유지). */
    public synchronized GameState reset(String roomId) {
        GameState s = room(roomId);
        s.setBoard(new String[9]);
        s.setTurn("X");
        s.setWinner(null);
        return s;
    }

    private String symbolOf(GameState s, String playerId) {
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

    private String winner(String[] b) {
        for (int[] line : LINES) {
            String a = b[line[0]];
            if (a != null && a.equals(b[line[1]]) && a.equals(b[line[2]])) {
                return a;
            }
        }
        return null;
    }

    private boolean isFull(String[] b) {
        for (String cell : b) {
            if (cell == null) {
                return false;
            }
        }
        return true;
    }
}
