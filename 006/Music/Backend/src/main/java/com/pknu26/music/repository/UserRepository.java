package com.pknu26.music.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pknu26.music.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
