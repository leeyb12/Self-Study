-- ========================================
-- 분석 데이터 (analytics_data.sql)
-- 전제: schema.sql → dummy_data.sql 실행 완료 후 실행
-- 포함: rfm_scores, daily_analytics_summary, 추가 behavior_logs
-- ========================================


-- ========================================
-- 1. RFM 점수 (member_id 2~10, 9명)
-- ========================================
-- 산정 기준
--   recency_days : 마지막 비취소 주문 경과일
--   frequency    : 비취소 주문 건수
--   monetary     : 비취소 주문 합계 (원)
-- 점수 기준
--   R: ≤7일=5, 8~30일=4, 31~60일=3, 61~120일=2, >120일=1
--   F: ≥4건=5, 3건=4, 2건=3, 1건=2, 0건=1
--   M: ≥1,500,000=5, 500k~1.5M=4, 200k~500k=3, 30k~200k=2, <30k=1

-- 김민준 (Champions): 2일 전 주문, 3건, 2,946,000원
INSERT INTO rfm_scores (member_id, recency_days, frequency, monetary, r_score, f_score, m_score, rfm_score, segment, calculated_at)
VALUES (2, 2, 3, 2946000, 5, 4, 5, '545', 'Champions', SYSTIMESTAMP);

-- 이수연 (Loyal Customers): 5일 전 주문, 2건, 489,000원
INSERT INTO rfm_scores (member_id, recency_days, frequency, monetary, r_score, f_score, m_score, rfm_score, segment, calculated_at)
VALUES (3, 5, 2, 489000, 5, 3, 3, '533', 'Loyal Customers', SYSTIMESTAMP);

-- 박지호 (New Customers): 1일 전 주문, 1건, 589,000원
INSERT INTO rfm_scores (member_id, recency_days, frequency, monetary, r_score, f_score, m_score, rfm_score, segment, calculated_at)
VALUES (4, 1, 1, 589000, 5, 2, 4, '524', 'New Customers', SYSTIMESTAMP);

-- 최현아 (At Risk): 180일 전 주문, 1건, 51,000원
INSERT INTO rfm_scores (member_id, recency_days, frequency, monetary, r_score, f_score, m_score, rfm_score, segment, calculated_at)
VALUES (5, 180, 1, 51000, 1, 2, 2, '122', 'At Risk', SYSTIMESTAMP);

-- 정도윤 (Potential Loyalists): 60일 전 주문, 2건, 416,000원
INSERT INTO rfm_scores (member_id, recency_days, frequency, monetary, r_score, f_score, m_score, rfm_score, segment, calculated_at)
VALUES (6, 60, 2, 416000, 3, 3, 3, '333', 'Potential Loyalists', SYSTIMESTAMP);

-- 한소희 (New Customers): 3일 전 주문, 1건, 890,000원
INSERT INTO rfm_scores (member_id, recency_days, frequency, monetary, r_score, f_score, m_score, rfm_score, segment, calculated_at)
VALUES (7, 3, 1, 890000, 5, 2, 4, '524', 'New Customers', SYSTIMESTAMP);

-- 오태양 (At Risk): 120일 전 주문, 1건, 46,000원
INSERT INTO rfm_scores (member_id, recency_days, frequency, monetary, r_score, f_score, m_score, rfm_score, segment, calculated_at)
VALUES (8, 120, 1, 46000, 2, 2, 2, '222', 'At Risk', SYSTIMESTAMP);

-- 신유나 (Champions): 7일 전 주문, 2건, 1,725,000원
INSERT INTO rfm_scores (member_id, recency_days, frequency, monetary, r_score, f_score, m_score, rfm_score, segment, calculated_at)
VALUES (9, 7, 2, 1725000, 5, 3, 5, '535', 'Champions', SYSTIMESTAMP);

-- 윤재원 (Lost Customers): 비활성, 성공 주문 없음
INSERT INTO rfm_scores (member_id, recency_days, frequency, monetary, r_score, f_score, m_score, rfm_score, segment, calculated_at)
VALUES (10, 365, 0, 0, 1, 1, 1, '111', 'Lost Customers', SYSTIMESTAMP);


-- ========================================
-- 2. 일별 분석 집계 (최근 30일)
-- ========================================
-- cart_conversion_rate  = cart_add_count / view_count * 100
-- purchase_conversion_rate = purchase_count / cart_add_count * 100
-- Day -7: 박지호 신규 가입일 (new_members=1)
-- 실제 orders 데이터와 맞춰진 날: Day-30(1590000), Day-7(135000),
--   Day-5(235000), Day-3(890000), Day-2(389000), Day-1(589000)

