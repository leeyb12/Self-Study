package com.pknu26.music.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.music.storage-dir}")
    private String storageDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/music/**")
                .addResourceLocations("file:" + absolute(storageDir) + "/");

        registry.addResourceHandler("/board-files/**")
                .addResourceLocations("file:" + absolute(storageDir) + "/board/");
    }
    // CORS는 SecurityConfig 의 CorsConfigurationSource 한 곳에서 관리한다.

    private String absolute(String path) {
        return Paths.get(path).toAbsolutePath().normalize()
                .toString()
                .replace("\\", "/")
                .replaceAll("/+$", "");
    }
}
