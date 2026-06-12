package com.pknu26.phonebook.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor 
@Builder
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
