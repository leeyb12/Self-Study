package com.pknu26.telephonebook.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ContactDto {
    private Long    id;
    private String  name;
    private String  phone;
    private String  email;

    // 주소
    private String  postcode;
    private String  addrRoad;
    private String  addrJibun;
    private String  addrDetail;
    private String  addrExtra;

    // 그룹
    private Long    groupId;
    private String  groupName;
    private String  groupColor;

    private boolean favorite;
    private String  memo;
}