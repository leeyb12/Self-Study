package com.pknu26.ecommerce.domain.member.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.pknu26.ecommerce.domain.member.dto.MemberDto;
import com.pknu26.ecommerce.domain.member.service.MemberService;
import com.pknu26.ecommerce.response.ApiResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/members")
@RequiredArgsConstructor
@Tag(name = "회원 API")
public class MemberController {
 
    private final MemberService memberService;
 
    @PostMapping("/signup")
    @Operation(summary = "회원가입")
    public ResponseEntity<ApiResponse<MemberDto.MemberResponse>> signup(
            @Valid @RequestBody MemberDto.SignupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.created(memberService.signup(request)));
    }
 
    @PostMapping("/login")
    @Operation(summary = "로그인")
    public ResponseEntity<ApiResponse<MemberDto.LoginResponse>> login(
            @Valid @RequestBody MemberDto.LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(memberService.login(request)));
    }
 
    @GetMapping("/me")
    @Operation(summary = "내 정보 조회", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<MemberDto.MemberResponse>> getMyInfo(
            @AuthenticationPrincipal Long memberId) {
        return ResponseEntity.ok(ApiResponse.ok(memberService.getMyInfo(memberId)));
    }
 
    @PutMapping("/me")
    @Operation(summary = "프로필 수정", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<MemberDto.MemberResponse>> updateProfile(
            @AuthenticationPrincipal Long memberId,
            @Valid @RequestBody MemberDto.UpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(memberService.updateProfile(memberId, request)));
    }
 
    @DeleteMapping("/me")
    @Operation(summary = "회원 탈퇴", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> withdraw(
            @AuthenticationPrincipal Long memberId) {
        memberService.withdraw(memberId);
        return ResponseEntity.ok(ApiResponse.noContent());
    }
}
