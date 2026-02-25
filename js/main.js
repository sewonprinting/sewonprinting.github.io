// 세원프린팅 메인 자바스크립트 파일

// 스로틀 유틸리티
function throttle(fn, delay) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

// DOM 요소가 모두 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
  // 오로라 효과 애니메이션
  const auroras = document.querySelectorAll('.aurora');

  // 마우스 움직임에 따른 오로라 효과 (단일 리스너)
  document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    auroras.forEach((aurora, index) => {
      const moveX = (mouseX - 0.5) * 20 * (index + 1);
      const moveY = (mouseY - 0.5) * 20 * (index + 1);
      aurora.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${index * 120}deg)`;
    });
  });

  // 스크롤 애니메이션
  function animateOnScroll() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (elementPosition < windowHeight - 50) {
        element.classList.add('animated');
      }
    });
  }

  // 통합 스크롤 핸들러
  const handleScroll = throttle(() => {
    const header = document.querySelector('.header');
    const scrollPosition = window.scrollY;

    // 헤더 스크롤 스타일
    if (scrollPosition > 50) {
      header.classList.add('scrolled');
      const scrollPercentage = Math.min(scrollPosition / 100, 1);
      const opacity = 0.85 + (scrollPercentage * 0.15);
      header.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
      header.style.backdropFilter = 'blur(15px)';
      header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
      header.classList.remove('scrolled');
      header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
      header.style.backdropFilter = 'blur(12px)';
      header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }

    // 오로라 스크롤 효과
    auroras.forEach((aurora, index) => {
      const scrollPercent = scrollPosition / (document.body.scrollHeight - window.innerHeight);
      const scaleValue = 1 + (scrollPercent * 0.2 * (index + 1));
      const opacityChange = 0.02 * scrollPercent * (index + 1);
      aurora.style.opacity = Math.max(0.3, 0.6 - opacityChange);
      aurora.style.transform = `scale(${scaleValue})`;
    });

    // 스크롤 애니메이션
    animateOnScroll();
  }, 16);

  window.addEventListener('scroll', handleScroll);

  // 네비게이션 토글
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle) {
    navToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
  }

  // 약도 확대 기능
  const mapZoomContainer = document.getElementById('mapZoomContainer');
  const mapModal = document.getElementById('mapModal');
  const mapCloseBtn = document.getElementById('mapCloseBtn');

  if (mapZoomContainer && mapModal) {
    mapZoomContainer.addEventListener('click', function() {
      mapModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    if (mapCloseBtn) {
      mapCloseBtn.addEventListener('click', function() {
        mapModal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    mapModal.addEventListener('click', function(event) {
      if (event.target === mapModal) {
        mapModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && mapModal.classList.contains('active')) {
        mapModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // 포트폴리오 필터링
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        const filterValue = this.getAttribute('data-filter');
        portfolioItems.forEach(item => {
          if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // 이미지 갤러리 (DOM API - XSS 방지)
  const galleryImages = document.querySelectorAll('.portfolio-item');

  if (galleryImages.length > 0) {
    galleryImages.forEach(item => {
      item.addEventListener('click', function() {
        const imgSrc = this.querySelector('img').src;
        const title = this.querySelector('.portfolio-title').textContent;
        const category = this.querySelector('.portfolio-category').textContent;

        const modal = document.createElement('div');
        modal.className = 'gallery-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');

        const content = document.createElement('div');
        content.className = 'gallery-modal-content';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'gallery-modal-close';
        closeBtn.textContent = '\u00d7';
        closeBtn.setAttribute('aria-label', '닫기');

        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = title;
        img.className = 'gallery-modal-img';

        const info = document.createElement('div');
        info.className = 'gallery-modal-info';

        const infoTitle = document.createElement('h3');
        infoTitle.textContent = title;

        const infoCat = document.createElement('p');
        infoCat.textContent = category;

        info.appendChild(infoTitle);
        info.appendChild(infoCat);
        content.appendChild(closeBtn);
        content.appendChild(img);
        content.appendChild(info);
        modal.appendChild(content);
        document.body.appendChild(modal);

        setTimeout(() => { modal.style.opacity = '1'; }, 10);
        closeBtn.focus();

        const closeModal = () => {
          modal.style.opacity = '0';
          setTimeout(() => { modal.remove(); }, 300);
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
        document.addEventListener('keydown', function handleEsc(e) {
          if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEsc);
          }
        });
      });
    });
  }

  // 언어 선택기 이벤트 위임
  const langSwitcher = document.querySelector('.language-switcher');
  if (langSwitcher) {
    langSwitcher.addEventListener('click', (e) => {
      const btn = e.target.closest('.lang-btn');
      if (btn) {
        const lang = btn.getAttribute('data-lang');
        if (lang && typeof changeLanguage === 'function') {
          changeLanguage(lang);
        }
      }
    });
  }

  // FAQ 토글
  const faqHeaders = document.querySelectorAll('.faq-header');
  faqHeaders.forEach(header => {
    header.setAttribute('role', 'button');
    header.setAttribute('tabindex', '0');
    header.setAttribute('aria-expanded', 'false');

    const toggleFaq = () => {
      const content = header.nextElementSibling;
      const arrow = header.querySelector('svg, .faq-icon');
      const isOpen = content.style.display === 'block';

      content.style.display = isOpen ? 'none' : 'block';
      if (arrow) arrow.style.transform = isOpen ? 'rotate(0)' : 'rotate(180deg)';
      header.setAttribute('aria-expanded', String(!isOpen));
    };

    header.addEventListener('click', toggleFaq);
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFaq();
      }
    });
  });

  // 동영상 재생 오버레이 (services 페이지)
  const introVideo = document.getElementById('introVideo');
  const playOverlay = document.getElementById('playOverlay');
  if (introVideo && playOverlay) {
    playOverlay.addEventListener('click', () => {
      introVideo.play();
      playOverlay.classList.add('hidden');
    });
    introVideo.addEventListener('click', () => {
      if (introVideo.paused) {
        introVideo.play();
      } else {
        introVideo.pause();
      }
    });
    introVideo.addEventListener('ended', () => playOverlay.classList.remove('hidden'));
    introVideo.addEventListener('pause', () => playOverlay.classList.remove('hidden'));
    introVideo.addEventListener('play', () => playOverlay.classList.add('hidden'));
  }

  // 히어로 비디오 음소거 토글 (index 페이지)
  const heroVideo = document.getElementById('heroVideo');
  const muteToggle = document.getElementById('muteToggle');
  if (heroVideo && muteToggle) {
    const iconMuted = muteToggle.querySelector('.icon-muted');
    const iconUnmuted = muteToggle.querySelector('.icon-unmuted');
    muteToggle.addEventListener('click', () => {
      if (heroVideo.muted) {
        heroVideo.muted = false;
        iconMuted.style.display = 'none';
        iconUnmuted.style.display = 'block';
        muteToggle.setAttribute('aria-label', '음소거');
      } else {
        heroVideo.muted = true;
        iconMuted.style.display = 'block';
        iconUnmuted.style.display = 'none';
        muteToggle.setAttribute('aria-label', '음소거 해제');
      }
    });
  }

  // 초기 스크롤 애니메이션 실행
  animateOnScroll();
});
