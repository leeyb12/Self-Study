package com.pknu26.game.realtime;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

/** 방 코드별 오목(15x15, 5목) 상태를 메모리에 보관한다. */
@Service
public class GomokuService {

    private static final int SIZE = 15;
    private static final int[][] DIRS = {{1, 0}, {0, 1}, {1, 1}, {1, -1}};

    private final Map<String, GameState> rooms = new ConcurrentHashMap<>();

    private GameState room(String roomId) {
        return rooms.computeIfAbsent(roomId, k -> {
            GameState s = new GameState();
            s.setSize(SIZE);
            s.setBoard(new String[SIZE * SIZE]);
            return s;
        });
    }

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
        }
        return s;
    }

    public synchronized GameState move(String roomId, String playerId, int index) {
        GameState s = room(roomId);
        String[] b = s.getBoard();
        if (s.getWinner() != null || index < 0 || index >= b.length || b[index] != null) {
            return s;
        }
        String symbol = symbolOf(s, playerId);
        if (symbol == null || !symbol.equals(s.getTurn())) {
            return s;
        }
        b[index] = symbol;
        if (isWin(b, index, symbol)) {
            s.setWinner(symbol);
        } else if (isFull(b)) {
            s.setWinner("draw");
        } else {
            s.setTurn(symbol.equals("X") ? "O" : "X");
        }
        return s;
    }

    public synchronized GameState reset(String roomId) {
        GameState s = room(roomId);
        s.setBoard(new String[SIZE * SIZE]);
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

    /** 방금 둔 자리(index)에서 4방향으로 5개 연속인지 검사. */
    private boolean isWin(String[] b, int index, String symbol) {
        int r0 = index / SIZE;
        int c0 = index % SIZE;
        for (int[] d : DIRS) {
            int count = 1;
            for (int sign = -1; sign <= 1; sign += 2) {
                int r = r0 + d[0] * sign;
                int c = c0 + d[1] * sign;
                while (r >= 0 && r < SIZE && c >= 0 && c < SIZE && symbol.equals(b[r * SIZE + c])) {
                    count++;
                    r += d[0] * sign;
                    c += d[1] * sign;
                }
            }
            if (count >= 5) {
                return true;
            }
        }
        return false;
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
