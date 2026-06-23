package com.pknu26.phonebook.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pknu26.phonebook.entity.ContactGroup;

public interface ContactGroupRepository extends JpaRepository<ContactGroup, Long> {

    List<ContactGroup> findByUserIdOrderByIdAsc(Long userId);

    Optional<ContactGroup> findByIdAndUserId(Long id, Long userId);
}
