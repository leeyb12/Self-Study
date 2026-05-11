package com.pknu26.talent.config;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import javax.sql.DataSource;

@Configuration
@MapperScan("com.pknu26.talent.mapper") // 매퍼 인터페이스 경로
public class MyBatisConfig {

    @Bean
    public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
        SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
        sessionFactory.setDataSource(dataSource);
        
        // 매퍼 XML 위치 설정
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        sessionFactory.setMapperLocations(resolver.getResources("classpath:mapper/*.xml"));
        
        // Alias 패키지 설정 (VO/DTO 경로)
        sessionFactory.setTypeAliasesPackage("com.pknu26.talent.model");
        
        // 카멜케이스 설정 (필요 시)
        org.apache.ibatis.session.Configuration configuration = new org.apache.ibatis.session.Configuration();
        configuration.setMapUnderscoreToCamelCase(true);
        sessionFactory.setConfiguration(configuration);
        
        return sessionFactory.getObject();
    }
}