package com.pknu26.note.service;

import com.pknu26.note.dto.FolderRequest;
import com.pknu26.note.dto.FolderResponse;
import com.pknu26.note.entity.Folder;
import com.pknu26.note.exception.ApiException;
import com.pknu26.note.repository.FolderRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FolderService {

    private final FolderRepository folderRepository;

    public FolderService(FolderRepository folderRepository) {
        this.folderRepository = folderRepository;
    }

    @Transactional(readOnly = true)
    public List<FolderResponse> findAll(Long userId) {
        return folderRepository.findByUserIdOrderByNameAsc(userId).stream()
                .map(FolderResponse::from)
                .toList();
    }

    @Transactional
    public FolderResponse create(Long userId, FolderRequest request) {
        Folder folder = folderRepository.save(Folder.builder()
                .userId(userId)
                .name(request.name())
                .build());
        return FolderResponse.from(folder);
    }

    @Transactional
    public FolderResponse rename(Long userId, Long folderId, FolderRequest request) {
        Folder folder = getOwnedFolder(userId, folderId);
        folder.rename(request.name());
        return FolderResponse.from(folder);
    }

    @Transactional
    public void delete(Long userId, Long folderId) {
        Folder folder = getOwnedFolder(userId, folderId);
        // 노트의 folder_id 는 DB의 ON DELETE SET NULL 로 자동 미분류 처리된다.
        folderRepository.delete(folder);
    }

    private Folder getOwnedFolder(Long userId, Long folderId) {
        return folderRepository.findByIdAndUserId(folderId, userId)
                .orElseThrow(() -> ApiException.notFound("폴더를 찾을 수 없습니다."));
    }
}
