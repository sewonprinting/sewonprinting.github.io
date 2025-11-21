// 포트폴리오 데이터 관리 시스템

class PortfolioManager {
  constructor() {
    this.data = {
      categories: [],
      items: []
    };
    this.currentFilter = 'all';
  }

  // JSON 파일에서 포트폴리오 데이터 로드
  async loadData() {
    try {
      // 현재 언어 가져오기
      const currentLang = window.i18nManager ? window.i18nManager.getCurrentLanguage() : 'ko';
      
      // 현재 경로에 따라 상대 경로 조정
      const currentPath = window.location.pathname;
      let dataPath;
      
      // 언어에 따라 데이터 파일 결정
      const portfolioFile = currentLang === 'en' ? 'portfolio-en.json' : 'portfolio.json';
      
      if (currentPath.includes('/pages/')) {
        dataPath = `../data/${portfolioFile}`;
      } else if (currentPath.includes('/admin/')) {
        dataPath = `../data/${portfolioFile}`;
      } else {
        dataPath = `data/${portfolioFile}`;
      }
      
      console.log('포트폴리오 데이터 로드 시도:', dataPath);
      
      // 항상 서버에서 최신 데이터 로드 (캐시 무시)
      const response = await fetch(dataPath + '?cache=bust&t=' + Date.now());
      if (!response.ok) {
        throw new Error(`포트폴리오 데이터를 불러올 수 없습니다. Status: ${response.status}`);
      }
      
      this.data = await response.json();
      console.log('포트폴리오 데이터 로드 성공:', this.data);
      return this.data;
    } catch (error) {
      console.error('포트폴리오 데이터 로드 오류:', error);
      
      // 서버 로드 실패시 기본 백업 데이터 사용
      const backup = this.getBackupData();
      console.log('백업 데이터 사용');
      this.data = backup;
      return this.data;
    }
  }

  // 백업 데이터 가져오기 (localStorage 사용하지 않음)
  getBackupData() {
    // 기본 백업 데이터 (최소한의 데이터)
    return {
      categories: [
        "메뉴판",
        "스프링제본", 
        "무선제본",
        "책자제작",
        "결산서.세무조정계산서",
        "제안서",
        "도면출력제본",
        "카드.초대장",
        "팜플렛.전단지",
        "포토폴리오"
      ],
      items: [
        {
          "id": 1,
          "title": "메뉴판",
          "description": "칼라출력 + 코팅",
          "category": "메뉴판",
          "image": "images/portfolio/메뉴판-1.jpg",
          "alt": "메뉴판"
        },
        {
          "id": 2,
          "title": "스프링제본",
          "description": "앞뒤 PP필름 포함",
          "category": "스프링제본",
          "image": "images/portfolio/스프링제본-1.jpg",
          "alt": "스프링제본"
        },
        {
          "id": 3,
          "title": "책자제작",
          "description": "대량시 표지 선택가능",
          "category": "책자제작",
          "image": "images/portfolio/책자제작-1.jpg",
          "alt": "책자제작"
        }
      ]
    };
  }

  // 카테고리 필터 버튼 렌더링
  renderFilters(container) {
    if (!container) return;

    container.innerHTML = '';
    
    // 전체 보기 버튼
    const allButton = document.createElement('button');
    allButton.className = 'filter-btn active';
    allButton.setAttribute('data-filter', 'all');
    // 다국어 지원
    const allText = window.i18nManager && window.i18nManager.getCurrentLanguage() === 'en' ? 'All' : '전체 보기';
    allButton.textContent = allText;
    container.appendChild(allButton);

    // 카테고리별 버튼
    this.data.categories.forEach(category => {
      const button = document.createElement('button');
      button.className = 'filter-btn';
      button.setAttribute('data-filter', category);
      button.textContent = category.replace('.', '/');
      container.appendChild(button);
    });

    // 필터 이벤트 리스너 추가
    this.addFilterListeners(container);
  }

