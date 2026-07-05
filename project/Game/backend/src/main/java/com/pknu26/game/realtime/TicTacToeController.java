package com.pknu26.game.realtime;

import com.pknu26.game.realtime.Messages.JoinMessage;
import com.pknu26.game.realtime.Messages.MoveMessage;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

/**
 * 방 코드 기반 틱택토 STOMP 컨트롤러.
 * 클라이언트는 /topic/room/{roomId} 를 구독하고,
 * /app/room/{roomId}/{join|move|reset} 로 메시지를 보낸다.
 */
@Controller
public class TicTacToeController {

    private final TicTacToeService service;
    private final SimpMessagingTemplate template;

    public TicTacToeController(TicTacToeService service, SimpMessagingTemplate template) {
        this.service = service;
        this.template = template;
    }

    @MessageMapping("/room/{roomId}/join")
    public void join(@DestinationVariable String roomId, JoinMessage msg) {
        broadcast(roomId, service.join(roomId, msg.playerId()));
    }

    @MessageMapping("/room/{roomId}/move")
    public void move(@DestinationVariable String roomId, MoveMessage msg) {
        broadcast(roomId, service.move(roomId, msg.playerId(), msg.index()));
    }

    @MessageMapping("/room/{roomId}/reset")
    public void reset(@DestinationVariable String roomId) {
        broadcast(roomId, service.reset(roomId));
    }

    private void broadcast(String roomId, GameState state) {
        template.convertAndSend("/topic/room/" + roomId, state);
    }
}
