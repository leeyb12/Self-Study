package com.pknu26.phonebook.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pknu26.phonebook.entity.User;

public interface UserRepository extends JpaRepository<User, Long>{
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
}
