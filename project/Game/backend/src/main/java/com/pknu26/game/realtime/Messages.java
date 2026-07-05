package com.pknu26.game.realtime;

/** 클라이언트 → 서버 메시지 DTO 모음. */
public final class Messages {

    private Messages() {}

    /** 방 입장: 클라이언트가 생성한 고유 playerId를 전달 */
    public record JoinMessage(String playerId) {}

    /** 수 두기: playerId와 칸 인덱스(0~8) */
    public record MoveMessage(String playerId, int index) {}
}
