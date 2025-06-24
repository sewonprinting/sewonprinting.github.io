// 포트폴리오 관리자 JavaScript

// 관리자 인증 설정
const ADMIN_PASSWORD = 'sewon2025!'; // 실제 운영시에는 보안이 강화된 방식으로 변경 필요

// 현재 편집 중인 아이템 ID
let currentEditingId = null;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', async function() {
  // 로그인 상태 확인
  if (isLoggedIn()) {
    showAdminInterface();
  }

  // 포트폴리오 데이터 로드
  try {
    await loadPortfolioData();
  } catch (error) {
    console.error('포트폴리오 데이터 로드 오류:', error);
  }

  // 폼 이벤트 리스너 추가
  setupEventListeners();
});

// 로그인 상태 확인
function isLoggedIn() {
  return sessionStorage.getItem('adminLoggedIn') === 'true';
}

// 로그인
function login() {
  const passwordInput = document.getElementById('password');
  const password = passwordInput.value;
  const messageEl = document.getElementById('loginMessage');

  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem('adminLoggedIn', 'true');
    showAdminInterface();
    messageEl.style.display = 'none';
  } else {
    messageEl.style.display = 'block';
    passwordInput.value = '';
    passwordInput.focus();
  }
}

// 로그아웃
function logout() {
  sessionStorage.removeItem('adminLoggedIn');
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('adminInterface').style.display = 'none';
  document.getElementById('password').value = '';
}

// 관리자 인터페이스 표시
function showAdminInterface() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('adminInterface').style.display = 'block';
  
  // 초기 데이터 로드
  loadOverviewData();
  loadCategoryOptions();
  loadPortfolioList();
  loadCategoryList();
}

// 포트폴리오 데이터 로드
async function loadPortfolioData() {
  try {
    // 로컬 스토리지에서 먼저 시도
    if (!portfolioManager.loadFromStorage()) {
      // 로컬 스토리지에 데이터가 없으면 JSON 파일에서 로드
      await portfolioManager.loadData();
      portfolioManager.saveData(); // 로컬 스토리지에 저장
    }
  } catch (error) {
    console.error('포트폴리오 데이터 로드 실패:', error);
    showMessage('포트폴리오 데이터를 불러오는데 실패했습니다.', 'error');
  }
}

// 섹션 표시
function showSection(sectionName) {
  // 모든 섹션 숨기기
  const sections = document.querySelectorAll('.admin-section');
  sections.forEach(section => section.classList.remove('active'));

  // 모든 네비게이션 버튼 비활성화
  const navButtons = document.querySelectorAll('.admin-nav button');
  navButtons.forEach(button => button.classList.remove('active'));

  // 선택된 섹션과 버튼 활성화
  document.getElementById(sectionName).classList.add('active');
  event.target.classList.add('active');

  // 섹션별 데이터 로드
  if (sectionName === 'overview') {
    loadOverviewData();
  } else if (sectionName === 'manage') {
    loadPortfolioList();
  } else if (sectionName === 'categories') {
    loadCategoryList();
  }
}

// 개요 데이터 로드
function loadOverviewData() {
  const statsGrid = document.getElementById('statsGrid');
  const recentPortfolio = document.getElementById('recentPortfolio');

  // 통계 계산
  const totalItems = portfolioManager.data.items.length;
  const totalCategories = portfolioManager.data.categories.length;
  const categoryCounts = portfolioManager.getCategoryCounts();

  // 통계 카드 생성
  statsGrid.innerHTML = `
    <div class="stat-card">
      <div class="stat-number">${totalItems}</div>
      <div class="stat-label">총 포트폴리오</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${totalCategories}</div>
      <div class="stat-label">카테고리 수</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${Math.max(...Object.values(categoryCounts), 0)}</div>
      <div class="stat-label">최대 카테고리 아이템</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${Math.round(totalItems / totalCategories) || 0}</div>
      <div class="stat-label">평균 카테고리별 아이템</div>
    </div>
  `;

  // 최근 포트폴리오 (최근 6개)
  const recentItems = portfolioManager.data.items.slice(-6).reverse();
  recentPortfolio.innerHTML = recentItems.map(item => `
    <div class="portfolio-card">
      <img src="../${item.image}" alt="${item.alt}" onerror="this.src='../images/placeholder.jpg'">
      <h4>${item.title}</h4>
      <div class="category">${item.category}</div>
      <p>${item.description}</p>
    </div>
  `).join('');
}

