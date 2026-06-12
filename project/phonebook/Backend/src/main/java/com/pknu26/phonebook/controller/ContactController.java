package com.pknu26.phonebook.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.pknu26.phonebook.dto.ContactDto;
import com.pknu26.phonebook.entity.ContactGroup;
import com.pknu26.phonebook.service.ContactService;

import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/api")
@RequiredArgsConstructor
public class ContactController {
 
    private final ContactService service;
 
    // ── 연락처 ────────────────────────────────────────
    @GetMapping("/contacts")
    public List<ContactDto> list(
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) Long groupId,
        @RequestParam(required = false) Boolean favorite
    ) {
        return service.findAll(keyword, groupId, favorite);
    }
 
    @PostMapping("/contacts")
    public ContactDto create(@RequestBody ContactDto dto) {
        return service.create(dto);
    }
 
    @PutMapping("/contacts/{id}")
    public ContactDto update(@PathVariable Long id, @RequestBody ContactDto dto) {
        return service.update(id, dto);
    }
 
    @PatchMapping("/contacts/{id}/favorite")
    public ContactDto toggleFavorite(@PathVariable Long id) {
        return service.toggleFavorite(id);
    }
 
    @DeleteMapping("/contacts/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
 
    // ── 그룹 ──────────────────────────────────────────
    @GetMapping("/groups")
    public List<ContactGroup> groups() {
        return service.findAllGroups();
    }

    @PutMapping("/groups/{id}")
    public ContactGroup updateGroup(
        @PathVariable Long id,
        @RequestBody ContactGroup body
    ) {
        return service.updateGroup(id, body);
    }
 
    @PostMapping("/groups")
    public ContactGroup createGroup(@RequestBody ContactGroup group) {
        return service.createGroup(group);
    }
 
    @DeleteMapping("/groups/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable Long id) {
        service.deleteGroup(id);
        return ResponseEntity.noContent().build();
    }
}
