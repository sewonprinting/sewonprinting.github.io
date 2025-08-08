// 세원프린팅 메인 자바스크립트 파일

// DOM 요소가 모두 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
  // 오로라 효과 애니메이션
  const auroras = document.querySelectorAll('.aurora');
  
  function animateAuroras() {
    auroras.forEach((aurora, index) => {
      // 마우스 움직임에 따라 오로라 효과를 약간 이동
      document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        const moveX = (mouseX - 0.5) * 20 * (index + 1);
        const moveY = (mouseY - 0.5) * 20 * (index + 1);
        
        aurora.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${index * 120}deg)`;
      });
      
      // 스크롤 이벤트에 따라 오로라 크기와 투명도 변경 (더 부드럽게)
      window.addEventListener('scroll', () => {
        const scrollPercentage = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        const scaleValue = 1 + (scrollPercentage * 0.2 * (index + 1));
        const opacityChange = 0.02 * scrollPercentage * (index + 1);
        
        aurora.style.opacity = Math.max(0.3, 0.6 - opacityChange);
        aurora.style.transform = `scale(${scaleValue})`;
      });
    });
  }
  
  animateAuroras();
  // 네비게이션 토글 기능
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
    // 약도 클릭 시 모달 열기
    mapZoomContainer.addEventListener('click', function() {
      mapModal.classList.add('active');
      document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
    });
    
    // 닫기 버튼 클릭 시 모달 닫기
    if (mapCloseBtn) {
      mapCloseBtn.addEventListener('click', function() {
        mapModal.classList.remove('active');
        document.body.style.overflow = ''; // 배경 스크롤 복원
      });
    }
    
    // 모달 배경 클릭 시 닫기
    mapModal.addEventListener('click', function(event) {
      if (event.target === mapModal) {
        mapModal.classList.remove('active');
        document.body.style.overflow = ''; // 배경 스크롤 복원
      }
    });
    
    // ESC 키 누를 때 모달 닫기
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && mapModal.classList.contains('active')) {
        mapModal.classList.remove('active');
        document.body.style.overflow = ''; // 배경 스크롤 복원
      }
    });
  }
  
  // 스크롤 이벤트 처리
  window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    const scrollPosition = window.scrollY;
    
    // 스크롤 시 헤더 스타일 변경
    if (scrollPosition > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // 애니메이션 요소 처리
    animateOnScroll();
  });
  
  // 포트폴리오 필터링 기능
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        // 활성화된 버튼 클래스 제거
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // 클릭한 버튼 활성화
        this.classList.add('active');
        
        // 필터 카테고리 가져오기
        const filterValue = this.getAttribute('data-filter');
        
        // 포트폴리오 아이템 필터링
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
  

  
  // 이미지 갤러리 확대 기능
  const galleryImages = document.querySelectorAll('.portfolio-item');
  
  if (galleryImages.length > 0) {
    galleryImages.forEach(item => {
      item.addEventListener('click', function() {
        const imgSrc = this.querySelector('img').src;
        const title = this.querySelector('.portfolio-title').textContent;
        const category = this.querySelector('.portfolio-category').textContent;
        
        // 모달 생성
        const modal = document.createElement('div');
        modal.classList.add('gallery-modal');
        
        modal.innerHTML = `
          <div class="gallery-modal-content">
            <span class="gallery-modal-close">&times;</span>
            <img src="${imgSrc}" alt="${title}">
            <div class="gallery-modal-info">
              <h3>${title}</h3>
              <p>${category}</p>
            </div>
          </div>
        `;
        
        // 모달 추가
        document.body.appendChild(modal);
        
        // 모달 애니메이션
        setTimeout(() => {
          modal.style.opacity = '1';
        }, 10);
        
        // 닫기 버튼 기능
        const closeBtn = modal.querySelector('.gallery-modal-close');
        closeBtn.addEventListener('click', function() {
          modal.style.opacity = '0';
          setTimeout(() => {
            document.body.removeChild(modal);
          }, 300);
        });
        
        // 모달 외부 클릭 시 닫기
        modal.addEventListener('click', function(event) {
          if (event.target === modal) {
            modal.style.opacity = '0';
            setTimeout(() => {
              document.body.removeChild(modal);
            }, 300);
          }
        });
      });
    });
  }
  
  // 문의 폼 유효성 검사
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const phoneInput = document.getElementById('phone');
      const messageInput = document.getElementById('message');
      
      let isValid = true;
      
      // 이름 검사
      if (nameInput.value.trim() === '') {
        showError(nameInput, '이름을 입력해주세요.');
        isValid = false;
      } else {
        removeError(nameInput);
      }
      
      // 이메일 검사
      if (emailInput.value.trim() === '') {
        showError(emailInput, '이메일을 입력해주세요.');
        isValid = false;
      } else if (!isValidEmail(emailInput.value.trim())) {
        showError(emailInput, '유효한 이메일 형식이 아닙니다.');
        isValid = false;
      } else {
        removeError(emailInput);
      }
      
      // 연락처 검사
      if (phoneInput.value.trim() === '') {
        showError(phoneInput, '연락처를 입력해주세요.');
        isValid = false;
      } else {
        removeError(phoneInput);
      }
      
      // 메시지 검사
      if (messageInput.value.trim() === '') {
        showError(messageInput, '문의 내용을 입력해주세요.');
        isValid = false;
      } else {
        removeError(messageInput);
      }
      
      // 폼이 유효하면 처리
      if (isValid) {
        const formMessage = document.createElement('div');
        formMessage.classList.add('form-message', 'success');
        formMessage.textContent = '문의가 성공적으로 전송되었습니다. 빠른 시일 내에 연락드리겠습니다.';
        
        contactForm.innerHTML = '';
        contactForm.appendChild(formMessage);
      }
    });
  }
  
  // 유틸리티 함수
  
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
  
  // 이메일 형식 검사
  function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
  
  // 폼 필드 에러 표시
  function showError(input, message) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message') || document.createElement('div');
    
    if (!formGroup.querySelector('.error-message')) {
      errorElement.classList.add('error-message');
      formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    formGroup.classList.add('error');
  }
  
  // 폼 필드 에러 제거
  function removeError(input) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    if (errorElement) {
      errorElement.textContent = '';
    }
    
    formGroup.classList.remove('error');
  }
  
  // 스크롤 이벤트에 따른 헤더 투명도 변경
  window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    const scrollPercentage = Math.min(window.scrollY / 100, 1);
    const opacity = 0.85 + (scrollPercentage * 0.15); // 0.85 ~ 1.0
    
    if (window.scrollY > 50) {
      header.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
      header.style.backdropFilter = 'blur(15px)';
      header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
      header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
      header.style.backdropFilter = 'blur(12px)';
      header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
  });

  // 스크롤 애니메이션 이벤트
  window.addEventListener('scroll', animateOnScroll);
  
  // 초기 스크롤 애니메이션 실행
  animateOnScroll();
});
