package com.pknu26.music.security;

import lombok.RequiredArgsConstructor;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

/**
 * 웹소켓 핸드셰이크 단계에서 ?token=... 쿼리 파라미터의 JWT 를 검증하고,
 * 유효하면 username 을 세션 속성에 심는다. 토큰이 없거나 유효하지 않으면 연결을 거부한다.
 * 이후 메시지의 sender 는 클라이언트 값이 아닌 이 username 을 신뢰한다.
 */
@Component
@RequiredArgsConstructor
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request,
                                   ServerHttpResponse response,
                                   WebSocketHandler wsHandler,
                                   Map<String, Object> attributes) {
        if (!(request instanceof ServletServerHttpRequest servletRequest)) {
            return false;
        }

        String token = servletRequest.getServletRequest().getParameter("token");
        if (token == null || !jwtTokenProvider.validateToken(token)) {
            return false;
        }

        attributes.put("username", jwtTokenProvider.getUsername(token));
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request,
                               ServerHttpResponse response,
                               WebSocketHandler wsHandler,
                               Exception exception) {
        // no-op
    }
}
