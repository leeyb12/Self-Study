package com.pknu26.game.realtime;

import com.pknu26.game.realtime.Messages.JoinMessage;
import com.pknu26.game.realtime.Messages.MoveMessage;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

/**
 * 방 코드 기반 실시간 퀴즈 STOMP 컨트롤러.
 * 구독 /topic/quiz/{roomId}, 전송 /app/quiz/{roomId}/{join|answer|next|reset}.
 * answer 는 MoveMessage(playerId, index)의 index를 보기 번호로 사용.
 */
@Controller
public class QuizController {

    private final QuizService service;
    private final SimpMessagingTemplate template;

    public QuizController(QuizService service, SimpMessagingTemplate template) {
        this.service = service;
        this.template = template;
    }

    @MessageMapping("/quiz/{roomId}/join")
    public void join(@DestinationVariable String roomId, JoinMessage msg) {
        broadcast(roomId, service.join(roomId, msg.playerId()));
    }

    @MessageMapping("/quiz/{roomId}/answer")
    public void answer(@DestinationVariable String roomId, MoveMessage msg) {
        broadcast(roomId, service.answer(roomId, msg.playerId(), msg.index()));
    }

    @MessageMapping("/quiz/{roomId}/next")
    public void next(@DestinationVariable String roomId) {
        broadcast(roomId, service.next(roomId));
    }

    @MessageMapping("/quiz/{roomId}/reset")
    public void reset(@DestinationVariable String roomId) {
        broadcast(roomId, service.reset(roomId));
    }

    private void broadcast(String roomId, QuizState state) {
        template.convertAndSend("/topic/quiz/" + roomId, state);
    }
}