  // 포트폴리오 아이템 렌더링
  renderItems(container) {
    if (!container) return;

    container.innerHTML = '';

    const filteredItems = this.currentFilter === 'all' 
      ? this.data.items 
      : this.data.items.filter(item => item.category === this.currentFilter);

    filteredItems.forEach(item => {
      const itemElement = this.createItemElement(item);
      container.appendChild(itemElement);
    });

    // 갤러리 모달 이벤트 리스너 추가
    this.addGalleryListeners(container);
  }

  // 포트폴리오 아이템 요소 생성
  createItemElement(item) {
    const itemDiv = document.createElement('div');
    itemDiv.className = `portfolio-item ${item.category}`;
    itemDiv.setAttribute('data-category', item.category);
    itemDiv.setAttribute('data-id', item.id);

    // 반응형 이미지 경로 가져오기
    const imagePath = window.responsiveImageManager
      ? window.responsiveImageManager.getResponsiveImagePath(`../${item.image}`)
      : `../${item.image}`;

    itemDiv.innerHTML = `
      <img src="${imagePath}"
           data-original-src="../${item.image}"
           alt="${item.alt}"
           class="portfolio-img"
           loading="lazy">
      <div class="portfolio-overlay">
        <h3 class="portfolio-title">${item.title}</h3>
        <p class="portfolio-category">${item.description}</p>
      </div>
    `;

    return itemDiv;
  }

