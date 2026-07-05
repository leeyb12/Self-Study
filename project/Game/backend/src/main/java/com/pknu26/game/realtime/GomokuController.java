package com.pknu26.game.realtime;

import com.pknu26.game.realtime.Messages.JoinMessage;
import com.pknu26.game.realtime.Messages.MoveMessage;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

/**
 * 방 코드 기반 오목 STOMP 컨트롤러.
 * 구독 /topic/omok/{roomId}, 전송 /app/omok/{roomId}/{join|move|reset}.
 */
@Controller
public class GomokuController {

    private final GomokuService service;
    private final SimpMessagingTemplate template;

    public GomokuController(GomokuService service, SimpMessagingTemplate template) {
        this.service = service;
        this.template = template;
    }

    @MessageMapping("/omok/{roomId}/join")
    public void join(@DestinationVariable String roomId, JoinMessage msg) {
        broadcast(roomId, service.join(roomId, msg.playerId()));
    }

    @MessageMapping("/omok/{roomId}/move")
    public void move(@DestinationVariable String roomId, MoveMessage msg) {
        broadcast(roomId, service.move(roomId, msg.playerId(), msg.index()));
    }

    @MessageMapping("/omok/{roomId}/reset")
    public void reset(@DestinationVariable String roomId) {
        broadcast(roomId, service.reset(roomId));
    }

    private void broadcast(String roomId, GameState state) {
        template.convertAndSend("/topic/omok/" + roomId, state);
    }
}