// 카테고리 옵션 로드
function loadCategoryOptions() {
  const selects = ['addCategory', 'editCategory', 'filterCategory'];
  
  selects.forEach(selectId => {
    const select = document.getElementById(selectId);
    if (!select) return;

    // 기존 옵션 제거 (필터는 "전체" 옵션 유지)
    if (selectId === 'filterCategory') {
      select.innerHTML = '<option value="all">전체</option>';
    } else {
      select.innerHTML = '';
    }

    // 카테고리 옵션 추가
    portfolioManager.data.categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category.replace('.', '/');
      select.appendChild(option);
    });
  });
}

// 포트폴리오 목록 로드
function loadPortfolioList() {
  const portfolioList = document.getElementById('portfolioList');
  const filterCategory = document.getElementById('filterCategory').value;

  const items = filterCategory === 'all' 
    ? portfolioManager.data.items 
    : portfolioManager.data.items.filter(item => item.category === filterCategory);

  portfolioList.innerHTML = items.map(item => `
    <div class="portfolio-card">
      <img src="../${item.image}" alt="${item.alt}" onerror="this.src='../images/placeholder.jpg'">
      <h4>${item.title}</h4>
      <div class="category">${item.category}</div>
      <p>${item.description}</p>
      <div class="btn-group">
        <button class="btn btn-secondary" onclick="editItem(${item.id})">수정</button>
        <button class="btn btn-danger" onclick="deleteItem(${item.id})">삭제</button>
      </div>
    </div>
  `).join('');
}

// 카테고리 목록 로드
function loadCategoryList() {
  const categoryList = document.getElementById('categoryList');
  const categoryCounts = portfolioManager.getCategoryCounts();

  categoryList.innerHTML = portfolioManager.data.categories.map(category => `
    <div class="portfolio-card">
      <h4>${category.replace('.', '/')}</h4>
      <p>${categoryCounts[category] || 0}개 아이템</p>
      <div class="btn-group">
        <button class="btn btn-danger" onclick="deleteCategory('${category}')" 
                ${categoryCounts[category] > 0 ? 'disabled title="아이템이 있는 카테고리는 삭제할 수 없습니다"' : ''}>
          삭제
        </button>
      </div>
    </div>
  `).join('');
}

// 포트폴리오 필터링
function filterPortfolio() {
  loadPortfolioList();
}

// 이벤트 리스너 설정
function setupEventListeners() {
  // 로그인 폼 엔터키 처리
  document.getElementById('password').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      login();
    }
  });

  // 포트폴리오 추가 폼
  document.getElementById('addForm').addEventListener('submit', function(e) {
    e.preventDefault();
    addPortfolioItem();
  });

  // 포트폴리오 수정 폼
  document.getElementById('editForm').addEventListener('submit', function(e) {
    e.preventDefault();
    updatePortfolioItem();
  });

  // 폼 초기화
  document.getElementById('addForm').addEventListener('reset', function() {
    document.getElementById('addPreview').innerHTML = '이미지를 선택하세요';
    document.getElementById('addPreview').className = 'image-preview empty';
  });
}

// 이미지 미리보기
function previewImage(input, previewId) {
  const preview = document.getElementById(previewId);
  
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      preview.innerHTML = `<img src="${e.target.result}" alt="미리보기">`;
      preview.className = 'image-preview';
    };
    
    reader.readAsDataURL(input.files[0]);
  } else {
    preview.innerHTML = '이미지를 선택하세요';
    preview.className = 'image-preview empty';
  }
}

// 포트폴리오 아이템 추가
function addPortfolioItem() {
  const title = document.getElementById('addTitle').value;
  const category = document.getElementById('addCategory').value;
  const description = document.getElementById('addDescription').value;
  const alt = document.getElementById('addAlt').value;
  const imageFile = document.getElementById('addImage').files[0];

  // 유효성 검사
  if (!title || !category || !description || !alt || !imageFile) {
    showMessage('모든 필드를 입력해주세요.', 'error');
    return;
  }

  // 이미지 처리 (실제 환경에서는 서버 업로드 필요)
  const reader = new FileReader();
  reader.onload = function(e) {
    // 임시 이미지 경로 생성 (실제로는 서버에 업로드)
    const imagePath = `images/portfolio/${category}-${Date.now()}.jpg`;
    
    const newItem = {
      title,
      category,
      description,
      alt,
      image: imagePath
    };

    try {
      portfolioManager.addItem(newItem);
      showMessage('포트폴리오가 성공적으로 추가되었습니다.', 'success');
      
      // 폼 초기화
      document.getElementById('addForm').reset();
      document.getElementById('addPreview').innerHTML = '이미지를 선택하세요';
      document.getElementById('addPreview').className = 'image-preview empty';
      
      // 목록 새로고침
      loadOverviewData();
      loadPortfolioList();
      
    } catch (error) {
      showMessage('포트폴리오 추가 중 오류가 발생했습니다.', 'error');
      console.error(error);
    }
  };
  
  reader.readAsDataURL(imageFile);
}

