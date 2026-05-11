package com.pknu26.talent.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.pknu26.talent.model.User;

@Mapper
public interface UserMapper {
    User findByUsername(String username);
    void insertUser(User user);
}
