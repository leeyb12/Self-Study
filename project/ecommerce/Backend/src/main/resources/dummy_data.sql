-- ========================================
-- 이커머스 더미 데이터
-- ========================================
-- 전제: schema.sql 실행 직후의 빈 DB (IDENTITY 시퀀스 1부터 시작)
-- 비밀번호: 모두 "1234" (BCrypt 인코딩)
--   실제 로그인 테스트 → /api/auth/register 엔드포인트로 직접 가입 권장
-- 카테고리 ID: 1=전자제품, 2=패션의류, 3=식품/음료, 4=가구/인테리어, 5=도서
-- ========================================

-- ========================================
-- 회원 (member_id: 1~10)
-- ========================================
-- 1. 관리자
INSERT INTO members (email, password, name, phone, address, status, role, created_at, updated_at)
VALUES ('admin@test.com', '$2a$10$N.zmdr9zkAMok.yGHhwCcePeaXKiLnEE.pL9RN5S2XZG2O6ZT8/Sq',
        '관리자', '010-0000-0000', '서울시 중구 세종대로 110', 'ACTIVE', 'ADMIN',
        SYSTIMESTAMP - INTERVAL '365' DAY(3), SYSTIMESTAMP - INTERVAL '365' DAY(3));
-- 2. 김민준 (챔피언 고객 - 최근 + 다수 구매)
INSERT INTO members (email, password, name, phone, address, status, role, created_at, updated_at)
VALUES ('kim@test.com', '$2a$10$N.zmdr9zkAMok.yGHhwCcePeaXKiLnEE.pL9RN5S2XZG2O6ZT8/Sq',
        '김민준', '010-1234-5678', '서울시 강남구 테헤란로 123', 'ACTIVE', 'USER',
        SYSTIMESTAMP - INTERVAL '200' DAY(3), SYSTIMESTAMP - INTERVAL '2' DAY(3));
-- 3. 이수연 (충성 고객)
INSERT INTO members (email, password, name, phone, address, status, role, created_at, updated_at)
VALUES ('lee@test.com', '$2a$10$N.zmdr9zkAMok.yGHhwCcePeaXKiLnEE.pL9RN5S2XZG2O6ZT8/Sq',
        '이수연', '010-2345-6789', '경기도 성남시 분당구 판교로 234', 'ACTIVE', 'USER',
        SYSTIMESTAMP - INTERVAL '150' DAY(3), SYSTIMESTAMP - INTERVAL '5' DAY(3));
-- 4. 박지호 (신규 고객)
INSERT INTO members (email, password, name, phone, address, status, role, created_at, updated_at)
VALUES ('park@test.com', '$2a$10$N.zmdr9zkAMok.yGHhwCcePeaXKiLnEE.pL9RN5S2XZG2O6ZT8/Sq',
        '박지호', '010-3456-7890', '부산시 해운대구 달맞이길 45', 'ACTIVE', 'USER',
        SYSTIMESTAMP - INTERVAL '7' DAY(3), SYSTIMESTAMP - INTERVAL '1' DAY(3));
-- 5. 최현아 (위험 고객 - 마지막 구매 180일 전)
INSERT INTO members (email, password, name, phone, address, status, role, created_at, updated_at)
VALUES ('choi@test.com', '$2a$10$N.zmdr9zkAMok.yGHhwCcePeaXKiLnEE.pL9RN5S2XZG2O6ZT8/Sq',
        '최현아', '010-4567-8901', '인천시 남동구 논현동 678', 'ACTIVE', 'USER',
        SYSTIMESTAMP - INTERVAL '300' DAY(3), SYSTIMESTAMP - INTERVAL '180' DAY(3));
-- 6. 정도윤 (잠재 충성 고객)
INSERT INTO members (email, password, name, phone, address, status, role, created_at, updated_at)
VALUES ('jung@test.com', '$2a$10$N.zmdr9zkAMok.yGHhwCcePeaXKiLnEE.pL9RN5S2XZG2O6ZT8/Sq',
        '정도윤', '010-5678-9012', '대구시 중구 동성로 12', 'ACTIVE', 'USER',
        SYSTIMESTAMP - INTERVAL '120' DAY(3), SYSTIMESTAMP - INTERVAL '30' DAY(3));
-- 7. 한소희 (잠재 고객)
INSERT INTO members (email, password, name, phone, address, status, role, created_at, updated_at)
VALUES ('han@test.com', '$2a$10$N.zmdr9zkAMok.yGHhwCcePeaXKiLnEE.pL9RN5S2XZG2O6ZT8/Sq',
        '한소희', '010-6789-0123', '광주시 서구 상무대로 89', 'ACTIVE', 'USER',
        SYSTIMESTAMP - INTERVAL '90' DAY(3), SYSTIMESTAMP - INTERVAL '3' DAY(3));
-- 8. 오태양 (이탈 고객 - 마지막 구매 200일 전)
INSERT INTO members (email, password, name, phone, address, status, role, created_at, updated_at)
VALUES ('oh@test.com', '$2a$10$N.zmdr9zkAMok.yGHhwCcePeaXKiLnEE.pL9RN5S2XZG2O6ZT8/Sq',
        '오태양', '010-7890-1234', '대전시 유성구 대학로 99', 'ACTIVE', 'USER',
        SYSTIMESTAMP - INTERVAL '250' DAY(3), SYSTIMESTAMP - INTERVAL '200' DAY(3));
-- 9. 신유나 (챔피언 고객 - 고가 구매)
INSERT INTO members (email, password, name, phone, address, status, role, created_at, updated_at)
VALUES ('shin@test.com', '$2a$10$N.zmdr9zkAMok.yGHhwCcePeaXKiLnEE.pL9RN5S2XZG2O6ZT8/Sq',
        '신유나', '010-8901-2345', '서울시 서초구 반포대로 321', 'ACTIVE', 'USER',
        SYSTIMESTAMP - INTERVAL '180' DAY(3), SYSTIMESTAMP - INTERVAL '7' DAY(3));
-- 10. 윤재원 (비활성 회원)
INSERT INTO members (email, password, name, phone, address, status, role, created_at, updated_at)
VALUES ('yoon@test.com', '$2a$10$N.zmdr9zkAMok.yGHhwCcePeaXKiLnEE.pL9RN5S2XZG2O6ZT8/Sq',
        '윤재원', '010-9012-3456', '경기도 수원시 영통구 월드컵로 456', 'INACTIVE', 'USER',
        SYSTIMESTAMP - INTERVAL '400' DAY(3), SYSTIMESTAMP - INTERVAL '365' DAY(3));

-- ========================================
-- 상품 (product_id: 1~25, 카테고리별 5개)
-- ========================================

-- 전자제품 (category_id=1, product_id: 1~5)
INSERT INTO products (category_id, name, price, stock_qty, description, status, created_at, updated_at)
VALUES (1, '삼성 갤럭시 S24 Ultra', 1350000, 50,
        '6.8인치 QHD+ Dynamic AMOLED, Exynos 2400, 200MP 카메라, S펜 내장, 5000mAh 배터리, 티타늄 그레이/블랙/바이올렛',
        'ON_SALE', SYSTIMESTAMP - INTERVAL '90' DAY(3), SYSTIMESTAMP - INTERVAL '1' DAY(3));

INSERT INTO products (category_id, name, price, stock_qty, description, status, created_at, updated_at)
VALUES (1, '애플 아이패드 Air 11인치 (M2)', 890000, 30,
        'Apple M2 칩, 11인치 Liquid Retina 디스플레이, 8GB RAM, 256GB 저장공간, Wi-Fi 6E, USB-C, 스페이스 그레이/스타라이트',
        'ON_SALE', SYSTIMESTAMP - INTERVAL '80' DAY(3), SYSTIMESTAMP - INTERVAL '2' DAY(3));

