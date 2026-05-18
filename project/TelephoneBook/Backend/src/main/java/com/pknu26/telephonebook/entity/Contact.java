package com.pknu26.telephonebook.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "CONTACTS")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Contact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(length = 100)
    private String email;

    // 주소
    @Column(length = 10)
    private String postcode;

    @Column(name = "ADDR_ROAD", length = 200)
    private String addrRoad;

    @Column(name = "ADDR_JIBUN", length = 200)
    private String addrJibun;

    @Column(name = "ADDR_DETAIL", length = 100)
    private String addrDetail;

    @Column(name = "ADDR_EXTRA", length = 100)
    private String addrExtra;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "GROUP_ID")
    private ContactGroup group;

    @Column(name = "IS_FAVORITE")
    private boolean favorite;

    @Column(length = 500)
    private String memo;

    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }
}