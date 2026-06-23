package com.pknu26.ecommerce.domain.member.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pknu26.ecommerce.domain.member.dto.MemberDto;
import com.pknu26.ecommerce.domain.member.entity.Member;
import com.pknu26.ecommerce.domain.member.repository.MemberRepository;
import com.pknu26.ecommerce.exception.BusinessException;
import com.pknu26.ecommerce.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {
 
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
 
    // 회원가입
    @Transactional
    public MemberDto.MemberResponse signup(MemberDto.SignupRequest request) {
        if (memberRepository.existsByEmail(request.getEmail())) {
            throw BusinessException.conflict("이미 사용 중인 이메일입니다.");
        }
 
        Member member = Member.builder()
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .name(request.getName())
            .phone(request.getPhone())
            .address(request.getAddress())
            .build();
 
        return MemberDto.MemberResponse.from(memberRepository.save(member));
    }
 
    // 로그인
    public MemberDto.LoginResponse login(MemberDto.LoginRequest request) {
        Member member = memberRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> BusinessException.unauthorized("이메일 또는 비밀번호가 올바르지 않습니다."));
 
        if (!passwordEncoder.matches(request.getPassword(), member.getPassword())) {
            throw BusinessException.unauthorized("이메일 또는 비밀번호가 올바르지 않습니다.");
        }
 
        if (member.getStatus() != Member.MemberStatus.ACTIVE) {
            throw BusinessException.forbidden("비활성화된 계정입니다.");
        }
 
        String accessToken = jwtTokenProvider.generateAccessToken(
            member.getId(), member.getEmail(), member.getRole().name());
        String refreshToken = jwtTokenProvider.generateRefreshToken(member.getId());
 
        return MemberDto.LoginResponse.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .memberId(member.getId())
            .name(member.getName())
            .role(member.getRole().name())
            .build();
    }
 
    // 내 정보 조회
    public MemberDto.MemberResponse getMyInfo(Long memberId) {
        Member member = memberRepository.findActiveById(memberId)
            .orElseThrow(() -> BusinessException.notFound("회원"));
        return MemberDto.MemberResponse.from(member);
    }
 
    // 프로필 수정
    @Transactional
    public MemberDto.MemberResponse updateProfile(Long memberId, MemberDto.UpdateRequest request) {
        Member member = memberRepository.findActiveById(memberId)
            .orElseThrow(() -> BusinessException.notFound("회원"));
        member.updateProfile(request.getName(), request.getPhone(), request.getAddress());
        return MemberDto.MemberResponse.from(member);
    }
 
    // 회원 탈퇴
    @Transactional
    public void withdraw(Long memberId) {
        Member member = memberRepository.findActiveById(memberId)
            .orElseThrow(() -> BusinessException.notFound("회원"));
        member.deactivate();
    }
}