  // 필터 이벤트 리스너 추가
  addFilterListeners(container) {
    const filterButtons = container.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // 활성 버튼 변경
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // 현재 필터 업데이트
        this.currentFilter = button.getAttribute('data-filter');

        // 포트폴리오 아이템 다시 렌더링
        const portfolioGrid = document.querySelector('.portfolio-grid');
        this.renderItems(portfolioGrid);
      });
    });
  }

  // 갤러리 모달 이벤트 리스너 추가
  addGalleryListeners(container) {
    const portfolioItems = container.querySelectorAll('.portfolio-item');

    portfolioItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const title = item.querySelector('.portfolio-title').textContent;
        const category = item.querySelector('.portfolio-category').textContent;

        // 원본 이미지 경로 가져오기 (data-original-src 또는 mobile/pc 경로를 원본으로 변환)
        let originalSrc = img.getAttribute('data-original-src') || img.src;

        // mobile 또는 pc 경로를 원본 경로로 변환
        originalSrc = originalSrc.replace('/mobile/', '/').replace('/pc/', '/');

        this.showGalleryModal(originalSrc, title, category);
      });
    });
  }

  // 갤러리 모달 표시
  showGalleryModal(imgSrc, title, category) {
    // 기존 모달 제거
    const existingModal = document.querySelector('.gallery-modal');
    if (existingModal) {
      existingModal.remove();
    }

    // 새 모달 생성
    const modal = document.createElement('div');
    modal.className = 'gallery-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.85);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;

    modal.innerHTML = `
      <div class="gallery-modal-content" style="max-width: 90%; max-height: 90%; position: relative;">
        <span class="gallery-modal-close" style="position: absolute; top: -40px; right: 0; width: 30px; height: 30px; background-color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 18px; color: #333;">&times;</span>
        <img src="${imgSrc}" alt="${title}" style="max-width: 100%; max-height: 90vh; border-radius: 8px;">
        <div class="gallery-modal-info" style="position: absolute; bottom: -60px; left: 0; background-color: rgba(255, 255, 255, 0.9); padding: 10px 15px; border-radius: 5px;">
          <h3 style="margin: 0; font-size: 1.2rem; color: #333;">${title}</h3>
          <p style="margin: 5px 0 0; color: #666;">${category}</p>
        </div>
      </div>
    `;

    // 모달 추가
    document.body.appendChild(modal);

    // 애니메이션
    setTimeout(() => {
      modal.style.opacity = '1';
    }, 10);

    // 닫기 이벤트
    const closeBtn = modal.querySelector('.gallery-modal-close');
    closeBtn.addEventListener('click', () => {
      modal.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(modal);
      }, 300);
    });

    // 모달 외부 클릭 시 닫기
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
          document.body.removeChild(modal);
        }, 300);
      }
    });

    // ESC 키로 닫기
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        modal.style.opacity = '0';
        setTimeout(() => {
          if (document.body.contains(modal)) {
            document.body.removeChild(modal);
          }
        }, 300);
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }

  // 새 포트폴리오 아이템 추가 (메모리에만 저장)
  addItem(item) {
    const newId = Math.max(...this.data.items.map(i => i.id), 0) + 1;
    const newItem = {
      ...item,
      id: newId
    };
    this.data.items.push(newItem);
    console.log('새 아이템이 메모리에 추가되었습니다. 영구 저장하려면 portfolio.json 파일을 직접 수정하세요.');
    return newItem;
  }

  // 포트폴리오 아이템 수정 (메모리에만 저장)
  updateItem(id, updatedItem) {
    const index = this.data.items.findIndex(item => item.id === parseInt(id));
    if (index !== -1) {
      this.data.items[index] = { ...this.data.items[index], ...updatedItem };
      console.log('아이템이 메모리에서 수정되었습니다. 영구 저장하려면 portfolio.json 파일을 직접 수정하세요.');
      return this.data.items[index];
    }
    return null;
  }

  // 포트폴리오 아이템 삭제 (메모리에만 저장)
  deleteItem(id) {
    const index = this.data.items.findIndex(item => item.id === parseInt(id));
    if (index !== -1) {
      const deletedItem = this.data.items.splice(index, 1)[0];
      console.log('아이템이 메모리에서 삭제되었습니다. 영구 저장하려면 portfolio.json 파일을 직접 수정하세요.');
      return deletedItem;
    }
    return null;
  }

  // 카테고리 추가 (메모리에만 저장)
  addCategory(categoryName) {
    if (!this.data.categories.includes(categoryName)) {
      this.data.categories.push(categoryName);
      console.log('카테고리가 메모리에 추가되었습니다. 영구 저장하려면 portfolio.json 파일을 직접 수정하세요.');
      return true;
    }
    return false;
  }

  // 카테고리 삭제 (메모리에만 저장)
  deleteCategory(categoryName) {
    const index = this.data.categories.indexOf(categoryName);
    if (index !== -1) {
      // 해당 카테고리의 아이템들도 삭제
      this.data.items = this.data.items.filter(item => item.category !== categoryName);
      this.data.categories.splice(index, 1);
      console.log('카테고리가 메모리에서 삭제되었습니다. 영구 저장하려면 portfolio.json 파일을 직접 수정하세요.');
      return true;
    }
    return false;
  }

  // ID로 아이템 찾기
  getItemById(id) {
    return this.data.items.find(item => item.id === parseInt(id));
  }

  // 카테고리별 아이템 수 반환
  getCategoryCounts() {
    const counts = {};
    this.data.categories.forEach(category => {
      counts[category] = this.data.items.filter(item => item.category === category).length;
    });
    return counts;
  }

  // 데이터 새로고침 (서버에서 최신 데이터 로드)
  async refreshData() {
    console.log('포트폴리오 데이터 새로고침 시작');
    await this.loadData();
    console.log('포트폴리오 데이터 새로고침 완료');
    return this.data;
  }

  // 전체 포트폴리오 렌더링 (필터와 아이템 모두)
  async renderPortfolio() {
    // 데이터 다시 로드
    await this.loadData();
    
    // 필터 버튼 렌더링
    const filterContainer = document.querySelector('.portfolio-filter');
    if (filterContainer) {
      this.renderFilters(filterContainer);
    }
    
    // 포트폴리오 아이템 렌더링
    const portfolioGrid = document.querySelector('.portfolio-grid');
    if (portfolioGrid) {
      this.renderItems(portfolioGrid);
    }
  }
}

// 전역 포트폴리오 매니저 인스턴스
window.portfolioManager = new PortfolioManager();