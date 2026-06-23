package com.pknu26.music.handler;

import com.pknu26.music.dto.ChatMessageDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
public class ChatHandler extends TextWebSocketHandler {

    // username → session 매핑
    private final Map<String, WebSocketSession> userSessions =
            new ConcurrentHashMap<>();

    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        log.info("WebSocket 연결: {}", session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session,
                                     TextMessage message) throws Exception {
        ChatMessageDTO dto = objectMapper.readValue(
                message.getPayload(), ChatMessageDTO.class);

        // 신원은 핸드셰이크에서 검증된 세션 username 만 신뢰한다 (클라이언트 sender 무시)
        String username = (String) session.getAttributes().get("username");
        if (username == null) {
            session.close();
            return;
        }
        dto.setSender(username);

        dto.setTime(LocalTime.now()
                .format(DateTimeFormatter.ofPattern("HH:mm")));

        // 접속 등록
        if ("CONNECT".equals(dto.getType())) {
            userSessions.put(username, session);
            log.info("유저 등록: {} (현재 {}명)", username, userSessions.size());
            broadcastUserList();
            return;
        }

        String json = objectMapper.writeValueAsString(dto);

        if ("PRIVATE".equals(dto.getType())) {
            // 1:1 — 수신자 + 발신자에게만
            sendToUser(dto.getReceiver(), json);
            sendToUser(dto.getSender(),   json);
        } else {
            // PUBLIC — 전체 브로드캐스트
            broadcast(json);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session,
                                      CloseStatus status) throws Exception {
        String removedUser = null;
        for (Map.Entry<String, WebSocketSession> e : userSessions.entrySet()) {
            if (e.getValue().getId().equals(session.getId())) {
                removedUser = e.getKey();
                break;
            }
        }
        if (removedUser != null) {
            userSessions.remove(removedUser);
            log.info("유저 퇴장: {} (현재 {}명)", removedUser, userSessions.size());
            broadcastUserList();
        }
    }

    private void sendToUser(String username, String json) throws Exception {
        WebSocketSession target = userSessions.get(username);
        if (target != null && target.isOpen()) {
            synchronized (target) {
                target.sendMessage(new TextMessage(json));
            }
        }
    }

    private void broadcast(String json) throws Exception {
        for (WebSocketSession s : userSessions.values()) {
            if (s.isOpen()) {
                synchronized (s) {
                    s.sendMessage(new TextMessage(json));
                }
            }
        }
    }

    private void broadcastUserList() throws Exception {
        String userList = String.join(",", userSessions.keySet());
        ChatMessageDTO dto = ChatMessageDTO.builder()
                .type("USER_LIST")
                .message(userList)
                .time(LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm")))
                .build();
        broadcast(objectMapper.writeValueAsString(dto));
    }
}