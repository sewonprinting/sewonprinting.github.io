// 반응형 이미지 헬퍼 유틸리티

class ResponsiveImageManager {
  constructor() {
    this.isMobile = this.checkMobile();
    this.setupResizeListener();
  }

  // 모바일 디바이스 체크
  checkMobile() {
    return window.innerWidth <= 768 ||
           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // 리사이즈 이벤트 리스너 설정
  setupResizeListener() {
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const wasMobile = this.isMobile;
        this.isMobile = this.checkMobile();

        // 모바일/PC 전환 시 이미지 업데이트
        if (wasMobile !== this.isMobile) {
          this.updateAllImages();
        }
      }, 250);
    });
  }

  // 이미지 경로 변환 (모바일/PC)
  getResponsiveImagePath(originalPath) {
    if (!originalPath) return originalPath;

    // 이미 mobile 또는 pc 폴더를 포함하고 있으면 그대로 반환
    if (originalPath.includes('/mobile/') || originalPath.includes('/pc/')) {
      return originalPath;
    }

    const deviceFolder = this.isMobile ? 'mobile' : 'pc';

    // portfolio 또는 promotional 이미지인 경우 처리
    if (originalPath.includes('images/portfolio/')) {
      return originalPath.replace('images/portfolio/', `images/portfolio/${deviceFolder}/`);
    } else if (originalPath.includes('images/promotional/')) {
      return originalPath.replace('images/promotional/', `images/promotional/${deviceFolder}/`);
    }

    return originalPath;
  }

  // 단일 이미지 요소 업데이트
  updateImageElement(imgElement) {
    if (!imgElement) return;

    const originalSrc = imgElement.getAttribute('data-original-src') || imgElement.src;

    // 원본 경로 저장 (처음 한번만)
    if (!imgElement.getAttribute('data-original-src')) {
      imgElement.setAttribute('data-original-src', originalSrc);
    }

    const responsiveSrc = this.getResponsiveImagePath(originalSrc);

    // 이미지가 변경되어야 하는 경우에만 업데이트
    if (imgElement.src !== responsiveSrc) {
      imgElement.src = responsiveSrc;
    }
  }

  // 페이지의 모든 반응형 이미지 업데이트
  updateAllImages() {
    // 포트폴리오 이미지
    const portfolioImages = document.querySelectorAll('.portfolio-img, .portfolio-item img');
    portfolioImages.forEach(img => this.updateImageElement(img));

    // 홍보 이미지
    const promotionalImages = document.querySelectorAll('.promotional-img');
    promotionalImages.forEach(img => this.updateImageElement(img));
  }
}

// 전역 인스턴스 생성
window.responsiveImageManager = new ResponsiveImageManager();

// DOM 로드 완료 시 이미지 초기화
document.addEventListener('DOMContentLoaded', () => {
  window.responsiveImageManager.updateAllImages();
});
