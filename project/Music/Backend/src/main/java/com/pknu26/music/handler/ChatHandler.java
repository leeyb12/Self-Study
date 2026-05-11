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

        dto.setTime(LocalTime.now().format(
                DateTimeFormatter.ofPattern("HH:mm")));

        if ("CONNECT".equals(dto.getType())) {
            userSessions.put(dto.getSender(), session);
            broadcastUserList();
            return;
        }

        String json = objectMapper.writeValueAsString(dto);

        if ("PRIVATE".equals(dto.getType())) {
            sendToUser(dto.getReceiver(), json);
            sendToUser(dto.getSender(),   json);
        } else {
            broadcast(json);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session,
                                      CloseStatus status) throws Exception {
        userSessions.entrySet()
                .removeIf(e -> e.getValue().getId().equals(session.getId()));
        broadcastUserList();
        log.info("WebSocket 종료: {}", session.getId());
    }

    private void sendToUser(String username, String json) throws Exception {
        WebSocketSession target = userSessions.get(username);
        if (target != null && target.isOpen()) {
            target.sendMessage(new TextMessage(json));
        }
    }

    private void broadcast(String json) throws Exception {
        for (WebSocketSession s : userSessions.values()) {
            if (s.isOpen()) s.sendMessage(new TextMessage(json));
        }
    }

    private void broadcastUserList() throws Exception {
        ChatMessageDTO dto = ChatMessageDTO.builder()
                .type("USER_LIST")
                .message(String.join(",", userSessions.keySet()))
                .time(LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm")))
                .build();
        broadcast(objectMapper.writeValueAsString(dto));
    }
}