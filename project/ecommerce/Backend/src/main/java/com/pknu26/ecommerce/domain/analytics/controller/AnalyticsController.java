package com.pknu26.ecommerce.domain.analytics.controller;

import com.pknu26.ecommerce.domain.analytics.dto.AnalyticsDto;
import com.pknu26.ecommerce.domain.analytics.service.BehaviorLogService;
import com.pknu26.ecommerce.domain.analytics.service.RfmService;
import com.pknu26.ecommerce.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
@Tag(name = "분석 API")
public class AnalyticsController {

    private final BehaviorLogService behaviorLogService;
    private final RfmService rfmService;

    @PostMapping("/log")
    @Operation(summary = "행동 로그 기록", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> log(
            @AuthenticationPrincipal Long memberId,
            @RequestBody AnalyticsDto.BehaviorLogRequest request) {
        behaviorLogService.log(memberId, request.getProductId(), request.getActionType(),
            request.getSessionId(), request.getSearchKeyword(), request.getCategoryId());
        return ResponseEntity.ok(ApiResponse.noContent());
    }

    @GetMapping("/top-viewed")
    @Operation(summary = "많이 본 상품 TOP N (관리자)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<List<AnalyticsDto.TopProductResponse>>> getTopViewed(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(ApiResponse.ok(behaviorLogService.getTopViewedProducts(start, end, limit)));
    }

    @GetMapping("/top-purchased")
    @Operation(summary = "많이 팔린 상품 TOP N (관리자)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<List<AnalyticsDto.TopProductResponse>>> getTopPurchased(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(ApiResponse.ok(behaviorLogService.getTopPurchasedProducts(start, end, limit)));
    }

    @GetMapping("/top-keywords")
    @Operation(summary = "인기 검색어 TOP N (관리자)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<List<AnalyticsDto.TopKeywordResponse>>> getTopKeywords(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(ApiResponse.ok(behaviorLogService.getTopSearchKeywords(start, end, limit)));
    }

    @GetMapping("/daily-purchase")
    @Operation(summary = "일별 구매 추이 (관리자)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<List<AnalyticsDto.DailyPurchaseResponse>>> getDailyPurchase(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(ApiResponse.ok(behaviorLogService.getDailyPurchaseTrend(start, end)));
    }

    @GetMapping("/funnel")
    @Operation(summary = "구매 전환 퍼널 (관리자)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<AnalyticsDto.PurchaseFunnelResponse>> getFunnel(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(ApiResponse.ok(behaviorLogService.getPurchaseFunnel(start, end)));
    }

    @GetMapping("/members/me/summary")
    @Operation(summary = "내 행동 분석 요약", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<AnalyticsDto.MemberBehaviorSummary>> getMyBehaviorSummary(
            @AuthenticationPrincipal Long memberId) {
        return ResponseEntity.ok(ApiResponse.ok(behaviorLogService.getMemberSummary(memberId)));
    }

    // ── RFM 분석 ────────────────────────────────────────────────────

    @GetMapping("/rfm/members/{memberId}")
    @Operation(summary = "회원 RFM 점수 조회", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<AnalyticsDto.RfmScoreResponse>> getMemberRfm(
            @PathVariable Long memberId) {
        return ResponseEntity.ok(ApiResponse.ok(rfmService.getMemberRfm(memberId)));
    }

    @GetMapping("/rfm/distribution")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "RFM 세그먼트 분포 (관리자)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<List<AnalyticsDto.RfmSegmentDistribution>>> getRfmDistribution() {
        return ResponseEntity.ok(ApiResponse.ok(rfmService.getRfmDistribution()));
    }

    @GetMapping("/rfm/members")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "전체 회원 RFM 점수 목록 (관리자)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<List<AnalyticsDto.RfmScoreResponse>>> getAllRfm() {
        return ResponseEntity.ok(ApiResponse.ok(rfmService.getAllRfmScores()));
    }

    @PostMapping("/rfm/calculate")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "RFM 점수 일괄 계산 (관리자)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<String>> calculateRfm() {
        int count = rfmService.calculateAllRfmScores();
        return ResponseEntity.ok(ApiResponse.ok(count + "명 RFM 점수 계산 완료"));
    }

    // ── 일별 집계 (배치 결과 조회) ───────────────────────────────────

    @GetMapping("/daily-summary")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "일별 분석 집계 조회 (관리자)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<List<AnalyticsDto.DailySummaryResponse>>> getDailySummary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return ResponseEntity.ok(ApiResponse.ok(rfmService.getDailySummary(start, end)));
    }
}