// 포트폴리오 아이템 수정
function editItem(id) {
  const item = portfolioManager.getItemById(id);
  if (!item) {
    showMessage('해당 포트폴리오를 찾을 수 없습니다.', 'error');
    return;
  }

  currentEditingId = id;

  // 수정 폼에 기존 데이터 채우기
  document.getElementById('editId').value = item.id;
  document.getElementById('editTitle').value = item.title;
  document.getElementById('editCategory').value = item.category;
  document.getElementById('editDescription').value = item.description;
  document.getElementById('editAlt').value = item.alt;
  
  // 기존 이미지 미리보기
  document.getElementById('editPreview').innerHTML = `<img src="../${item.image}" alt="${item.alt}">`;
  document.getElementById('editPreview').className = 'image-preview';

  // 모달 표시
  document.getElementById('editModal').style.display = 'flex';
}

// 포트폴리오 아이템 업데이트
function updatePortfolioItem() {
  const id = currentEditingId;
  const title = document.getElementById('editTitle').value;
  const category = document.getElementById('editCategory').value;
  const description = document.getElementById('editDescription').value;
  const alt = document.getElementById('editAlt').value;
  const imageFile = document.getElementById('editImage').files[0];

  if (!title || !category || !description || !alt) {
    showMessage('모든 필드를 입력해주세요.', 'error');
    return;
  }

  const updateData = {
    title,
    category,
    description,
    alt
  };

  // 새 이미지가 선택된 경우
  if (imageFile) {
    const reader = new FileReader();
    reader.onload = function(e) {
      // 새 이미지 경로 생성
      updateData.image = `images/portfolio/${category}-${Date.now()}.jpg`;
      
      performUpdate(id, updateData);
    };
    reader.readAsDataURL(imageFile);
  } else {
    performUpdate(id, updateData);
  }
}

// 업데이트 실행
function performUpdate(id, updateData) {
  try {
    portfolioManager.updateItem(id, updateData);
    showMessage('포트폴리오가 성공적으로 수정되었습니다.', 'success');
    
    closeEditModal();
    loadOverviewData();
    loadPortfolioList();
    
  } catch (error) {
    showMessage('포트폴리오 수정 중 오류가 발생했습니다.', 'error');
    console.error(error);
  }
}

// 수정 모달 닫기
function closeEditModal() {
  document.getElementById('editModal').style.display = 'none';
  document.getElementById('editForm').reset();
  currentEditingId = null;
}

// 포트폴리오 아이템 삭제
function deleteItem(id) {
  if (!confirm('정말로 이 포트폴리오를 삭제하시겠습니까?')) {
    return;
  }

  try {
    portfolioManager.deleteItem(id);
    showMessage('포트폴리오가 성공적으로 삭제되었습니다.', 'success');
    
    loadOverviewData();
    loadPortfolioList();
    
  } catch (error) {
    showMessage('포트폴리오 삭제 중 오류가 발생했습니다.', 'error');
    console.error(error);
  }
}

// 카테고리 추가
function addCategory() {
  const categoryName = document.getElementById('newCategory').value.trim();
  
  if (!categoryName) {
    showMessage('카테고리 이름을 입력해주세요.', 'error');
    return;
  }

  if (portfolioManager.addCategory(categoryName)) {
    showMessage('카테고리가 성공적으로 추가되었습니다.', 'success');
    document.getElementById('newCategory').value = '';
    
    loadCategoryOptions();
    loadCategoryList();
    loadOverviewData();
  } else {
    showMessage('이미 존재하는 카테고리입니다.', 'error');
  }
}

// 카테고리 삭제
function deleteCategory(categoryName) {
  if (!confirm(`'${categoryName}' 카테고리를 정말로 삭제하시겠습니까?\\n\\n이 카테고리에 속한 모든 포트폴리오도 함께 삭제됩니다.`)) {
    return;
  }

  try {
    portfolioManager.deleteCategory(categoryName);
    showMessage('카테고리가 성공적으로 삭제되었습니다.', 'success');
    
    loadCategoryOptions();
    loadCategoryList();
    loadOverviewData();
    loadPortfolioList();
    
  } catch (error) {
    showMessage('카테고리 삭제 중 오류가 발생했습니다.', 'error');
    console.error(error);
  }
}

// 메시지 표시
function showMessage(message, type) {
  const messageArea = document.getElementById('messageArea');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = message;
  
  messageArea.innerHTML = '';
  messageArea.appendChild(messageDiv);
  
  // 3초 후 메시지 제거
  setTimeout(() => {
    if (messageArea.contains(messageDiv)) {
      messageArea.removeChild(messageDiv);
    }
  }, 3000);
}