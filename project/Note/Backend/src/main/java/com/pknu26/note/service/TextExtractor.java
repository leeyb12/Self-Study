package com.pknu26.note.service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Component;

/** 첨부파일에서 요약에 사용할 텍스트를 추출한다. PDF / 텍스트 계열만 지원. */
@Component
public class TextExtractor {

    /** 이 파일에서 텍스트 추출이 가능한지(=요약 입력에 포함 가능한지) 판단한다. */
    public boolean isExtractable(String contentType, String fileName) {
        return isPdf(contentType, fileName) || isText(contentType, fileName);
    }

    /** 추출 텍스트를 반환한다. 추출 불가/실패 시 빈 문자열. */
    public String extract(Path path, String contentType, String fileName) {
        try {
            if (isPdf(contentType, fileName)) {
                return extractPdf(path);
            }
            if (isText(contentType, fileName)) {
                return Files.readString(path, StandardCharsets.UTF_8);
            }
        } catch (IOException | RuntimeException e) {
            // 추출 실패는 요약에서 그냥 제외 (전체 실패로 만들지 않음)
            return "";
        }
        return "";
    }

    private String extractPdf(Path path) throws IOException {
        try (PDDocument doc = Loader.loadPDF(path.toFile())) {
            return new PDFTextStripper().getText(doc);
        }
    }

    private boolean isPdf(String contentType, String fileName) {
        return "application/pdf".equalsIgnoreCase(contentType)
                || endsWith(fileName, ".pdf");
    }

    private boolean isText(String contentType, String fileName) {
        if (contentType != null && contentType.startsWith("text/")) {
            return true;
        }
        return endsWith(fileName, ".txt") || endsWith(fileName, ".md")
                || endsWith(fileName, ".csv") || endsWith(fileName, ".json");
    }

    private boolean endsWith(String name, String ext) {
        return name != null && name.toLowerCase().endsWith(ext);
    }
}
