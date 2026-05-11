package com.pknu26.talent.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.pknu26.talent.mapper.UserMapper;
import com.pknu26.talent.model.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public void register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("ROLE_USER");
        userMapper.insertUser(user);
    }

    public User findByUsername(String username) {
        return userMapper.findByUsername(username);
    }
}