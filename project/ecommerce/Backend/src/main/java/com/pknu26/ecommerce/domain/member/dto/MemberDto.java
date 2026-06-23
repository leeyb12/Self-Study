package com.pknu26.ecommerce.domain.member.dto;

import java.time.LocalDateTime;

import com.pknu26.ecommerce.domain.member.entity.Member;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;

public class MemberDto {
 
    // 회원가입 요청
    @Getter
    public static class SignupRequest {
        @Email(message = "이메일 형식이 올바르지 않습니다.")
        @NotBlank(message = "이메일은 필수입니다.")
        private String email;
 
        @NotBlank(message = "비밀번호는 필수입니다.")
        @Size(min = 8, max = 20, message = "비밀번호는 8~20자여야 합니다.")
        @Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[!@#$%]).+$",
                 message = "비밀번호는 영문, 숫자, 특수문자(!@#$%)를 포함해야 합니다.")
        private String password;
 
        @NotBlank(message = "이름은 필수입니다.")
        @Size(max = 50)
        private String name;
 
        private String phone;
        private String address;
    }
 
    // 로그인 요청
    @Getter
    public static class LoginRequest {
        @NotBlank
        private String email;
        @NotBlank
        private String password;
    }
 
    // 로그인 응답 (토큰)
    @Getter
    @Builder
    public static class LoginResponse {
        private String accessToken;
        private String refreshToken;
        private Long memberId;
        private String name;
        private String role;
    }
 
    // 회원 정보 응답
    @Getter
    @Builder
    public static class MemberResponse {
        private Long memberId;
        private String email;
        private String name;
        private String phone;
        private String address;
        private String status;
        private LocalDateTime createdAt;
 
        public static MemberResponse from(Member member) {
            return MemberResponse.builder()
                .memberId(member.getId())
                .email(member.getEmail())
                .name(member.getName())
                .phone(member.getPhone())
                .address(member.getAddress())
                .status(member.getStatus().name())
                .createdAt(member.getCreatedAt())
                .build();
        }
    }
 
    // 프로필 수정 요청
    @Getter
    public static class UpdateRequest {
        @NotBlank(message = "이름은 필수입니다.")
        private String name;
        private String phone;
        private String address;
    }
}
