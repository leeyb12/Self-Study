package com.pknu26.note.dto;

import com.pknu26.note.entity.Folder;

public record FolderResponse(
        Long id,
        String name
) {
    public static FolderResponse from(Folder folder) {
        return new FolderResponse(folder.getId(), folder.getName());
    }
}
