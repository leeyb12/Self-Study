package com.pknu26.talent.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TalentService {
    private Long id;
    private String title;
    private String description;
    private Long price;
    private String imageUrl;
    private LocalDateTime createdAt;
}