INSERT INTO products (category_id, name, price, stock_qty, description, status, created_at, updated_at)
VALUES (1, 'LG 그램 16 노트북 (2024)', 1590000, 20,
        'Intel Core Ultra 7 155H, 16인치 IPS 디스플레이 (WQXGA), 32GB LPDDR5, 1TB NVMe SSD, Windows 11 Home, 무게 1.19kg',
        'ON_SALE', SYSTIMESTAMP - INTERVAL '70' DAY(3), SYSTIMESTAMP - INTERVAL '3' DAY(3));

INSERT INTO products (category_id, name, price, stock_qty, description, status, created_at, updated_at)
VALUES (1, '애플 에어팟 Pro 2세대', 359000, 100,
        'H2 칩, 액티브 노이즈 캔슬링, 어댑티브 오디오, 투명 모드, MagSafe 충전 케이스, IP54 방수, 최대 30시간 재생',
        'ON_SALE', SYSTIMESTAMP - INTERVAL '60' DAY(3), SYSTIMESTAMP - INTERVAL '1' DAY(3));

INSERT INTO products (category_id, name, price, stock_qty, description, status, created_at, updated_at)
VALUES (1, '삼성 오디세이 G5 27인치 커브드', 489000, 25,
        '27인치 QHD(2560x1440) 커브드(1000R) VA 패널, 165Hz, 1ms GTG, HDR10, AMD FreeSync Premium, DisplayPort 1.2, HDMI 2.0 x2',
        'ON_SALE', SYSTIMESTAMP - INTERVAL '50' DAY(3), SYSTIMESTAMP - INTERVAL '5' DAY(3));

-- 패션의류 (category_id=2, product_id: 6~10)
INSERT INTO products (category_id, name, price, stock_qty, description, status, created_at, updated_at)
VALUES (2, '남성 슬림핏 옥스퍼드 셔츠', 45000, 200,
        '코튼 100% 고밀도 옥스퍼드 원단, 슬림핏 실루엣, 버튼다운 칼라, 화이트/블루/네이비/핑크, S~XXL, 드라이클리닝 가능',
        'ON_SALE', SYSTIMESTAMP - INTERVAL '120' DAY(3), SYSTIMESTAMP - INTERVAL '10' DAY(3));

INSERT INTO products (category_id, name, price, stock_qty, description, status, created_at, updated_at)
VALUES (2, '여성 플리츠 미디 원피스', 78000, 150,
        '쉬폰 100% 플리츠 원피스, 미디 기장(무릎 아래 10cm), 허리 벨트 포함, 블랙/아이보리/차콜/로즈, S~2XL',
        'ON_SALE', SYSTIMESTAMP - INTERVAL '110' DAY(3), SYSTIMESTAMP - INTERVAL '8' DAY(3));

INSERT INTO products (category_id, name, price, stock_qty, description, status, created_at, updated_at)
VALUES (2, '유니섹스 슬림핏 청바지', 65000, 180,
        '스트레치 데님 99% 코튼 1% 스판, 슬림핏, 미드라이즈, 5포켓 디자인, 인디고 블루/블랙/그레이 워싱, 허리 25~36인치',
        'ON_SALE', SYSTIMESTAMP - INTERVAL '100' DAY(3), SYSTIMESTAMP - INTERVAL '7' DAY(3));

INSERT INTO products (category_id, name, price, stock_qty, description, status, created_at, updated_at)
VALUES (2, '남성 구스다운 패딩 점퍼', 189000, 80,
        '구스다운 90% 충전재, 방풍·방수 코팅 나일론 원단, 탈부착 후드, 스탠드 칼라, 허리 조임끈, 블랙/카키/네이비, M~3XL',
        'ON_SALE', SYSTIMESTAMP - INTERVAL '95' DAY(3), SYSTIMESTAMP - INTERVAL '6' DAY(3));

INSERT INTO products (category_id, name, price, stock_qty, description, status, created_at, updated_at)
VALUES (2, '나이키 에어맥스 270 스니커즈', 139000, 60,
        'Nike Air Max 270, 270도 Air 유닛, 엔지니어드 메시 어퍼, 포옴 미드솔, 러버 아웃솔, 블랙/화이트/레드, 220~290mm',
        'ON_SALE', SYSTIMESTAMP - INTERVAL '85' DAY(3), SYSTIMESTAMP - INTERVAL '4' DAY(3));

-- 식품/음료 (category_id=3, product_id: 11~15)
INSERT INTO products (category_id, name, price, stock_qty, description, status, created_at, updated_at)
VALUES (3, '제주 한라봉 5kg', 35000, 500,
        '제주도 산지직송 한라봉 5kg (대과 15~20개), 당도 13브릭스 이상 보장, 무농약 인증, 비타민C 풍부, 수확 후 3일 이내 발송',
        'ON_SALE', SYSTIMESTAMP - INTERVAL '30' DAY(3), SYSTIMESTAMP - INTERVAL '1' DAY(3));

INSERT INTO products (category_id, name, price, stock_qty, description, status, created_at, updated_at)
VALUES (3, '노르웨이 자연산 연어 1kg', 28000, 200,
        '노르웨이 피오르드 자연산 냉동 연어 필렛 1kg, 오메가3·DHA 풍부, 당일 급속냉동, 진공포장, 아이스박스 동봉 배송',
        'ON_SALE', SYSTIMESTAMP - INTERVAL '20' DAY(3), SYSTIMESTAMP - INTERVAL '2' DAY(3));

INSERT INTO products (category_id, name, price, stock_qty, description, status, created_at, updated_at)
VALUES (3, '통곡물 그래놀라 1kg', 18000, 300,
        '롤드 오트, 아몬드·호두·캐슈너트, 크랜베리·건포도 혼합 1kg, 무설탕·무방부제, 글루텐프리 인증, 아침 대용식',
        'ON_SALE', SYSTIMESTAMP - INTERVAL '25' DAY(3), SYSTIMESTAMP - INTERVAL '3' DAY(3));

INSERT INTO products (category_id, name, price, stock_qty, description, status, created_at, updated_at)
VALUES (3, '에티오피아 예가체프 원두 200g', 22000, 150,
        '에티오피아 예가체프 G1 스페셜티 커피 200g, 워시드 프로세싱, 자스민·베르가못 향, 산미와 단맛 밸런스, 미디엄 로스팅, 로스팅 후 3일 이내 발송',
        'ON_SALE', SYSTIMESTAMP - INTERVAL '15' DAY(3), SYSTIMESTAMP - INTERVAL '1' DAY(3));

INSERT INTO products (category_id, name, price, stock_qty, description, status, created_at, updated_at)
VALUES (3, '유기농 저지방 우유 1L x6입', 15000, 400,
        '유기농 인증 저지방 우유 1L 6개 세트, 무항생제·동물복지 인증, 지방 1.0%, 국내산 원유 100%, 냉장 배송 (아이스팩 포함)',
        'ON_SALE', SYSTIMESTAMP - INTERVAL '10' DAY(3), SYSTIMESTAMP - INTERVAL '1' DAY(3));

-- 가구/인테리어 (category_id=4, product_id: 16~20)
INSERT INTO products (category_id, name, price, stock_qty, description, status, created_at, updated_at)
VALUES (4, '원목 1인용 컴퓨터 책상', 235000, 40,
        '참나무 집성목 상판 (두께 25mm), 파우더코팅 철제 다리, 크기 1200x600x750mm, 모니터 받침대 일체형, 케이블 홀 포함, 내추럴/월넛',
        'ON_SALE', SYSTIMESTAMP - INTERVAL '150' DAY(3), SYSTIMESTAMP - INTERVAL '10' DAY(3));

