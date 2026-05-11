package com.pknu26.talent;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.pknu26.talent.mapper")
public class TalentApplication {
    public static void main(String[] args) {
        SpringApplication.run(TalentApplication.class, args);
    }
}
