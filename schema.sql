-- Admin 테이블 (관리자 로그인용)
CREATE TABLE IF NOT EXISTS admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Links 테이블 (링크 관리용)
CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,  
    url TEXT NOT NULL,          
    description TEXT,            
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 초기 관리자 계정 생성 (비밀번호는 'admin123' - 실제 운영시 변경 필요)
-- 비밀번호는 평문으로 저장 (토큰/인증 없이 단순 비교)
-- INSERT INTO admin (username, password) VALUES ('admin', 'admin123');

-- 초기 링크 데이터 (예시)
-- INSERT INTO links (name, url, description) VALUES 
-- ('hero_button', '#loan-apply', '대출상담 신청하기 버튼 링크'),
-- ('phone_button', '#loan-apply', '전화 버튼 링크');