INSERT INTO products (category_id, name, price, stock_qty, description, status, created_at, updated_at)
VALUES (4, '3인용 패브릭 소파', 589000, 15,
        '벨벳 패브릭 커버 (세탁 가능), 고탄성 독립 스프링, 3인용 2200mm, 메모리폼 쿠션, 원목 다리, 그레이/베이지/머스타드/딥블루',
        'ON_SALE', SYSTIMESTAMP - INTERVAL '140' DAY(3), SYSTIMESTAMP - INTERVAL '14' DAY(3));

INSERT INTO products (category_id, name, price, stock_qty, description, status, created_at, updated_at)
VALUES (4, '북유럽 LED 플로어 스탠드', 89000, 60,
        '북유럽 미드센츄리 스타일, LED 4500K 자연광, 3단 밝기 터치 조광, 골드/블랙 황동 프레임, 높이 150cm, 360도 회전 헤드',
        'ON_SALE', SYSTIMESTAMP - INTERVAL '130' DAY(3), SYSTIMESTAMP - INTERVAL '12' DAY(3));

INSERT INTO products (category_id, name, price, stock_qty, description, status, created_at, updated_at)
VALUES (4, '벽걸이 수납 선반 세트 (5단)', 45000, 120,
        '월넛 무늬목 선반 5단 세트, 벽 고정 앙카 포함, 각 선반 600x200mm, 선반 간격 조절 가능, 최대 10kg 적재, 무드우드 컬러',
        'ON_SALE', SYSTIMESTAMP - INTERVAL '120' DAY(3), SYSTIMESTAMP - INTERVAL '11' DAY(3));

INSERT INTO products (category_id, name, price, stock_qty, description, status, created_at, updated_at)
VALUES (4, '퀸사이즈 침대 프레임', 389000, 20,
        '파인 원목 퀸 침대 프레임 (매트리스 미포함), 사이드 서랍 2개, 헤드보드 패브릭 쿠션, 슬레이트 방식, 화이트/내추럴 오크, 1600x2100mm',
        'ON_SALE', SYSTIMESTAMP - INTERVAL '110' DAY(3), SYSTIMESTAMP - INTERVAL '9' DAY(3));

-- 도서 (category_id=5, product_id: 21~25)
INSERT INTO products (category_id, name, price, stock_qty, description, status, created_at, updated_at)
VALUES (5, '클린 코드 (Clean Code)', 33000, 300,
        'Robert C. Martin 저 / 박재호·이해영 역, 인사이트, 2013, 464p. 애자일 소프트웨어 장인 정신 - 읽기 좋은 코드를 작성하는 법에 대한 필독서',
        'ON_SALE', SYSTIMESTAMP - INTERVAL '200' DAY(3), SYSTIMESTAMP - INTERVAL '20' DAY(3));

INSERT INTO products (category_id, name, price, stock_qty, description, status, created_at, updated_at)
VALUES (5, '파친코 (Pachinko)', 18000, 200,
        '이민진 저 / 신승미 역, 인플루엔셜, 2022, 700p. 재일교포 4세대의 파란만장한 이야기, 애플TV+ 드라마 원작 소설, 뉴욕타임스 베스트셀러',
        'ON_SALE', SYSTIMESTAMP - INTERVAL '190' DAY(3), SYSTIMESTAMP - INTERVAL '18' DAY(3));

INSERT INTO products (category_id, name, price, stock_qty, description, status, created_at, updated_at)
VALUES (5, '어린 왕자 (특별 일러스트판)', 12000, 500,
        '생텍쥐페리 저 / 황현산 역, 열린책들, 2015, 128p. 오리지널 수채화 일러스트 전수록, 황현산 시인 완역본, 케이스 포함 양장 특별판',
        'ON_SALE', SYSTIMESTAMP - INTERVAL '180' DAY(3), SYSTIMESTAMP - INTERVAL '15' DAY(3));

INSERT INTO products (category_id, name, price, stock_qty, description, status, created_at, updated_at)
VALUES (5, '해리포터 전집 (1~7권 박스 세트)', 95000, 100,
        'J.K. 롤링 저 / 강동혁 역, 문학수첩, 2023 개정판. 1~7권 박스 세트, 새로운 번역 완결판, 원서 기준 표지 디자인, 독점 삽화 수록',
        'ON_SALE', SYSTIMESTAMP - INTERVAL '170' DAY(3), SYSTIMESTAMP - INTERVAL '12' DAY(3));

INSERT INTO products (category_id, name, price, stock_qty, description, status, created_at, updated_at)
VALUES (5, '사피엔스 (Sapiens)', 22000, 250,
        '유발 하라리 저 / 조현욱 역, 김영사, 2015, 636p. 인류의 역사를 빅히스토리 관점에서 분석한 세계적 베스트셀러, 전 세계 65개국 번역 출판',
        'ON_SALE', SYSTIMESTAMP - INTERVAL '160' DAY(3), SYSTIMESTAMP - INTERVAL '10' DAY(3));

-- ========================================
-- 장바구니 (cart_id: 1~5)
-- ========================================
INSERT INTO carts (member_id, created_at, updated_at) VALUES (2, SYSTIMESTAMP - INTERVAL '60' DAY(3), SYSTIMESTAMP - INTERVAL '1' DAY(3));
INSERT INTO carts (member_id, created_at, updated_at) VALUES (3, SYSTIMESTAMP - INTERVAL '30' DAY(3), SYSTIMESTAMP - INTERVAL '2' DAY(3));
INSERT INTO carts (member_id, created_at, updated_at) VALUES (4, SYSTIMESTAMP - INTERVAL '5' DAY(3),  SYSTIMESTAMP - INTERVAL '1' DAY(3));
INSERT INTO carts (member_id, created_at, updated_at) VALUES (6, SYSTIMESTAMP - INTERVAL '20' DAY(3), SYSTIMESTAMP - INTERVAL '3' DAY(3));
INSERT INTO carts (member_id, created_at, updated_at) VALUES (7, SYSTIMESTAMP - INTERVAL '10' DAY(3), SYSTIMESTAMP - INTERVAL '1' DAY(3));

-- 장바구니 상품
-- cart 1 (kim): 갤럭시 S24 Ultra + 에어팟 Pro
INSERT INTO cart_items (cart_id, product_id, quantity, created_at, updated_at) VALUES (1, 1, 1, SYSTIMESTAMP - INTERVAL '2' DAY(3),  SYSTIMESTAMP - INTERVAL '2' DAY(3));
INSERT INTO cart_items (cart_id, product_id, quantity, created_at, updated_at) VALUES (1, 4, 2, SYSTIMESTAMP - INTERVAL '1' DAY(3),  SYSTIMESTAMP - INTERVAL '1' DAY(3));
-- cart 2 (lee): 청바지 + 패딩 점퍼
INSERT INTO cart_items (cart_id, product_id, quantity, created_at, updated_at) VALUES (2, 8, 1, SYSTIMESTAMP - INTERVAL '5' DAY(3),  SYSTIMESTAMP - INTERVAL '5' DAY(3));
INSERT INTO cart_items (cart_id, product_id, quantity, created_at, updated_at) VALUES (2, 9, 1, SYSTIMESTAMP - INTERVAL '3' DAY(3),  SYSTIMESTAMP - INTERVAL '3' DAY(3));
-- cart 3 (park): 3인용 소파
INSERT INTO cart_items (cart_id, product_id, quantity, created_at, updated_at) VALUES (3, 17, 1, SYSTIMESTAMP - INTERVAL '3' DAY(3),  SYSTIMESTAMP - INTERVAL '3' DAY(3));
-- cart 4 (jung): 클린 코드 + 사피엔스
INSERT INTO cart_items (cart_id, product_id, quantity, created_at, updated_at) VALUES (4, 21, 1, SYSTIMESTAMP - INTERVAL '4' DAY(3),  SYSTIMESTAMP - INTERVAL '4' DAY(3));
INSERT INTO cart_items (cart_id, product_id, quantity, created_at, updated_at) VALUES (4, 25, 1, SYSTIMESTAMP - INTERVAL '2' DAY(3),  SYSTIMESTAMP - INTERVAL '2' DAY(3));
-- cart 5 (han): 제주 한라봉 2개
INSERT INTO cart_items (cart_id, product_id, quantity, created_at, updated_at) VALUES (5, 11, 2, SYSTIMESTAMP - INTERVAL '1' DAY(3),  SYSTIMESTAMP - INTERVAL '1' DAY(3));

