package com.pknu26.ecommerce.domain.member.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pknu26.ecommerce.domain.member.entity.Member;

import java.time.LocalDateTime;

public interface MemberRepository extends JpaRepository<Member, Long> {
 
    Optional<Member> findByEmail(String email);
 
    boolean existsByEmail(String email);
 
    // 활성 회원만 조회
    @Query("SELECT m FROM Member m WHERE m.id = :id AND m.status = 'ACTIVE'")
    Optional<Member> findActiveById(@Param("id") Long id);

    // 일별 집계용: 기간 내 신규 가입 수
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}
