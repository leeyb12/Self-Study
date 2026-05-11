package com.pknu26.talent.model;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class Application {
    private Long id;
    private Long serviceId;
    private String applicantName;
    private String status;
    private LocalDateTime appliedAt;
}