-- ========================================
-- 주문 (order_id: 1~15)
-- ========================================
-- 1. kim - DELIVERED (60일 전): 갤럭시 S24 Ultra 1개 → 1,350,000
INSERT INTO orders (member_id, total_price, status, delivery_addr, payment_method, created_at, updated_at)
VALUES (2, 1350000, 'DELIVERED', '서울시 강남구 테헤란로 123', 'CARD',
        SYSTIMESTAMP - INTERVAL '60' DAY(3), SYSTIMESTAMP - INTERVAL '55' DAY(3));
-- 2. kim - DELIVERED (90일 전): 에어팟 Pro 2개 + 오디세이 모니터 1개 → 1,207,000
INSERT INTO orders (member_id, total_price, status, delivery_addr, payment_method, created_at, updated_at)
VALUES (2, 1207000, 'DELIVERED', '서울시 강남구 테헤란로 123', 'CARD',
        SYSTIMESTAMP - INTERVAL '90' DAY(3), SYSTIMESTAMP - INTERVAL '85' DAY(3));
-- 3. lee - DELIVERED (45일 전): 청바지 1개 + 패딩 점퍼 1개 → 254,000
INSERT INTO orders (member_id, total_price, status, delivery_addr, payment_method, created_at, updated_at)
VALUES (3, 254000, 'DELIVERED', '경기도 성남시 분당구 판교로 234', 'KAKAO_PAY',
        SYSTIMESTAMP - INTERVAL '45' DAY(3), SYSTIMESTAMP - INTERVAL '40' DAY(3));
-- 4. lee - SHIPPED (5일 전): 원목 책상 1개 → 235,000
INSERT INTO orders (member_id, total_price, status, delivery_addr, payment_method, created_at, updated_at)
VALUES (3, 235000, 'SHIPPED', '경기도 성남시 분당구 판교로 234', 'CARD',
        SYSTIMESTAMP - INTERVAL '5' DAY(3), SYSTIMESTAMP - INTERVAL '3' DAY(3));
-- 5. park - PENDING (1일 전): 3인용 소파 1개 → 589,000
INSERT INTO orders (member_id, total_price, status, delivery_addr, payment_method, created_at, updated_at)
VALUES (4, 589000, 'PENDING', '부산시 해운대구 달맞이길 45', 'NAVER_PAY',
        SYSTIMESTAMP - INTERVAL '1' DAY(3), SYSTIMESTAMP - INTERVAL '1' DAY(3));
-- 6. choi - DELIVERED (180일 전): 파친코 + 클린 코드 → 51,000
INSERT INTO orders (member_id, total_price, status, delivery_addr, payment_method, created_at, updated_at)
VALUES (5, 51000, 'DELIVERED', '인천시 남동구 논현동 678', 'CARD',
        SYSTIMESTAMP - INTERVAL '180' DAY(3), SYSTIMESTAMP - INTERVAL '175' DAY(3));
-- 7. choi - CANCELLED (150일 전): 스니커즈 → 139,000
INSERT INTO orders (member_id, total_price, status, delivery_addr, payment_method, created_at, updated_at)
VALUES (5, 139000, 'CANCELLED', '인천시 남동구 논현동 678', 'CARD',
        SYSTIMESTAMP - INTERVAL '150' DAY(3), SYSTIMESTAMP - INTERVAL '148' DAY(3));
-- 8. jung - DELIVERED (90일 전): 제주 한라봉 2개 + 에티오피아 원두 → 92,000
INSERT INTO orders (member_id, total_price, status, delivery_addr, payment_method, created_at, updated_at)
VALUES (6, 92000, 'DELIVERED', '대구시 중구 동성로 12', 'KAKAO_PAY',
        SYSTIMESTAMP - INTERVAL '90' DAY(3), SYSTIMESTAMP - INTERVAL '85' DAY(3));
-- 9. jung - DELIVERED (60일 전): 원목 책상 + LED 스탠드 → 324,000
INSERT INTO orders (member_id, total_price, status, delivery_addr, payment_method, created_at, updated_at)
VALUES (6, 324000, 'DELIVERED', '대구시 중구 동성로 12', 'CARD',
        SYSTIMESTAMP - INTERVAL '60' DAY(3), SYSTIMESTAMP - INTERVAL '55' DAY(3));
-- 10. han - PAID (3일 전): 아이패드 Air → 890,000
INSERT INTO orders (member_id, total_price, status, delivery_addr, payment_method, created_at, updated_at)
VALUES (7, 890000, 'PAID', '광주시 서구 상무대로 89', 'CARD',
        SYSTIMESTAMP - INTERVAL '3' DAY(3), SYSTIMESTAMP - INTERVAL '3' DAY(3));
-- 11. oh - DELIVERED (120일 전): 사피엔스 + 어린 왕자 2권 → 46,000
INSERT INTO orders (member_id, total_price, status, delivery_addr, payment_method, created_at, updated_at)
VALUES (8, 46000, 'DELIVERED', '대전시 유성구 대학로 99', 'NAVER_PAY',
        SYSTIMESTAMP - INTERVAL '120' DAY(3), SYSTIMESTAMP - INTERVAL '115' DAY(3));
-- 12. shin - DELIVERED (30일 전): LG 그램 노트북 → 1,590,000
INSERT INTO orders (member_id, total_price, status, delivery_addr, payment_method, created_at, updated_at)
VALUES (9, 1590000, 'DELIVERED', '서울시 서초구 반포대로 321', 'CARD',
        SYSTIMESTAMP - INTERVAL '30' DAY(3), SYSTIMESTAMP - INTERVAL '25' DAY(3));
-- 13. shin - SHIPPED (7일 전): 남성 셔츠 3개 → 135,000
INSERT INTO orders (member_id, total_price, status, delivery_addr, payment_method, created_at, updated_at)
VALUES (9, 135000, 'SHIPPED', '서울시 서초구 반포대로 321', 'KAKAO_PAY',
        SYSTIMESTAMP - INTERVAL '7' DAY(3), SYSTIMESTAMP - INTERVAL '5' DAY(3));
-- 14. yoon - CANCELLED (30일 전): 여성 원피스 → 78,000
INSERT INTO orders (member_id, total_price, status, delivery_addr, payment_method, created_at, updated_at)
VALUES (10, 78000, 'CANCELLED', '경기도 수원시 영통구 월드컵로 456', 'CARD',
        SYSTIMESTAMP - INTERVAL '30' DAY(3), SYSTIMESTAMP - INTERVAL '28' DAY(3));
