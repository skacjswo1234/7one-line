// Storage access error handler - 외부 라이브러리(예: Tailwind CDN)의 스토리지 접근 에러를 무시
(function() {
    // Promise rejection 에러 처리
    window.addEventListener('unhandledrejection', function(event) {
        const errorMessage = event.reason?.message || event.reason?.toString() || '';
        if (errorMessage.toLowerCase().includes('storage') || 
            errorMessage.toLowerCase().includes('access to storage')) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
    });

    // 일반 에러 처리
    window.addEventListener('error', function(event) {
        const errorMessage = event.message || event.error?.message || '';
        if (errorMessage.toLowerCase().includes('storage') || 
            errorMessage.toLowerCase().includes('access to storage')) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
    }, true);

    // 스토리지 API를 안전하게 래핑 (선택적)
    try {
        const originalLocalStorage = window.localStorage;
        Object.defineProperty(window, 'localStorage', {
            get: function() {
                try {
                    return originalLocalStorage;
                } catch (e) {
                    return {
                        getItem: () => null,
                        setItem: () => {},
                        removeItem: () => {},
                        clear: () => {},
                        length: 0
                    };
                }
            }
        });
    } catch (e) {
        // 스토리지 래핑 실패 시 무시
    }
})();

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileSidebar = document.getElementById('mobileSidebar');
const mobileSidebarClose = document.getElementById('mobileSidebarClose');
const mobileSidebarOverlay = document.getElementById('mobileSidebarOverlay');

mobileMenuBtn?.addEventListener('click', function() {
    mobileSidebar.classList.add('active');
    mobileSidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
});

mobileSidebarClose?.addEventListener('click', function() {
    closeMobileMenu();
});

mobileSidebarOverlay?.addEventListener('click', function() {
    closeMobileMenu();
});

function closeMobileMenu() {
    mobileSidebar.classList.remove('active');
    mobileSidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Smooth scroll for anchor links (heroButtonLink는 제외)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    // heroButtonLink는 완전히 제외
    if (anchor.id === 'heroButtonLink') {
        return;
    }
    
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        // href가 #로 시작하는지 다시 확인
        if (href && href.startsWith('#')) {
            try {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    // Close mobile menu if open
                    closeMobileMenu();
                }
            } catch (error) {
                console.error('스크롤 처리 오류:', error);
            }
        }
    });
});

// Logo click handler - 히어로 섹션으로 스크롤
document.querySelectorAll('.logo-link').forEach(logoLink => {
    logoLink.addEventListener('click', function(e) {
        e.preventDefault();
        const heroSection = document.getElementById('home');
        if (heroSection) {
            heroSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            closeMobileMenu();
        }
    });
});

// Form submission handler
document.querySelector('.form-submit-button')?.addEventListener('click', function(e) {
    e.preventDefault();
    
    const nameInput = document.querySelector('.form-input[type="text"]');
    const phoneInput = document.querySelector('.form-input[type="tel"]');
    const privacyCheckbox = document.getElementById('privacy-agree');
    
    // Validation
    if (!nameInput.value.trim()) {
        alert('이름을 입력해주세요.');
        nameInput.focus();
        return;
    }
    
    if (!phoneInput.value.trim()) {
        alert('연락처를 입력해주세요.');
        phoneInput.focus();
        return;
    }
    
    if (!privacyCheckbox.checked) {
        alert('개인정보 수집 및 이용동의에 체크해주세요.');
        return;
    }
    
    // Phone number validation (numbers only)
    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(phoneInput.value)) {
        alert('연락처는 숫자만 입력해주세요.');
        phoneInput.focus();
        return;
    }
    
    // Form submission (여기서 실제 API 호출로 대체)
    alert('대출상담 신청이 완료되었습니다. 담당자가 곧 연락드리겠습니다.');
    
    // Reset form
    nameInput.value = '';
    phoneInput.value = '';
    privacyCheckbox.checked = false;
});

// 히어로 버튼 링크 동적 로드 - 간단하게 처리
async function loadLinks() {
    const heroButtonLink = document.getElementById('heroButtonLink');
    if (!heroButtonLink) return;
    
    try {
        const response = await fetch('/api/links');
        const data = await response.json();
        
        if (data.success && data.data && data.data.url) {
            const linkUrl = data.data.url;
            // 링크 설정만 하고 이벤트 리스너는 추가하지 않음
            heroButtonLink.href = linkUrl;
            
            // 외부 URL인 경우 기본 링크 동작 사용 (이벤트 리스너 불필요)
            // #로 시작하는 링크도 브라우저 기본 동작 사용
        } else {
            // 기본 링크
            heroButtonLink.href = '#loan-apply';
        }
    } catch (error) {
        console.error('링크 로드 실패:', error);
        heroButtonLink.href = '#loan-apply';
    }
}

// 페이지 로드 시 링크 불러오기
loadLinks();

// Hero CTA Button click handler (기본 동작 - 링크가 없을 경우)
document.querySelector('.hero-cta-button')?.addEventListener('click', function(e) {
    const heroButtonLink = document.getElementById('heroButtonLink');
    // 링크가 설정되어 있으면 링크의 기본 동작 사용
    if (heroButtonLink && heroButtonLink.href && heroButtonLink.href !== '#') {
        return;
    }
    
    // 기본 동작: 폼 섹션으로 스크롤
    e.preventDefault();
    const formSection = document.querySelector('.loan-form-section');
    if (formSection) {
        formSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
});

// Lightning inquiry button
document.querySelector('.lightning-inquiry-btn')?.addEventListener('click', function() {
    const formSection = document.querySelector('.loan-form-section');
    if (formSection) {
        formSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
});


// Phone button in mobile app card
document.querySelector('.phone-button')?.addEventListener('click', function() {
    const formSection = document.querySelector('.loan-form-section');
    if (formSection) {
        formSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
});

// Animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.loan-type-card, .process-step, .mobile-app-card, .loan-features-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

