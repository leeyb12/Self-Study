package com.pknu26.phonebook.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pknu26.phonebook.entity.ContactGroup;

public interface ContactGroupRepository extends JpaRepository<ContactGroup, Long> {

}