-- 15. kim - PAID (2일 전): 퀸 침대 프레임 → 389,000
INSERT INTO orders (member_id, total_price, status, delivery_addr, payment_method, created_at, updated_at)
VALUES (2, 389000, 'PAID', '서울시 강남구 테헤란로 123', 'CARD',
        SYSTIMESTAMP - INTERVAL '2' DAY(3), SYSTIMESTAMP - INTERVAL '2' DAY(3));

-- ========================================
-- 주문 상품
-- ========================================
-- 주문 1 (kim, DELIVERED): 갤럭시 S24 Ultra × 1
INSERT INTO order_items (order_id, product_id, quantity, unit_price, created_at, updated_at)
VALUES (1, 1, 1, 1350000, SYSTIMESTAMP - INTERVAL '60' DAY(3), SYSTIMESTAMP - INTERVAL '60' DAY(3));
-- 주문 2 (kim, DELIVERED): 에어팟 Pro × 2, 오디세이 모니터 × 1
INSERT INTO order_items (order_id, product_id, quantity, unit_price, created_at, updated_at)
VALUES (2, 4, 2, 359000, SYSTIMESTAMP - INTERVAL '90' DAY(3), SYSTIMESTAMP - INTERVAL '90' DAY(3));
INSERT INTO order_items (order_id, product_id, quantity, unit_price, created_at, updated_at)
VALUES (2, 5, 1, 489000, SYSTIMESTAMP - INTERVAL '90' DAY(3), SYSTIMESTAMP - INTERVAL '90' DAY(3));
-- 주문 3 (lee, DELIVERED): 청바지 × 1, 패딩 점퍼 × 1
INSERT INTO order_items (order_id, product_id, quantity, unit_price, created_at, updated_at)
VALUES (3, 8, 1, 65000,  SYSTIMESTAMP - INTERVAL '45' DAY(3), SYSTIMESTAMP - INTERVAL '45' DAY(3));
INSERT INTO order_items (order_id, product_id, quantity, unit_price, created_at, updated_at)
VALUES (3, 9, 1, 189000, SYSTIMESTAMP - INTERVAL '45' DAY(3), SYSTIMESTAMP - INTERVAL '45' DAY(3));
-- 주문 4 (lee, SHIPPED): 원목 책상 × 1
INSERT INTO order_items (order_id, product_id, quantity, unit_price, created_at, updated_at)
VALUES (4, 16, 1, 235000, SYSTIMESTAMP - INTERVAL '5' DAY(3), SYSTIMESTAMP - INTERVAL '5' DAY(3));
-- 주문 5 (park, PENDING): 3인용 소파 × 1
INSERT INTO order_items (order_id, product_id, quantity, unit_price, created_at, updated_at)
VALUES (5, 17, 1, 589000, SYSTIMESTAMP - INTERVAL '1' DAY(3), SYSTIMESTAMP - INTERVAL '1' DAY(3));
-- 주문 6 (choi, DELIVERED): 파친코 × 1, 클린 코드 × 1
INSERT INTO order_items (order_id, product_id, quantity, unit_price, created_at, updated_at)
VALUES (6, 22, 1, 18000, SYSTIMESTAMP - INTERVAL '180' DAY(3), SYSTIMESTAMP - INTERVAL '180' DAY(3));
INSERT INTO order_items (order_id, product_id, quantity, unit_price, created_at, updated_at)
VALUES (6, 21, 1, 33000, SYSTIMESTAMP - INTERVAL '180' DAY(3), SYSTIMESTAMP - INTERVAL '180' DAY(3));
-- 주문 7 (choi, CANCELLED): 에어맥스 스니커즈 × 1
INSERT INTO order_items (order_id, product_id, quantity, unit_price, created_at, updated_at)
VALUES (7, 10, 1, 139000, SYSTIMESTAMP - INTERVAL '150' DAY(3), SYSTIMESTAMP - INTERVAL '150' DAY(3));
-- 주문 8 (jung, DELIVERED): 제주 한라봉 × 2, 에티오피아 원두 × 1
INSERT INTO order_items (order_id, product_id, quantity, unit_price, created_at, updated_at)
VALUES (8, 11, 2, 35000, SYSTIMESTAMP - INTERVAL '90' DAY(3), SYSTIMESTAMP - INTERVAL '90' DAY(3));
INSERT INTO order_items (order_id, product_id, quantity, unit_price, created_at, updated_at)
VALUES (8, 14, 1, 22000, SYSTIMESTAMP - INTERVAL '90' DAY(3), SYSTIMESTAMP - INTERVAL '90' DAY(3));
-- 주문 9 (jung, DELIVERED): 원목 책상 × 1, LED 스탠드 × 1
INSERT INTO order_items (order_id, product_id, quantity, unit_price, created_at, updated_at)
VALUES (9, 16, 1, 235000, SYSTIMESTAMP - INTERVAL '60' DAY(3), SYSTIMESTAMP - INTERVAL '60' DAY(3));
INSERT INTO order_items (order_id, product_id, quantity, unit_price, created_at, updated_at)
VALUES (9, 18, 1,  89000, SYSTIMESTAMP - INTERVAL '60' DAY(3), SYSTIMESTAMP - INTERVAL '60' DAY(3));
-- 주문 10 (han, PAID): 아이패드 Air × 1
INSERT INTO order_items (order_id, product_id, quantity, unit_price, created_at, updated_at)
VALUES (10, 2, 1, 890000, SYSTIMESTAMP - INTERVAL '3' DAY(3), SYSTIMESTAMP - INTERVAL '3' DAY(3));
-- 주문 11 (oh, DELIVERED): 사피엔스 × 1, 어린 왕자 × 2
INSERT INTO order_items (order_id, product_id, quantity, unit_price, created_at, updated_at)
VALUES (11, 25, 1, 22000, SYSTIMESTAMP - INTERVAL '120' DAY(3), SYSTIMESTAMP - INTERVAL '120' DAY(3));
INSERT INTO order_items (order_id, product_id, quantity, unit_price, created_at, updated_at)
VALUES (11, 23, 2, 12000, SYSTIMESTAMP - INTERVAL '120' DAY(3), SYSTIMESTAMP - INTERVAL '120' DAY(3));
-- 주문 12 (shin, DELIVERED): LG 그램 노트북 × 1
INSERT INTO order_items (order_id, product_id, quantity, unit_price, created_at, updated_at)
VALUES (12, 3, 1, 1590000, SYSTIMESTAMP - INTERVAL '30' DAY(3), SYSTIMESTAMP - INTERVAL '30' DAY(3));
-- 주문 13 (shin, SHIPPED): 남성 셔츠 × 3
INSERT INTO order_items (order_id, product_id, quantity, unit_price, created_at, updated_at)
VALUES (13, 6, 3, 45000, SYSTIMESTAMP - INTERVAL '7' DAY(3), SYSTIMESTAMP - INTERVAL '7' DAY(3));
-- 주문 14 (yoon, CANCELLED): 여성 원피스 × 1
INSERT INTO order_items (order_id, product_id, quantity, unit_price, created_at, updated_at)
VALUES (14, 7, 1, 78000, SYSTIMESTAMP - INTERVAL '30' DAY(3), SYSTIMESTAMP - INTERVAL '30' DAY(3));
-- 주문 15 (kim, PAID): 퀸 침대 프레임 × 1
INSERT INTO order_items (order_id, product_id, quantity, unit_price, created_at, updated_at)
VALUES (15, 20, 1, 389000, SYSTIMESTAMP - INTERVAL '2' DAY(3), SYSTIMESTAMP - INTERVAL '2' DAY(3));

