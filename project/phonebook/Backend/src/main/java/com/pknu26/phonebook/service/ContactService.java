package com.pknu26.phonebook.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pknu26.phonebook.dto.ContactDto;
import com.pknu26.phonebook.entity.Contact;
import com.pknu26.phonebook.entity.ContactGroup;
import com.pknu26.phonebook.entity.User;
import com.pknu26.phonebook.exception.NotFoundException;
import com.pknu26.phonebook.repository.ContactGroupRepository;
import com.pknu26.phonebook.repository.ContactRepository;
import com.pknu26.phonebook.security.CurrentUser;


import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ContactService {

    private final ContactRepository contactRepo;
    private final ContactGroupRepository groupRepo;
    private final CurrentUser currentUser;

    // ── 조회 ──────────────────────────────────────────
    public List<ContactDto> findAll(String keyword, Long groupId, Boolean favorite) {
        Long userId = currentUser.get().getId();
        List<Contact> list;
        if (keyword != null && !keyword.isBlank())
            list = contactRepo.search(keyword, userId);
        else if (Boolean.TRUE.equals(favorite))
            list = contactRepo.findFavorites(userId);
        else if (groupId != null)
            list = contactRepo.findByGroupId(groupId, userId);
        else
            list = contactRepo.findAllSorted(userId);

        return list.stream().map(this::toDto).toList();
    }

    // ── 생성 ──────────────────────────────────────────
    @Transactional
    public ContactDto create(ContactDto dto) {
        User user = currentUser.get();
        Contact c = Contact.builder()
            .user(user)
            .name(dto.getName())
            .phone(dto.getPhone())
            .email(dto.getEmail())
            .postcode(dto.getPostcode())
            .addrRoad(dto.getAddrRoad())
            .addrJibun(dto.getAddrJibun())
            .addrDetail(dto.getAddrDetail())
            .addrExtra(dto.getAddrExtra())
            .memo(dto.getMemo())
            .favorite(dto.isFavorite())
            .group(resolveGroup(dto.getGroupId(), user))
            .build();
        return toDto(contactRepo.save(c));
    }

    // ── 수정 ──────────────────────────────────────────
    @Transactional
    public ContactDto update(Long id, ContactDto dto) {
        User user = currentUser.get();
        Contact c = contactRepo.findByIdAndUserId(id, user.getId())
            .orElseThrow(() -> new NotFoundException("연락처를 찾을 수 없습니다: " + id));
        c.setName(dto.getName());
        c.setPhone(dto.getPhone());
        c.setEmail(dto.getEmail());
        c.setPostcode(dto.getPostcode());
        c.setAddrRoad(dto.getAddrRoad());
        c.setAddrJibun(dto.getAddrJibun());
        c.setAddrDetail(dto.getAddrDetail());
        c.setAddrExtra(dto.getAddrExtra());
        c.setMemo(dto.getMemo());
        c.setFavorite(dto.isFavorite());
        c.setGroup(resolveGroup(dto.getGroupId(), user));
        return toDto(contactRepo.save(c));
    }

    @Transactional
    public ContactGroup updateGroup(Long id, ContactGroup body) {
        Long userId = currentUser.get().getId();
        ContactGroup g = groupRepo.findByIdAndUserId(id, userId)
            .orElseThrow(() -> new NotFoundException("그룹을 찾을 수 없습니다: " + id));
        g.setName(body.getName());
        g.setColor(body.getColor());
        return groupRepo.save(g);
    }

    // ── 즐겨찾기 토글 ────────────────────────────────
    @Transactional
    public ContactDto toggleFavorite(Long id) {
        Long userId = currentUser.get().getId();
        Contact c = contactRepo.findByIdAndUserId(id, userId)
            .orElseThrow(() -> new NotFoundException("연락처를 찾을 수 없습니다: " + id));
        c.setFavorite(!c.isFavorite());
        return toDto(contactRepo.save(c));
    }

    // ── 삭제 ──────────────────────────────────────────
    @Transactional
    public void delete(Long id) {
        Long userId = currentUser.get().getId();
        Contact c = contactRepo.findByIdAndUserId(id, userId)
            .orElseThrow(() -> new NotFoundException("연락처를 찾을 수 없습니다: " + id));
        contactRepo.delete(c);
    }

    // ── 그룹 CRUD ─────────────────────────────────────
    public List<ContactGroup> findAllGroups() {
        return groupRepo.findByUserIdOrderByIdAsc(currentUser.get().getId());
    }

    @Transactional
    public ContactGroup createGroup(ContactGroup group) {
        group.setUser(currentUser.get());
        return groupRepo.save(group);
    }

    @Transactional
    public void deleteGroup(Long id) {
        Long userId = currentUser.get().getId();
        ContactGroup g = groupRepo.findByIdAndUserId(id, userId)
            .orElseThrow(() -> new NotFoundException("그룹을 찾을 수 없습니다: " + id));
        groupRepo.delete(g);
    }

    // ── 내부 유틸 ─────────────────────────────────────
    private ContactGroup resolveGroup(Long groupId, User user) {
        if (groupId == null) return null;
        return groupRepo.findByIdAndUserId(groupId, user.getId()).orElse(null);
    }

    private ContactDto toDto(Contact c) {
        ContactGroup g = c.getGroup();
        return ContactDto.builder()
            .id(c.getId())
            .name(c.getName())
            .phone(c.getPhone())
            .email(c.getEmail())
            .postcode(c.getPostcode())
            .addrRoad(c.getAddrRoad())
            .addrJibun(c.getAddrJibun())
            .addrDetail(c.getAddrDetail())
            .addrExtra(c.getAddrExtra())
            .memo(c.getMemo())
            .favorite(c.isFavorite())
            .groupId(g != null ? g.getId() : null)
            .groupName(g != null ? g.getName() : null)
            .groupColor(g != null ? g.getColor() : null)
            .build();
    }
}
