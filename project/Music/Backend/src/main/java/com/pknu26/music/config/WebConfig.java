package com.pknu26.music.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/music/**")
                .addResourceLocations("file:C:/music_storage/");

        registry.addResourceHandler("/board-files/**")
                .addResourceLocations("file:C:/music_storage/board/");
    }
    // CORS는 SecurityConfig 의 CorsConfigurationSource 한 곳에서 관리한다.
}