-- ========================================
-- 리뷰 (DELIVERED 주문 회원만 작성 가능)
-- ========================================
-- kim: 갤럭시 S24 Ultra (주문 1)
INSERT INTO reviews (member_id, product_id, rating, content, created_at, updated_at)
VALUES (2, 1, 5, 'S펜이 정말 편리하고 카메라 화질이 뛰어납니다. 배터리도 하루 종일 충분하고 무게도 생각보다 가볍네요. 강력 추천!',
        SYSTIMESTAMP - INTERVAL '50' DAY(3), SYSTIMESTAMP - INTERVAL '50' DAY(3));
-- kim: 에어팟 Pro 2세대 (주문 2)
INSERT INTO reviews (member_id, product_id, rating, content, created_at, updated_at)
VALUES (2, 4, 4, '노이즈 캔슬링 성능이 확실히 좋습니다. 통화 품질도 선명하고 착용감도 안정적이에요. 다만 가격이 조금 부담스럽긴 합니다.',
        SYSTIMESTAMP - INTERVAL '80' DAY(3), SYSTIMESTAMP - INTERVAL '80' DAY(3));
-- kim: 오디세이 모니터 (주문 2)
INSERT INTO reviews (member_id, product_id, rating, content, created_at, updated_at)
VALUES (2, 5, 4, '게임용으로 구매했는데 165Hz 체감이 확실합니다. 커브드라 몰입감도 좋고, QHD 해상도도 선명해요. 가성비 좋은 게이밍 모니터!',
        SYSTIMESTAMP - INTERVAL '79' DAY(3), SYSTIMESTAMP - INTERVAL '79' DAY(3));
-- lee: 청바지 (주문 3)
INSERT INTO reviews (member_id, product_id, rating, content, created_at, updated_at)
VALUES (3, 8, 3, '핏 자체는 예쁜데 세탁 후 약간 줄었습니다. 다음엔 한 치수 위를 구매할 것 같아요. 색상은 사진과 동일해서 좋았습니다.',
        SYSTIMESTAMP - INTERVAL '38' DAY(3), SYSTIMESTAMP - INTERVAL '38' DAY(3));
-- lee: 패딩 점퍼 (주문 3)
INSERT INTO reviews (member_id, product_id, rating, content, created_at, updated_at)
VALUES (3, 9, 5, '따뜻함이 정말 훌륭합니다! 영하 날씨에도 거뜬하고 디자인도 세련됐어요. 충전재가 꽉 차 있어서 두께도 적당합니다.',
        SYSTIMESTAMP - INTERVAL '37' DAY(3), SYSTIMESTAMP - INTERVAL '37' DAY(3));
-- choi: 파친코 (주문 6)
INSERT INTO reviews (member_id, product_id, rating, content, created_at, updated_at)
VALUES (5, 22, 5, '드라마를 보고 원작이 궁금해서 구매했는데 훨씬 더 깊고 풍성한 이야기가 있었어요. 번역도 자연스럽고 강력 추천합니다!',
        SYSTIMESTAMP - INTERVAL '170' DAY(3), SYSTIMESTAMP - INTERVAL '170' DAY(3));
-- choi: 클린 코드 (주문 6)
INSERT INTO reviews (member_id, product_id, rating, content, created_at, updated_at)
VALUES (5, 21, 4, '개발자 필독서입니다. 다소 오래된 예제도 있지만 코드를 작성하는 마인드셋과 원칙에 큰 도움이 됩니다. 주니어 개발자에게 추천.',
        SYSTIMESTAMP - INTERVAL '169' DAY(3), SYSTIMESTAMP - INTERVAL '169' DAY(3));
-- jung: 제주 한라봉 (주문 8)
INSERT INTO reviews (member_id, product_id, rating, content, created_at, updated_at)
VALUES (6, 11, 4, '당도가 정말 높고 신선하게 왔습니다. 포장도 꼼꼼하게 에어캡으로 잘 되어 있었어요. 알이 크고 과즙이 풍부해서 만족스럽습니다.',
        SYSTIMESTAMP - INTERVAL '82' DAY(3), SYSTIMESTAMP - INTERVAL '82' DAY(3));
-- jung: 원목 책상 (주문 9)
INSERT INTO reviews (member_id, product_id, rating, content, created_at, updated_at)
VALUES (6, 16, 5, '원목 질감이 정말 고급스럽습니다. 조립도 설명서가 상세해서 어렵지 않았어요. 모니터 받침이 일체형이라 공간 활용도 훌륭합니다!',
        SYSTIMESTAMP - INTERVAL '52' DAY(3), SYSTIMESTAMP - INTERVAL '52' DAY(3));
-- oh: 사피엔스 (주문 11)
INSERT INTO reviews (member_id, product_id, rating, content, created_at, updated_at)
VALUES (8, 25, 4, '인류사를 거시적 관점으로 서술한 탁월한 책입니다. 일부 주관적 해석이 있어 그대로 받아들이기보단 비판적으로 읽는 것을 추천.',
        SYSTIMESTAMP - INTERVAL '110' DAY(3), SYSTIMESTAMP - INTERVAL '110' DAY(3));
-- oh: 어린 왕자 (주문 11)
INSERT INTO reviews (member_id, product_id, rating, content, created_at, updated_at)
VALUES (8, 23, 5, '특별판답게 삽화가 정말 아름답습니다. 선물용으로도 완벽하고, 황현산 번역이 원문 감성을 잘 살렸어요. 케이스도 고급스럽습니다.',
        SYSTIMESTAMP - INTERVAL '109' DAY(3), SYSTIMESTAMP - INTERVAL '109' DAY(3));
-- shin: LG 그램 노트북 (주문 12)
INSERT INTO reviews (member_id, product_id, rating, content, created_at, updated_at)
VALUES (9, 3, 5, '무게 대비 성능이 정말 뛰어납니다. 32GB RAM 덕분에 무거운 작업도 거뜬하고, 배터리도 하루 종일 버팁니다. 가격 이상의 가치!',
        SYSTIMESTAMP - INTERVAL '22' DAY(3), SYSTIMESTAMP - INTERVAL '22' DAY(3));

-- ========================================
-- 행동 로그 (VIEW, ADD_CART, PURCHASE, REVIEW)
-- member_id NULL = 비로그인 익명 사용자
-- ========================================

