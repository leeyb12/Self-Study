package com.pknu26.music.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.config.annotation.*;
import java.nio.file.Path;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final Path musicDirectory;

    public WebConfig(@Value("${app.storage.music-dir:D:/music_storage}") String musicDirectory) {
        this.musicDirectory = Path.of(musicDirectory).toAbsolutePath().normalize();
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/music/**")
                .addResourceLocations(asDirectoryLocation(musicDirectory));

        registry.addResourceHandler("/board-files/**")
                .addResourceLocations(asDirectoryLocation(musicDirectory.resolve("board")));
    }

    private String asDirectoryLocation(Path directory) {
        String location = directory.toUri().toString();
        return location.endsWith("/") ? location : location + "/";
    }
    // CORS는 SecurityConfig 의 CorsConfigurationSource 한 곳에서 관리한다.
}
