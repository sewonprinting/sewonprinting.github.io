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
  async loadData(forceRefresh = false) {
    try {
      // 현재 경로에 따라 상대 경로 조정
      const currentPath = window.location.pathname;
      let dataPath;
      
      if (currentPath.includes('/pages/')) {
        dataPath = '../data/portfolio.json';
      } else if (currentPath.includes('/admin/')) {
        dataPath = '../data/portfolio.json';
      } else {
        dataPath = 'data/portfolio.json';
      }
      
      console.log('포트폴리오 데이터 로드 시도:', dataPath, forceRefresh ? '(강제 새로고침)' : '');
      
      // 강제 새로고침이거나 localStorage에 데이터가 없을 때만 서버에서 로드
      if (forceRefresh || !this.loadFromStorage()) {
        // 캐시 무시를 위해 타임스탬프 추가
        const response = await fetch(dataPath + '?cache=bust&t=' + Date.now());
        if (!response.ok) {
          throw new Error(`포트폴리오 데이터를 불러올 수 없습니다. Status: ${response.status}`);
        }
        
        this.data = await response.json();
        console.log('포트폴리오 데이터 로드 성공:', this.data);
        // JSON 로드 성공시 localStorage 업데이트
        this.saveData();
        return this.data;
      } else {
        console.log('로컬 스토리지에서 포트폴리오 데이터 로드');
        return this.data;
      }
    } catch (error) {
      console.error('포트폴리오 데이터 로드 오류:', error);
      
      // 로컬 스토리지에서 백업 데이터 시도
      const backup = this.getBackupData();
      if (backup) {
        console.log('백업 데이터 사용');
        this.data = backup;
        return this.data;
      }
      
      throw error;
    }
  }

  // 데이터 저장 (로컬 스토리지 활용)
  saveData() {
    localStorage.setItem('portfolioData', JSON.stringify(this.data));
  }

  // 로컬 스토리지에서 데이터 로드
  loadFromStorage() {
    const stored = localStorage.getItem('portfolioData');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        // 데이터 유효성 검사 - 탁상달력 카테고리가 있는지 확인
        if (data.categories && data.categories.includes('탁상달력')) {
          this.data = data;
          return true;
        } else {
          // 구버전 데이터면 localStorage 삭제하고 새로 로드
          console.log('구버전 포트폴리오 데이터 감지, 새로고침 필요');
          localStorage.removeItem('portfolioData');
          return false;
        }
      } catch (error) {
        console.error('로컬 스토리지 데이터 파싱 오류:', error);
        localStorage.removeItem('portfolioData');
        return false;
      }
    }
    return false;
  }

  // 백업 데이터 가져오기
  getBackupData() {
    const stored = localStorage.getItem('portfolioData');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('로컬 스토리지 데이터 파싱 오류:', error);
      }
    }
    
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
    allButton.textContent = '전체 보기';
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

    itemDiv.innerHTML = `
      <img src="../${item.image}" alt="${item.alt}" class="portfolio-img">
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
        const imgSrc = item.querySelector('img').src;
        const title = item.querySelector('.portfolio-title').textContent;
        const category = item.querySelector('.portfolio-category').textContent;
        
        this.showGalleryModal(imgSrc, title, category);
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

  // 새 포트폴리오 아이템 추가
  addItem(item) {
    const newId = Math.max(...this.data.items.map(i => i.id), 0) + 1;
    const newItem = {
      ...item,
      id: newId
    };
    this.data.items.push(newItem);
    this.saveData();
    return newItem;
  }

  // 포트폴리오 아이템 수정
  updateItem(id, updatedItem) {
    const index = this.data.items.findIndex(item => item.id === parseInt(id));
    if (index !== -1) {
      this.data.items[index] = { ...this.data.items[index], ...updatedItem };
      this.saveData();
      return this.data.items[index];
    }
    return null;
  }

  // 포트폴리오 아이템 삭제
  deleteItem(id) {
    const index = this.data.items.findIndex(item => item.id === parseInt(id));
    if (index !== -1) {
      const deletedItem = this.data.items.splice(index, 1)[0];
      this.saveData();
      return deletedItem;
    }
    return null;
  }

  // 카테고리 추가
  addCategory(categoryName) {
    if (!this.data.categories.includes(categoryName)) {
      this.data.categories.push(categoryName);
      this.saveData();
      return true;
    }
    return false;
  }

  // 카테고리 삭제
  deleteCategory(categoryName) {
    const index = this.data.categories.indexOf(categoryName);
    if (index !== -1) {
      // 해당 카테고리의 아이템들도 삭제
      this.data.items = this.data.items.filter(item => item.category !== categoryName);
      this.data.categories.splice(index, 1);
      this.saveData();
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

  // 캐시 강제 새로고침
  async refreshCache() {
    console.log('포트폴리오 캐시 강제 새로고침 시작');
    localStorage.removeItem('portfolioData');
    await this.loadData(true);
    console.log('포트폴리오 캐시 새로고침 완료');
    return this.data;
  }

  // 캐시 상태 확인
  isCacheAvailable() {
    return localStorage.getItem('portfolioData') !== null;
  }

  // 캐시 수동 클리어
  clearCache() {
    localStorage.removeItem('portfolioData');
    console.log('포트폴리오 캐시가 삭제되었습니다');
  }
}

// 전역 포트폴리오 매니저 인스턴스
window.portfolioManager = new PortfolioManager();