-- VIEW 로그 (상품 조회)
-- kim
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (2, 1, 'VIEW', 'sess_kim_001', SYSTIMESTAMP - INTERVAL '65' DAY(3), SYSTIMESTAMP - INTERVAL '65' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (2, 2, 'VIEW', 'sess_kim_001', SYSTIMESTAMP - INTERVAL '65' DAY(3), SYSTIMESTAMP - INTERVAL '65' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (2, 4, 'VIEW', 'sess_kim_002', SYSTIMESTAMP - INTERVAL '95' DAY(3), SYSTIMESTAMP - INTERVAL '95' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (2, 5, 'VIEW', 'sess_kim_002', SYSTIMESTAMP - INTERVAL '95' DAY(3), SYSTIMESTAMP - INTERVAL '95' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (2, 20,'VIEW', 'sess_kim_003', SYSTIMESTAMP - INTERVAL '3'  DAY, SYSTIMESTAMP - INTERVAL '3'  DAY);
-- lee
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (3, 8, 'VIEW', 'sess_lee_001', SYSTIMESTAMP - INTERVAL '50' DAY(3), SYSTIMESTAMP - INTERVAL '50' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (3, 9, 'VIEW', 'sess_lee_001', SYSTIMESTAMP - INTERVAL '50' DAY(3), SYSTIMESTAMP - INTERVAL '50' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (3, 16,'VIEW', 'sess_lee_002', SYSTIMESTAMP - INTERVAL '8'  DAY, SYSTIMESTAMP - INTERVAL '8'  DAY);
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (3, 17,'VIEW', 'sess_lee_003', SYSTIMESTAMP - INTERVAL '6'  DAY, SYSTIMESTAMP - INTERVAL '6'  DAY);
-- park
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (4, 17,'VIEW', 'sess_park_001', SYSTIMESTAMP - INTERVAL '4' DAY(3), SYSTIMESTAMP - INTERVAL '4' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (4, 20,'VIEW', 'sess_park_001', SYSTIMESTAMP - INTERVAL '4' DAY(3), SYSTIMESTAMP - INTERVAL '4' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (4, 16,'VIEW', 'sess_park_001', SYSTIMESTAMP - INTERVAL '3' DAY(3), SYSTIMESTAMP - INTERVAL '3' DAY(3));
-- choi
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (5, 21,'VIEW', 'sess_choi_001', SYSTIMESTAMP - INTERVAL '185' DAY(3), SYSTIMESTAMP - INTERVAL '185' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (5, 22,'VIEW', 'sess_choi_001', SYSTIMESTAMP - INTERVAL '185' DAY(3), SYSTIMESTAMP - INTERVAL '185' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (5, 10,'VIEW', 'sess_choi_002', SYSTIMESTAMP - INTERVAL '155' DAY(3), SYSTIMESTAMP - INTERVAL '155' DAY(3));
-- jung
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (6, 11,'VIEW', 'sess_jung_001', SYSTIMESTAMP - INTERVAL '95' DAY(3), SYSTIMESTAMP - INTERVAL '95' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (6, 14,'VIEW', 'sess_jung_001', SYSTIMESTAMP - INTERVAL '95' DAY(3), SYSTIMESTAMP - INTERVAL '95' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (6, 16,'VIEW', 'sess_jung_002', SYSTIMESTAMP - INTERVAL '65' DAY(3), SYSTIMESTAMP - INTERVAL '65' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (6, 18,'VIEW', 'sess_jung_002', SYSTIMESTAMP - INTERVAL '65' DAY(3), SYSTIMESTAMP - INTERVAL '65' DAY(3));
-- han
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (7, 2, 'VIEW', 'sess_han_001', SYSTIMESTAMP - INTERVAL '5' DAY(3), SYSTIMESTAMP - INTERVAL '5' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (7, 11,'VIEW', 'sess_han_001', SYSTIMESTAMP - INTERVAL '4' DAY(3), SYSTIMESTAMP - INTERVAL '4' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (7, 3, 'VIEW', 'sess_han_002', SYSTIMESTAMP - INTERVAL '2' DAY(3), SYSTIMESTAMP - INTERVAL '2' DAY(3));
-- oh
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (8, 25,'VIEW', 'sess_oh_001', SYSTIMESTAMP - INTERVAL '125' DAY(3), SYSTIMESTAMP - INTERVAL '125' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (8, 23,'VIEW', 'sess_oh_001', SYSTIMESTAMP - INTERVAL '125' DAY(3), SYSTIMESTAMP - INTERVAL '125' DAY(3));
-- shin
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (9, 3, 'VIEW', 'sess_shin_001', SYSTIMESTAMP - INTERVAL '35' DAY(3), SYSTIMESTAMP - INTERVAL '35' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (9, 1, 'VIEW', 'sess_shin_001', SYSTIMESTAMP - INTERVAL '35' DAY(3), SYSTIMESTAMP - INTERVAL '35' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (9, 6, 'VIEW', 'sess_shin_002', SYSTIMESTAMP - INTERVAL '9'  DAY, SYSTIMESTAMP - INTERVAL '9'  DAY);
-- 비로그인 익명 사용자 VIEW
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 1,  'VIEW', 'anon_aaa', SYSTIMESTAMP - INTERVAL '10' DAY(3), SYSTIMESTAMP - INTERVAL '10' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 3,  'VIEW', 'anon_aaa', SYSTIMESTAMP - INTERVAL '10' DAY(3), SYSTIMESTAMP - INTERVAL '10' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 17, 'VIEW', 'anon_bbb', SYSTIMESTAMP - INTERVAL '3'  DAY, SYSTIMESTAMP - INTERVAL '3'  DAY);
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 21, 'VIEW', 'anon_ccc', SYSTIMESTAMP - INTERVAL '2'  DAY, SYSTIMESTAMP - INTERVAL '2'  DAY);
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 11, 'VIEW', 'anon_ddd', SYSTIMESTAMP - INTERVAL '1'  DAY, SYSTIMESTAMP - INTERVAL '1'  DAY);
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (NULL, 5,  'VIEW', 'anon_eee', SYSTIMESTAMP,                      SYSTIMESTAMP);

-- ADD_CART 로그
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (2, 1,  'ADD_CART', 'sess_kim_001',  SYSTIMESTAMP - INTERVAL '64'  DAY, SYSTIMESTAMP - INTERVAL '64'  DAY);
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (2, 4,  'ADD_CART', 'sess_kim_002',  SYSTIMESTAMP - INTERVAL '94'  DAY, SYSTIMESTAMP - INTERVAL '94'  DAY);
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (2, 5,  'ADD_CART', 'sess_kim_002',  SYSTIMESTAMP - INTERVAL '94'  DAY, SYSTIMESTAMP - INTERVAL '94'  DAY);
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (3, 8,  'ADD_CART', 'sess_lee_001',  SYSTIMESTAMP - INTERVAL '49'  DAY, SYSTIMESTAMP - INTERVAL '49'  DAY);
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (3, 9,  'ADD_CART', 'sess_lee_001',  SYSTIMESTAMP - INTERVAL '49'  DAY, SYSTIMESTAMP - INTERVAL '49'  DAY);
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (3, 16, 'ADD_CART', 'sess_lee_002',  SYSTIMESTAMP - INTERVAL '7'   DAY, SYSTIMESTAMP - INTERVAL '7'   DAY);
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (4, 17, 'ADD_CART', 'sess_park_001', SYSTIMESTAMP - INTERVAL '3'   DAY, SYSTIMESTAMP - INTERVAL '3'   DAY);
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (5, 21, 'ADD_CART', 'sess_choi_001', SYSTIMESTAMP - INTERVAL '184' DAY(3), SYSTIMESTAMP - INTERVAL '184' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (5, 22, 'ADD_CART', 'sess_choi_001', SYSTIMESTAMP - INTERVAL '184' DAY(3), SYSTIMESTAMP - INTERVAL '184' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (5, 10, 'ADD_CART', 'sess_choi_002', SYSTIMESTAMP - INTERVAL '154' DAY(3), SYSTIMESTAMP - INTERVAL '154' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (6, 11, 'ADD_CART', 'sess_jung_001', SYSTIMESTAMP - INTERVAL '94'  DAY, SYSTIMESTAMP - INTERVAL '94'  DAY);
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (6, 14, 'ADD_CART', 'sess_jung_001', SYSTIMESTAMP - INTERVAL '94'  DAY, SYSTIMESTAMP - INTERVAL '94'  DAY);
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (6, 16, 'ADD_CART', 'sess_jung_002', SYSTIMESTAMP - INTERVAL '64'  DAY, SYSTIMESTAMP - INTERVAL '64'  DAY);
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (6, 18, 'ADD_CART', 'sess_jung_002', SYSTIMESTAMP - INTERVAL '64'  DAY, SYSTIMESTAMP - INTERVAL '64'  DAY);
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (7, 2,  'ADD_CART', 'sess_han_001',  SYSTIMESTAMP - INTERVAL '4'   DAY, SYSTIMESTAMP - INTERVAL '4'   DAY);
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (8, 25, 'ADD_CART', 'sess_oh_001',   SYSTIMESTAMP - INTERVAL '124' DAY(3), SYSTIMESTAMP - INTERVAL '124' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (8, 23, 'ADD_CART', 'sess_oh_001',   SYSTIMESTAMP - INTERVAL '124' DAY(3), SYSTIMESTAMP - INTERVAL '124' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (9, 3,  'ADD_CART', 'sess_shin_001', SYSTIMESTAMP - INTERVAL '34'  DAY, SYSTIMESTAMP - INTERVAL '34'  DAY);
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (9, 6,  'ADD_CART', 'sess_shin_002', SYSTIMESTAMP - INTERVAL '8'   DAY, SYSTIMESTAMP - INTERVAL '8'   DAY);

-- PURCHASE 로그 (실제 구매 완료 기준)
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (2, 1,  'PURCHASE', 'sess_kim_001',  SYSTIMESTAMP - INTERVAL '60'  DAY, SYSTIMESTAMP - INTERVAL '60'  DAY);
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (2, 4,  'PURCHASE', 'sess_kim_002',  SYSTIMESTAMP - INTERVAL '90'  DAY, SYSTIMESTAMP - INTERVAL '90'  DAY);
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (2, 5,  'PURCHASE', 'sess_kim_002',  SYSTIMESTAMP - INTERVAL '90'  DAY, SYSTIMESTAMP - INTERVAL '90'  DAY);
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (3, 8,  'PURCHASE', 'sess_lee_001',  SYSTIMESTAMP - INTERVAL '45'  DAY, SYSTIMESTAMP - INTERVAL '45'  DAY);
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (3, 9,  'PURCHASE', 'sess_lee_001',  SYSTIMESTAMP - INTERVAL '45'  DAY, SYSTIMESTAMP - INTERVAL '45'  DAY);
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (5, 21, 'PURCHASE', 'sess_choi_001', SYSTIMESTAMP - INTERVAL '180' DAY(3), SYSTIMESTAMP - INTERVAL '180' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (5, 22, 'PURCHASE', 'sess_choi_001', SYSTIMESTAMP - INTERVAL '180' DAY(3), SYSTIMESTAMP - INTERVAL '180' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (6, 11, 'PURCHASE', 'sess_jung_001', SYSTIMESTAMP - INTERVAL '90'  DAY, SYSTIMESTAMP - INTERVAL '90'  DAY);
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (6, 14, 'PURCHASE', 'sess_jung_001', SYSTIMESTAMP - INTERVAL '90'  DAY, SYSTIMESTAMP - INTERVAL '90'  DAY);
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (6, 16, 'PURCHASE', 'sess_jung_002', SYSTIMESTAMP - INTERVAL '60'  DAY, SYSTIMESTAMP - INTERVAL '60'  DAY);
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (6, 18, 'PURCHASE', 'sess_jung_002', SYSTIMESTAMP - INTERVAL '60'  DAY, SYSTIMESTAMP - INTERVAL '60'  DAY);
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (8, 25, 'PURCHASE', 'sess_oh_001',   SYSTIMESTAMP - INTERVAL '120' DAY(3), SYSTIMESTAMP - INTERVAL '120' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (8, 23, 'PURCHASE', 'sess_oh_001',   SYSTIMESTAMP - INTERVAL '120' DAY(3), SYSTIMESTAMP - INTERVAL '120' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (9, 3,  'PURCHASE', 'sess_shin_001', SYSTIMESTAMP - INTERVAL '30'  DAY, SYSTIMESTAMP - INTERVAL '30'  DAY);
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (9, 6,  'PURCHASE', 'sess_shin_002', SYSTIMESTAMP - INTERVAL '7'   DAY, SYSTIMESTAMP - INTERVAL '7'   DAY);

-- REVIEW 로그 (리뷰 작성 시점)
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (2, 1,  'REVIEW', 'sess_kim_rev',   SYSTIMESTAMP - INTERVAL '50'  DAY, SYSTIMESTAMP - INTERVAL '50'  DAY);
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (2, 4,  'REVIEW', 'sess_kim_rev',   SYSTIMESTAMP - INTERVAL '80'  DAY, SYSTIMESTAMP - INTERVAL '80'  DAY);
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (3, 9,  'REVIEW', 'sess_lee_rev',   SYSTIMESTAMP - INTERVAL '37'  DAY, SYSTIMESTAMP - INTERVAL '37'  DAY);
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (5, 22, 'REVIEW', 'sess_choi_rev',  SYSTIMESTAMP - INTERVAL '170' DAY(3), SYSTIMESTAMP - INTERVAL '170' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (6, 16, 'REVIEW', 'sess_jung_rev',  SYSTIMESTAMP - INTERVAL '52'  DAY, SYSTIMESTAMP - INTERVAL '52'  DAY);
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, created_at, updated_at)
VALUES (9, 3,  'REVIEW', 'sess_shin_rev',  SYSTIMESTAMP - INTERVAL '22'  DAY, SYSTIMESTAMP - INTERVAL '22'  DAY);

-- 검색 키워드 로그 (VIEW + search_keyword)
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, search_keyword, category_id, created_at, updated_at)
VALUES (2,    NULL, 'VIEW', 'sess_kim_001',  '갤럭시',    1, SYSTIMESTAMP - INTERVAL '66' DAY(3), SYSTIMESTAMP - INTERVAL '66' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, search_keyword, category_id, created_at, updated_at)
VALUES (3,    NULL, 'VIEW', 'sess_lee_001',  '청바지',    2, SYSTIMESTAMP - INTERVAL '51' DAY(3), SYSTIMESTAMP - INTERVAL '51' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, search_keyword, category_id, created_at, updated_at)
VALUES (6,    NULL, 'VIEW', 'sess_jung_001', '책상',      4, SYSTIMESTAMP - INTERVAL '96' DAY(3), SYSTIMESTAMP - INTERVAL '96' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, search_keyword, category_id, created_at, updated_at)
VALUES (9,    NULL, 'VIEW', 'sess_shin_001', '노트북',    1, SYSTIMESTAMP - INTERVAL '36' DAY(3), SYSTIMESTAMP - INTERVAL '36' DAY(3));
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, search_keyword, category_id, created_at, updated_at)
VALUES (NULL, NULL, 'VIEW', 'anon_fff',      '소파',      4, SYSTIMESTAMP - INTERVAL '5'  DAY, SYSTIMESTAMP - INTERVAL '5'  DAY);
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, search_keyword, category_id, created_at, updated_at)
VALUES (NULL, NULL, 'VIEW', 'anon_ggg',      '에어팟',    1, SYSTIMESTAMP - INTERVAL '2'  DAY, SYSTIMESTAMP - INTERVAL '2'  DAY);
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, search_keyword, category_id, created_at, updated_at)
VALUES (7,    NULL, 'VIEW', 'sess_han_001',  '아이패드',  1, SYSTIMESTAMP - INTERVAL '6'  DAY, SYSTIMESTAMP - INTERVAL '6'  DAY);
INSERT INTO behavior_logs (member_id, product_id, action_type, session_id, search_keyword, category_id, created_at, updated_at)
VALUES (8,    NULL, 'VIEW', 'sess_oh_001',   '베스트셀러',5, SYSTIMESTAMP - INTERVAL '126' DAY(3), SYSTIMESTAMP - INTERVAL '126' DAY(3));

COMMIT;
