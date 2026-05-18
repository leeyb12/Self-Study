package com.pknu26.telephonebook.service;

import com.pknu26.telephonebook.dto.ContactDto;
import com.pknu26.telephonebook.entity.Contact;
import com.pknu26.telephonebook.entity.ContactGroup;
import com.pknu26.telephonebook.repository.ContactGroupRepository;
import com.pknu26.telephonebook.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ContactService {

    private final ContactRepository contactRepo;
    private final ContactGroupRepository groupRepo;

    public List<ContactDto> findAll(String keyword, Long groupId, Boolean favorite) {
        List<Contact> list;
        if (keyword != null && !keyword.isBlank())
            list = contactRepo.search(keyword);
        else if (Boolean.TRUE.equals(favorite))
            list = contactRepo.findFavorites();
        else if (groupId != null)
            list = contactRepo.findByGroupId(groupId);
        else
            list = contactRepo.findAllSorted();

        return list.stream().map(this::toDto).toList();
    }

    @Transactional
    public ContactDto create(ContactDto dto) {
        Contact c = Contact.builder()
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
            .group(resolveGroup(dto.getGroupId()))
            .build();
        return toDto(contactRepo.save(c));
    }

    @Transactional
    public ContactDto update(Long id, ContactDto dto) {
        Contact c = contactRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Not found: " + id));
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
        c.setGroup(resolveGroup(dto.getGroupId()));
        return toDto(contactRepo.save(c));
    }

    @Transactional
    public ContactDto toggleFavorite(Long id) {
        Contact c = contactRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Not found: " + id));
        c.setFavorite(!c.isFavorite());
        return toDto(contactRepo.save(c));
    }

    @Transactional
    public void delete(Long id) { contactRepo.deleteById(id); }

    public List<ContactGroup> findAllGroups() { return groupRepo.findAll(); }

    @Transactional
    public ContactGroup createGroup(ContactGroup group) { return groupRepo.save(group); }

    @Transactional
    public void deleteGroup(Long id) { groupRepo.deleteById(id); }

    private ContactGroup resolveGroup(Long groupId) {
        if (groupId == null) return null;
        return groupRepo.findById(groupId).orElse(null);
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