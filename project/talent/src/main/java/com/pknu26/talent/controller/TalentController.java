package com.pknu26.talent.controller;

import com.pknu26.talent.model.Application;
import com.pknu26.talent.model.TalentService;
import com.pknu26.talent.service.TalentPlatformService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class TalentController {

    private final TalentPlatformService talentService;

    @Value("${upload.path}")
    private String uploadPath;

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("services", talentService.getAllServices());
        return "index";
    }

    @GetMapping("/register")
    public String registerForm() {
        return "register";
    }

    @PostMapping("/register")
    public String registerService(@ModelAttribute TalentService service, 
                                @RequestParam("imageFile") MultipartFile imageFile) throws IOException {
        
        if (!imageFile.isEmpty()) {
            String fileName = UUID.randomUUID().toString() + "_" + imageFile.getOriginalFilename();
            File dest = new File(new File(uploadPath).getAbsolutePath(), fileName);
            imageFile.transferTo(dest);
            service.setImageUrl("/uploads/" + fileName);
        }
        
        talentService.registerService(service);
        return "redirect:/";
    }

    @GetMapping("/service/{id}")
    public String serviceDetail(@PathVariable Long id, Model model) {
        model.addAttribute("service", talentService.getServiceById(id));
        return "detail";
    }

    @PostMapping("/apply")
    public String applyService(@ModelAttribute Application application) {
        talentService.applyForService(application);
        return "redirect:/";
    }
}