INSERT INTO daily_analytics_summary (summary_date, total_orders, total_revenue, new_members, view_count, cart_add_count, purchase_count, cart_conversion_rate, purchase_conversion_rate, created_at, updated_at)
VALUES (TRUNC(SYSTIMESTAMP) - 30, 1, 1590000, 0, 55, 16,  9, 29.09, 56.25, SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO daily_analytics_summary (summary_date, total_orders, total_revenue, new_members, view_count, cart_add_count, purchase_count, cart_conversion_rate, purchase_conversion_rate, created_at, updated_at)
VALUES (TRUNC(SYSTIMESTAMP) - 29, 2,  350000, 0, 48, 13,  7, 27.08, 53.85, SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO daily_analytics_summary (summary_date, total_orders, total_revenue, new_members, view_count, cart_add_count, purchase_count, cart_conversion_rate, purchase_conversion_rate, created_at, updated_at)
VALUES (TRUNC(SYSTIMESTAMP) - 28, 3,  720000, 0, 67, 20, 11, 29.85, 55.00, SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO daily_analytics_summary (summary_date, total_orders, total_revenue, new_members, view_count, cart_add_count, purchase_count, cart_conversion_rate, purchase_conversion_rate, created_at, updated_at)
VALUES (TRUNC(SYSTIMESTAMP) - 27, 1,  189000, 0, 38, 10,  5, 26.32, 50.00, SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO daily_analytics_summary (summary_date, total_orders, total_revenue, new_members, view_count, cart_add_count, purchase_count, cart_conversion_rate, purchase_conversion_rate, created_at, updated_at)
VALUES (TRUNC(SYSTIMESTAMP) - 26, 2,  430000, 0, 61, 18,  9, 29.51, 50.00, SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO daily_analytics_summary (summary_date, total_orders, total_revenue, new_members, view_count, cart_add_count, purchase_count, cart_conversion_rate, purchase_conversion_rate, created_at, updated_at)
VALUES (TRUNC(SYSTIMESTAMP) - 25, 0,       0, 0, 29,  7,  3, 24.14, 42.86, SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO daily_analytics_summary (summary_date, total_orders, total_revenue, new_members, view_count, cart_add_count, purchase_count, cart_conversion_rate, purchase_conversion_rate, created_at, updated_at)
VALUES (TRUNC(SYSTIMESTAMP) - 24, 4, 1150000, 0, 82, 24, 13, 29.27, 54.17, SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO daily_analytics_summary (summary_date, total_orders, total_revenue, new_members, view_count, cart_add_count, purchase_count, cart_conversion_rate, purchase_conversion_rate, created_at, updated_at)
VALUES (TRUNC(SYSTIMESTAMP) - 23, 2,  380000, 0, 53, 15,  8, 28.30, 53.33, SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO daily_analytics_summary (summary_date, total_orders, total_revenue, new_members, view_count, cart_add_count, purchase_count, cart_conversion_rate, purchase_conversion_rate, created_at, updated_at)
VALUES (TRUNC(SYSTIMESTAMP) - 22, 3,  610000, 0, 70, 21, 11, 30.00, 52.38, SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO daily_analytics_summary (summary_date, total_orders, total_revenue, new_members, view_count, cart_add_count, purchase_count, cart_conversion_rate, purchase_conversion_rate, created_at, updated_at)
VALUES (TRUNC(SYSTIMESTAMP) - 21, 1,  220000, 0, 44, 12,  6, 27.27, 50.00, SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO daily_analytics_summary (summary_date, total_orders, total_revenue, new_members, view_count, cart_add_count, purchase_count, cart_conversion_rate, purchase_conversion_rate, created_at, updated_at)
VALUES (TRUNC(SYSTIMESTAMP) - 20, 2,  490000, 0, 59, 17,  9, 28.81, 52.94, SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO daily_analytics_summary (summary_date, total_orders, total_revenue, new_members, view_count, cart_add_count, purchase_count, cart_conversion_rate, purchase_conversion_rate, created_at, updated_at)
VALUES (TRUNC(SYSTIMESTAMP) - 19, 0,       0, 0, 33,  8,  4, 24.24, 50.00, SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO daily_analytics_summary (summary_date, total_orders, total_revenue, new_members, view_count, cart_add_count, purchase_count, cart_conversion_rate, purchase_conversion_rate, created_at, updated_at)
VALUES (TRUNC(SYSTIMESTAMP) - 18, 3,  870000, 0, 75, 22, 12, 29.33, 54.55, SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO daily_analytics_summary (summary_date, total_orders, total_revenue, new_members, view_count, cart_add_count, purchase_count, cart_conversion_rate, purchase_conversion_rate, created_at, updated_at)
VALUES (TRUNC(SYSTIMESTAMP) - 17, 2,  540000, 0, 56, 16,  9, 28.57, 56.25, SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO daily_analytics_summary (summary_date, total_orders, total_revenue, new_members, view_count, cart_add_count, purchase_count, cart_conversion_rate, purchase_conversion_rate, created_at, updated_at)
VALUES (TRUNC(SYSTIMESTAMP) - 16, 1,  180000, 0, 41, 11,  6, 26.83, 54.55, SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO daily_analytics_summary (summary_date, total_orders, total_revenue, new_members, view_count, cart_add_count, purchase_count, cart_conversion_rate, purchase_conversion_rate, created_at, updated_at)
VALUES (TRUNC(SYSTIMESTAMP) - 15, 5, 1380000, 0, 91, 27, 14, 29.67, 51.85, SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO daily_analytics_summary (summary_date, total_orders, total_revenue, new_members, view_count, cart_add_count, purchase_count, cart_conversion_rate, purchase_conversion_rate, created_at, updated_at)
VALUES (TRUNC(SYSTIMESTAMP) - 14, 2,  440000, 0, 63, 19, 10, 30.16, 52.63, SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO daily_analytics_summary (summary_date, total_orders, total_revenue, new_members, view_count, cart_add_count, purchase_count, cart_conversion_rate, purchase_conversion_rate, created_at, updated_at)
VALUES (TRUNC(SYSTIMESTAMP) - 13, 3,  700000, 0, 72, 21, 12, 29.17, 57.14, SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO daily_analytics_summary (summary_date, total_orders, total_revenue, new_members, view_count, cart_add_count, purchase_count, cart_conversion_rate, purchase_conversion_rate, created_at, updated_at)
VALUES (TRUNC(SYSTIMESTAMP) - 12, 0,       0, 0, 27,  6,  3, 22.22, 50.00, SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO daily_analytics_summary (summary_date, total_orders, total_revenue, new_members, view_count, cart_add_count, purchase_count, cart_conversion_rate, purchase_conversion_rate, created_at, updated_at)
VALUES (TRUNC(SYSTIMESTAMP) - 11, 2,  360000, 0, 57, 16,  9, 28.07, 56.25, SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO daily_analytics_summary (summary_date, total_orders, total_revenue, new_members, view_count, cart_add_count, purchase_count, cart_conversion_rate, purchase_conversion_rate, created_at, updated_at)
VALUES (TRUNC(SYSTIMESTAMP) - 10, 4, 1980000, 0, 98, 29, 16, 29.59, 55.17, SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO daily_analytics_summary (summary_date, total_orders, total_revenue, new_members, view_count, cart_add_count, purchase_count, cart_conversion_rate, purchase_conversion_rate, created_at, updated_at)
VALUES (TRUNC(SYSTIMESTAMP) - 9,  3,  820000, 0, 71, 21, 11, 29.58, 52.38, SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO daily_analytics_summary (summary_date, total_orders, total_revenue, new_members, view_count, cart_add_count, purchase_count, cart_conversion_rate, purchase_conversion_rate, created_at, updated_at)
VALUES (TRUNC(SYSTIMESTAMP) - 8,  2,  500000, 0, 58, 17,  9, 29.31, 52.94, SYSTIMESTAMP, SYSTIMESTAMP);

-- Day -7: 박지호 신규 가입 (new_members=1), 신유나 주문(135,000)
INSERT INTO daily_analytics_summary (summary_date, total_orders, total_revenue, new_members, view_count, cart_add_count, purchase_count, cart_conversion_rate, purchase_conversion_rate, created_at, updated_at)
VALUES (TRUNC(SYSTIMESTAMP) - 7,  1,  135000, 1, 62, 19, 10, 30.65, 52.63, SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO daily_analytics_summary (summary_date, total_orders, total_revenue, new_members, view_count, cart_add_count, purchase_count, cart_conversion_rate, purchase_conversion_rate, created_at, updated_at)
VALUES (TRUNC(SYSTIMESTAMP) - 6,  2,  480000, 0, 56, 16,  9, 28.57, 56.25, SYSTIMESTAMP, SYSTIMESTAMP);

-- Day -5: 이수연 원목 책상 주문(235,000)
INSERT INTO daily_analytics_summary (summary_date, total_orders, total_revenue, new_members, view_count, cart_add_count, purchase_count, cart_conversion_rate, purchase_conversion_rate, created_at, updated_at)
VALUES (TRUNC(SYSTIMESTAMP) - 5,  1,  235000, 0, 47, 14,  7, 29.79, 50.00, SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO daily_analytics_summary (summary_date, total_orders, total_revenue, new_members, view_count, cart_add_count, purchase_count, cart_conversion_rate, purchase_conversion_rate, created_at, updated_at)
VALUES (TRUNC(SYSTIMESTAMP) - 4,  3,  750000, 0, 74, 22, 12, 29.73, 54.55, SYSTIMESTAMP, SYSTIMESTAMP);

-- Day -3: 한소희 아이패드 주문(890,000)
INSERT INTO daily_analytics_summary (summary_date, total_orders, total_revenue, new_members, view_count, cart_add_count, purchase_count, cart_conversion_rate, purchase_conversion_rate, created_at, updated_at)
VALUES (TRUNC(SYSTIMESTAMP) - 3,  1,  890000, 0, 52, 15,  8, 28.85, 53.33, SYSTIMESTAMP, SYSTIMESTAMP);

-- Day -2: 김민준 침대 주문(389,000)
INSERT INTO daily_analytics_summary (summary_date, total_orders, total_revenue, new_members, view_count, cart_add_count, purchase_count, cart_conversion_rate, purchase_conversion_rate, created_at, updated_at)
VALUES (TRUNC(SYSTIMESTAMP) - 2,  1,  389000, 0, 49, 14,  7, 28.57, 50.00, SYSTIMESTAMP, SYSTIMESTAMP);

-- Day -1: 박지호 소파 주문(589,000)
INSERT INTO daily_analytics_summary (summary_date, total_orders, total_revenue, new_members, view_count, cart_add_count, purchase_count, cart_conversion_rate, purchase_conversion_rate, created_at, updated_at)
VALUES (TRUNC(SYSTIMESTAMP) - 1,  1,  589000, 0, 53, 16,  8, 30.19, 50.00, SYSTIMESTAMP, SYSTIMESTAMP);


-- ========================================
-- 3. 추가 행동 로그 (퍼널 분석 현실화)
-- ========================================
-- 목표: VIEW >> ADD_CART > PURCHASE 비율 확보
-- 현재 비율: VIEW ~30 / ADD_CART ~20 / PURCHASE ~15 (비현실적)
-- 추가 후:  VIEW ~110 / ADD_CART ~35 / PURCHASE ~15 (전환율 ~30%/~43%)
-- anon_v001~070: 익명 사용자 VIEW 로그 (최근 30일 분산)
-- anon_c001~010: 익명 사용자 ADD_CART 후 이탈 (전환 안 됨)

-- ── 익명 VIEW (최근 30~22일) ──────────────────────────
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 3,  'VIEW', 'anon_v001', SYSTIMESTAMP - INTERVAL '30' DAY(3), SYSTIMESTAMP - INTERVAL '30' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 1,  'VIEW', 'anon_v002', SYSTIMESTAMP - INTERVAL '30' DAY(3), SYSTIMESTAMP - INTERVAL '30' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 17, 'VIEW', 'anon_v003', SYSTIMESTAMP - INTERVAL '29' DAY(3), SYSTIMESTAMP - INTERVAL '29' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 12, 'VIEW', 'anon_v004', SYSTIMESTAMP - INTERVAL '29' DAY(3), SYSTIMESTAMP - INTERVAL '29' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 24, 'VIEW', 'anon_v005', SYSTIMESTAMP - INTERVAL '28' DAY(3), SYSTIMESTAMP - INTERVAL '28' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 6,  'VIEW', 'anon_v006', SYSTIMESTAMP - INTERVAL '28' DAY(3), SYSTIMESTAMP - INTERVAL '28' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 9,  'VIEW', 'anon_v007', SYSTIMESTAMP - INTERVAL '28' DAY(3), SYSTIMESTAMP - INTERVAL '28' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 2,  'VIEW', 'anon_v008', SYSTIMESTAMP - INTERVAL '27' DAY(3), SYSTIMESTAMP - INTERVAL '27' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 19, 'VIEW', 'anon_v009', SYSTIMESTAMP - INTERVAL '27' DAY(3), SYSTIMESTAMP - INTERVAL '27' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 11, 'VIEW', 'anon_v010', SYSTIMESTAMP - INTERVAL '26' DAY(3), SYSTIMESTAMP - INTERVAL '26' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 4,  'VIEW', 'anon_v011', SYSTIMESTAMP - INTERVAL '26' DAY(3), SYSTIMESTAMP - INTERVAL '26' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 25, 'VIEW', 'anon_v012', SYSTIMESTAMP - INTERVAL '25' DAY(3), SYSTIMESTAMP - INTERVAL '25' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 7,  'VIEW', 'anon_v013', SYSTIMESTAMP - INTERVAL '24' DAY(3), SYSTIMESTAMP - INTERVAL '24' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 13, 'VIEW', 'anon_v014', SYSTIMESTAMP - INTERVAL '24' DAY(3), SYSTIMESTAMP - INTERVAL '24' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 1,  'VIEW', 'anon_v015', SYSTIMESTAMP - INTERVAL '24' DAY(3), SYSTIMESTAMP - INTERVAL '24' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 20, 'VIEW', 'anon_v016', SYSTIMESTAMP - INTERVAL '23' DAY(3), SYSTIMESTAMP - INTERVAL '23' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 5,  'VIEW', 'anon_v017', SYSTIMESTAMP - INTERVAL '23' DAY(3), SYSTIMESTAMP - INTERVAL '23' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 22, 'VIEW', 'anon_v018', SYSTIMESTAMP - INTERVAL '22' DAY(3), SYSTIMESTAMP - INTERVAL '22' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 16, 'VIEW', 'anon_v019', SYSTIMESTAMP - INTERVAL '22' DAY(3), SYSTIMESTAMP - INTERVAL '22' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 8,  'VIEW', 'anon_v020', SYSTIMESTAMP - INTERVAL '22' DAY(3), SYSTIMESTAMP - INTERVAL '22' DAY(3));

-- ── 익명 VIEW (최근 21~15일) ──────────────────────────
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 3,  'VIEW', 'anon_v021', SYSTIMESTAMP - INTERVAL '21' DAY(3), SYSTIMESTAMP - INTERVAL '21' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 15, 'VIEW', 'anon_v022', SYSTIMESTAMP - INTERVAL '21' DAY(3), SYSTIMESTAMP - INTERVAL '21' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 10, 'VIEW', 'anon_v023', SYSTIMESTAMP - INTERVAL '20' DAY(3), SYSTIMESTAMP - INTERVAL '20' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 2,  'VIEW', 'anon_v024', SYSTIMESTAMP - INTERVAL '20' DAY(3), SYSTIMESTAMP - INTERVAL '20' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 23, 'VIEW', 'anon_v025', SYSTIMESTAMP - INTERVAL '19' DAY(3), SYSTIMESTAMP - INTERVAL '19' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 18, 'VIEW', 'anon_v026', SYSTIMESTAMP - INTERVAL '18' DAY(3), SYSTIMESTAMP - INTERVAL '18' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 4,  'VIEW', 'anon_v027', SYSTIMESTAMP - INTERVAL '18' DAY(3), SYSTIMESTAMP - INTERVAL '18' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 14, 'VIEW', 'anon_v028', SYSTIMESTAMP - INTERVAL '18' DAY(3), SYSTIMESTAMP - INTERVAL '18' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 1,  'VIEW', 'anon_v029', SYSTIMESTAMP - INTERVAL '17' DAY(3), SYSTIMESTAMP - INTERVAL '17' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 6,  'VIEW', 'anon_v030', SYSTIMESTAMP - INTERVAL '17' DAY(3), SYSTIMESTAMP - INTERVAL '17' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 21, 'VIEW', 'anon_v031', SYSTIMESTAMP - INTERVAL '16' DAY(3), SYSTIMESTAMP - INTERVAL '16' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 9,  'VIEW', 'anon_v032', SYSTIMESTAMP - INTERVAL '16' DAY(3), SYSTIMESTAMP - INTERVAL '16' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 3,  'VIEW', 'anon_v033', SYSTIMESTAMP - INTERVAL '15' DAY(3), SYSTIMESTAMP - INTERVAL '15' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 17, 'VIEW', 'anon_v034', SYSTIMESTAMP - INTERVAL '15' DAY(3), SYSTIMESTAMP - INTERVAL '15' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 11, 'VIEW', 'anon_v035', SYSTIMESTAMP - INTERVAL '15' DAY(3), SYSTIMESTAMP - INTERVAL '15' DAY(3));

-- ── 익명 VIEW (최근 14~8일) ───────────────────────────
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 24, 'VIEW', 'anon_v036', SYSTIMESTAMP - INTERVAL '14' DAY(3), SYSTIMESTAMP - INTERVAL '14' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 5,  'VIEW', 'anon_v037', SYSTIMESTAMP - INTERVAL '14' DAY(3), SYSTIMESTAMP - INTERVAL '14' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 20, 'VIEW', 'anon_v038', SYSTIMESTAMP - INTERVAL '13' DAY(3), SYSTIMESTAMP - INTERVAL '13' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 7,  'VIEW', 'anon_v039', SYSTIMESTAMP - INTERVAL '13' DAY(3), SYSTIMESTAMP - INTERVAL '13' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 2,  'VIEW', 'anon_v040', SYSTIMESTAMP - INTERVAL '13' DAY(3), SYSTIMESTAMP - INTERVAL '13' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 16, 'VIEW', 'anon_v041', SYSTIMESTAMP - INTERVAL '12' DAY(3), SYSTIMESTAMP - INTERVAL '12' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 13, 'VIEW', 'anon_v042', SYSTIMESTAMP - INTERVAL '11' DAY(3), SYSTIMESTAMP - INTERVAL '11' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 4,  'VIEW', 'anon_v043', SYSTIMESTAMP - INTERVAL '11' DAY(3), SYSTIMESTAMP - INTERVAL '11' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 1,  'VIEW', 'anon_v044', SYSTIMESTAMP - INTERVAL '10' DAY(3), SYSTIMESTAMP - INTERVAL '10' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 22, 'VIEW', 'anon_v045', SYSTIMESTAMP - INTERVAL '10' DAY(3), SYSTIMESTAMP - INTERVAL '10' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 8,  'VIEW', 'anon_v046', SYSTIMESTAMP - INTERVAL '10' DAY(3), SYSTIMESTAMP - INTERVAL '10' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 18, 'VIEW', 'anon_v047', SYSTIMESTAMP - INTERVAL '9'  DAY(3), SYSTIMESTAMP - INTERVAL '9'  DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 25, 'VIEW', 'anon_v048', SYSTIMESTAMP - INTERVAL '9'  DAY(3), SYSTIMESTAMP - INTERVAL '9'  DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 3,  'VIEW', 'anon_v049', SYSTIMESTAMP - INTERVAL '8'  DAY(3), SYSTIMESTAMP - INTERVAL '8'  DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 10, 'VIEW', 'anon_v050', SYSTIMESTAMP - INTERVAL '8'  DAY(3), SYSTIMESTAMP - INTERVAL '8'  DAY(3));

-- ── 익명 VIEW (최근 7~1일) ────────────────────────────
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 1,  'VIEW', 'anon_v051', SYSTIMESTAMP - INTERVAL '7'  DAY(3), SYSTIMESTAMP - INTERVAL '7'  DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 15, 'VIEW', 'anon_v052', SYSTIMESTAMP - INTERVAL '7'  DAY(3), SYSTIMESTAMP - INTERVAL '7'  DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 6,  'VIEW', 'anon_v053', SYSTIMESTAMP - INTERVAL '6'  DAY(3), SYSTIMESTAMP - INTERVAL '6'  DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 9,  'VIEW', 'anon_v054', SYSTIMESTAMP - INTERVAL '6'  DAY(3), SYSTIMESTAMP - INTERVAL '6'  DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 19, 'VIEW', 'anon_v055', SYSTIMESTAMP - INTERVAL '5'  DAY(3), SYSTIMESTAMP - INTERVAL '5'  DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 2,  'VIEW', 'anon_v056', SYSTIMESTAMP - INTERVAL '5'  DAY(3), SYSTIMESTAMP - INTERVAL '5'  DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 23, 'VIEW', 'anon_v057', SYSTIMESTAMP - INTERVAL '4'  DAY(3), SYSTIMESTAMP - INTERVAL '4'  DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 7,  'VIEW', 'anon_v058', SYSTIMESTAMP - INTERVAL '4'  DAY(3), SYSTIMESTAMP - INTERVAL '4'  DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 14, 'VIEW', 'anon_v059', SYSTIMESTAMP - INTERVAL '4'  DAY(3), SYSTIMESTAMP - INTERVAL '4'  DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 4,  'VIEW', 'anon_v060', SYSTIMESTAMP - INTERVAL '3'  DAY(3), SYSTIMESTAMP - INTERVAL '3'  DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 16, 'VIEW', 'anon_v061', SYSTIMESTAMP - INTERVAL '3'  DAY(3), SYSTIMESTAMP - INTERVAL '3'  DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 20, 'VIEW', 'anon_v062', SYSTIMESTAMP - INTERVAL '2'  DAY(3), SYSTIMESTAMP - INTERVAL '2'  DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 24, 'VIEW', 'anon_v063', SYSTIMESTAMP - INTERVAL '2'  DAY(3), SYSTIMESTAMP - INTERVAL '2'  DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 13, 'VIEW', 'anon_v064', SYSTIMESTAMP - INTERVAL '1'  DAY(3), SYSTIMESTAMP - INTERVAL '1'  DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 8,  'VIEW', 'anon_v065', SYSTIMESTAMP - INTERVAL '1'  DAY(3), SYSTIMESTAMP - INTERVAL '1'  DAY(3));

-- ── 로그인 사용자 추가 VIEW (검색 없이 직접 탐색) ────────
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (2, 3,  'VIEW', 'sess_kim_004', SYSTIMESTAMP - INTERVAL '14' DAY(3), SYSTIMESTAMP - INTERVAL '14' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (2, 17, 'VIEW', 'sess_kim_004', SYSTIMESTAMP - INTERVAL '14' DAY(3), SYSTIMESTAMP - INTERVAL '14' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (3, 11, 'VIEW', 'sess_lee_004', SYSTIMESTAMP - INTERVAL '12' DAY(3), SYSTIMESTAMP - INTERVAL '12' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (3, 13, 'VIEW', 'sess_lee_004', SYSTIMESTAMP - INTERVAL '12' DAY(3), SYSTIMESTAMP - INTERVAL '12' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (6, 25, 'VIEW', 'sess_jung_003', SYSTIMESTAMP - INTERVAL '10' DAY(3), SYSTIMESTAMP - INTERVAL '10' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (6, 21, 'VIEW', 'sess_jung_003', SYSTIMESTAMP - INTERVAL '10' DAY(3), SYSTIMESTAMP - INTERVAL '10' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (7, 1,  'VIEW', 'sess_han_003', SYSTIMESTAMP - INTERVAL '6'  DAY(3), SYSTIMESTAMP - INTERVAL '6'  DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (7, 4,  'VIEW', 'sess_han_003', SYSTIMESTAMP - INTERVAL '6'  DAY(3), SYSTIMESTAMP - INTERVAL '6'  DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (9, 2,  'VIEW', 'sess_shin_003', SYSTIMESTAMP - INTERVAL '4' DAY(3), SYSTIMESTAMP - INTERVAL '4' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (4, 21, 'VIEW', 'sess_park_002', SYSTIMESTAMP - INTERVAL '2' DAY(3), SYSTIMESTAMP - INTERVAL '2' DAY(3));

-- ── 추가 검색 키워드 로그 ──────────────────────────────
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, search_keyword, category_id, created_at, updated_at)
VALUES (NULL, NULL, 'VIEW', 'anon_s001', '갤럭시',   1, SYSTIMESTAMP - INTERVAL '20' DAY(3), SYSTIMESTAMP - INTERVAL '20' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, search_keyword, category_id, created_at, updated_at)
VALUES (NULL, NULL, 'VIEW', 'anon_s002', '갤럭시',   1, SYSTIMESTAMP - INTERVAL '15' DAY(3), SYSTIMESTAMP - INTERVAL '15' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, search_keyword, category_id, created_at, updated_at)
VALUES (NULL, NULL, 'VIEW', 'anon_s003', '노트북',   1, SYSTIMESTAMP - INTERVAL '18' DAY(3), SYSTIMESTAMP - INTERVAL '18' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, search_keyword, category_id, created_at, updated_at)
VALUES (NULL, NULL, 'VIEW', 'anon_s004', '노트북',   1, SYSTIMESTAMP - INTERVAL '10' DAY(3), SYSTIMESTAMP - INTERVAL '10' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, search_keyword, category_id, created_at, updated_at)
VALUES (NULL, NULL, 'VIEW', 'anon_s005', '소파',     4, SYSTIMESTAMP - INTERVAL '12' DAY(3), SYSTIMESTAMP - INTERVAL '12' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, search_keyword, category_id, created_at, updated_at)
VALUES (NULL, NULL, 'VIEW', 'anon_s006', '소파',     4, SYSTIMESTAMP - INTERVAL '3'  DAY(3), SYSTIMESTAMP - INTERVAL '3'  DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, search_keyword, category_id, created_at, updated_at)
VALUES (NULL, NULL, 'VIEW', 'anon_s007', '에어팟',   1, SYSTIMESTAMP - INTERVAL '8'  DAY(3), SYSTIMESTAMP - INTERVAL '8'  DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, search_keyword, category_id, created_at, updated_at)
VALUES (3,    NULL, 'VIEW', 'sess_lee_005', '식품',  3, SYSTIMESTAMP - INTERVAL '13' DAY(3), SYSTIMESTAMP - INTERVAL '13' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, search_keyword, category_id, created_at, updated_at)
VALUES (6,    NULL, 'VIEW', 'sess_jung_004', '책',   5, SYSTIMESTAMP - INTERVAL '11' DAY(3), SYSTIMESTAMP - INTERVAL '11' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, search_keyword, category_id, created_at, updated_at)
VALUES (NULL, NULL, 'VIEW', 'anon_s008', '원피스',  2, SYSTIMESTAMP - INTERVAL '6'  DAY(3), SYSTIMESTAMP - INTERVAL '6'  DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, search_keyword, category_id, created_at, updated_at)
VALUES (NULL, NULL, 'VIEW', 'anon_s009', '갤럭시',  1, SYSTIMESTAMP - INTERVAL '4'  DAY(3), SYSTIMESTAMP - INTERVAL '4'  DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, search_keyword, category_id, created_at, updated_at)
VALUES (4,    NULL, 'VIEW', 'sess_park_003', '침대', 4, SYSTIMESTAMP - INTERVAL '2'  DAY(3), SYSTIMESTAMP - INTERVAL '2'  DAY(3));

-- ── 익명 ADD_CART (장바구니 담고 이탈 - 전환 안 됨) ─────
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 1,  'ADD_CART', 'anon_c001', SYSTIMESTAMP - INTERVAL '24' DAY(3), SYSTIMESTAMP - INTERVAL '24' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 3,  'ADD_CART', 'anon_c002', SYSTIMESTAMP - INTERVAL '18' DAY(3), SYSTIMESTAMP - INTERVAL '18' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 17, 'ADD_CART', 'anon_c003', SYSTIMESTAMP - INTERVAL '15' DAY(3), SYSTIMESTAMP - INTERVAL '15' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 9,  'ADD_CART', 'anon_c004', SYSTIMESTAMP - INTERVAL '13' DAY(3), SYSTIMESTAMP - INTERVAL '13' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 2,  'ADD_CART', 'anon_c005', SYSTIMESTAMP - INTERVAL '10' DAY(3), SYSTIMESTAMP - INTERVAL '10' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 5,  'ADD_CART', 'anon_c006', SYSTIMESTAMP - INTERVAL '7'  DAY(3), SYSTIMESTAMP - INTERVAL '7'  DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 11, 'ADD_CART', 'anon_c007', SYSTIMESTAMP - INTERVAL '5'  DAY(3), SYSTIMESTAMP - INTERVAL '5'  DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 4,  'ADD_CART', 'anon_c008', SYSTIMESTAMP - INTERVAL '3'  DAY(3), SYSTIMESTAMP - INTERVAL '3'  DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 21, 'ADD_CART', 'anon_c009', SYSTIMESTAMP - INTERVAL '2'  DAY(3), SYSTIMESTAMP - INTERVAL '2'  DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 16, 'ADD_CART', 'anon_c010', SYSTIMESTAMP - INTERVAL '1'  DAY(3), SYSTIMESTAMP - INTERVAL '1'  DAY(3));

COMMIT;

-- ========================================
-- 실행 결과 확인 쿼리
-- ========================================
-- SELECT segment, COUNT(*) as cnt FROM rfm_scores GROUP BY segment ORDER BY cnt DESC;
-- SELECT TO_CHAR(summary_date,'YYYY-MM-DD'), total_orders, total_revenue, view_count, cart_add_count, purchase_count FROM daily_analytics_summary ORDER BY summary_date;
-- SELECT action_type, COUNT(*) as cnt FROM behavior_logs GROUP BY action_type ORDER BY cnt DESC;
