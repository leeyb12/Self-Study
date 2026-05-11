package com.pknu26.music.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageDTO {
    private String type;
    private String sender;
    private String receiver;
    private String message;
    private String time;
}
