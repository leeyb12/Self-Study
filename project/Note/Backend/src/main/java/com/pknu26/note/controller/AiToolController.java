package com.pknu26.note.controller;

import com.pknu26.note.dto.AiToolRequest;
import com.pknu26.note.dto.AiToolResponse;
import com.pknu26.note.dto.ChatRequest;
import com.pknu26.note.dto.ChatResponse;
import com.pknu26.note.service.AiToolService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AiToolController {

    private final AiToolService aiToolService;

    public AiToolController(AiToolService aiToolService) {
        this.aiToolService = aiToolService;
    }

    @PostMapping("/tools")
    public AiToolResponse run(@Valid @RequestBody AiToolRequest request) {
        return aiToolService.run(request);
    }

    @PostMapping("/chat")
    public ChatResponse chat(@Valid @RequestBody ChatRequest request) {
        return aiToolService.chat(request);
    }
}
