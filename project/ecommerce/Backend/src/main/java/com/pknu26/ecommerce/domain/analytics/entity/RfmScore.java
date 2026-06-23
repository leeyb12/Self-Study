package com.pknu26.ecommerce.domain.analytics.entity;

import com.pknu26.ecommerce.domain.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "rfm_scores")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RfmScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rfm_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false, unique = true)
    private Member member;

    @Column(name = "recency_days")
    private Integer recencyDays;

    @Column(name = "frequency")
    private Integer frequency;

    @Column(name = "monetary")
    private Long monetary;

    @Column(name = "r_score")
    private Integer rScore;

    @Column(name = "f_score")
    private Integer fScore;

    @Column(name = "m_score")
    private Integer mScore;

    // "455", "321" 형태의 3자리 복합 점수
    @Column(name = "rfm_score", length = 3)
    private String rfmScore;

    @Column(name = "segment", length = 30)
    private String segment;

    @Column(name = "calculated_at")
    private LocalDateTime calculatedAt;

    @Builder
    public RfmScore(Member member, Integer recencyDays, Integer frequency, Long monetary,
                    Integer rScore, Integer fScore, Integer mScore) {
        this.member = member;
        this.recencyDays = recencyDays;
        this.frequency = frequency;
        this.monetary = monetary;
        this.rScore = rScore;
        this.fScore = fScore;
        this.mScore = mScore;
        this.rfmScore = "" + rScore + fScore + mScore;
        this.segment = classifySegment(rScore, fScore, mScore);
        this.calculatedAt = LocalDateTime.now();
    }

    public void update(Integer recencyDays, Integer frequency, Long monetary,
                       Integer rScore, Integer fScore, Integer mScore) {
        this.recencyDays = recencyDays;
        this.frequency = frequency;
        this.monetary = monetary;
        this.rScore = rScore;
        this.fScore = fScore;
        this.mScore = mScore;
        this.rfmScore = "" + rScore + fScore + mScore;
        this.segment = classifySegment(rScore, fScore, mScore);
        this.calculatedAt = LocalDateTime.now();
    }

    private static String classifySegment(int r, int f, int m) {
        if (r >= 4 && f >= 4 && m >= 4) return "Champions";
        if (f >= 4 && m >= 4)           return "Loyal Customers";
        if (r >= 3 && f >= 3)           return "Potential Loyalists";
        if (r >= 4 && f <= 2)           return "New Customers";
        if (r <= 2 && f >= 3)           return "At Risk";
        if (r <= 2 && f <= 2)           return "Lost Customers";
        return "Others";
    }
}