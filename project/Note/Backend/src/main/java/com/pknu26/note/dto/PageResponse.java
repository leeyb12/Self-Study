package com.pknu26.note.dto;

import com.pknu26.note.entity.Page;

public record PageResponse(
        Long id,
        int pageNo,
        String content
) {
    public static PageResponse from(Page page) {
        return new PageResponse(page.getId(), page.getPageNo(), page.getContent());
    }
}
