package com.pknu26.ecommerce.domain.member.entity;

import com.pknu26.ecommerce.util.BaseEntity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "members")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(exclude = "password")
public class Member extends BaseEntity {
 
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long id;
 
    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;
 
    @Column(name = "password", nullable = false, length = 255)
    private String password;
 
    @Column(name = "name", nullable = false, length = 50)
    private String name;
 
    @Column(name = "phone", length = 20)
    private String phone;
 
    @Column(name = "address", length = 300)
    private String address;
 
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 10)
    private MemberStatus status = MemberStatus.ACTIVE;
 
    @Enumerated(EnumType.STRING)
    @Column(name = "role", length = 10)
    private MemberRole role = MemberRole.USER;
 
    @Builder
    public Member(String email, String password, String name,
                  String phone, String address) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.phone = phone;
        this.address = address;
    }
 
    // 비즈니스 메서드
    public void updateProfile(String name, String phone, String address) {
        this.name = name;
        this.phone = phone;
        this.address = address;
    }
 
    public void changePassword(String encodedPassword) {
        this.password = encodedPassword;
    }
 
    public void deactivate() {
        this.status = MemberStatus.INACTIVE;
    }
 
    public enum MemberStatus { ACTIVE, INACTIVE, BANNED }
    public enum MemberRole { USER, ADMIN }
}
