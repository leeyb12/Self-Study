package com.pknu26.ecommerce.domain.analytics.repository;

import com.pknu26.ecommerce.domain.analytics.entity.RfmScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RfmScoreRepository extends JpaRepository<RfmScore, Long> {

    Optional<RfmScore> findByMemberId(Long memberId);

    List<RfmScore> findBySegmentOrderByMonetaryDesc(String segment);

    @Query("SELECT r.segment, COUNT(r) FROM RfmScore r GROUP BY r.segment ORDER BY COUNT(r) DESC")
    List<Object[]> findSegmentDistribution();

    @Query("SELECT r FROM RfmScore r JOIN FETCH r.member ORDER BY r.monetary DESC")
    List<RfmScore> findAllWithMember();
}