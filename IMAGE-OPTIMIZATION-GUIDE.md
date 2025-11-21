# 이미지 최적화 가이드

## 개요
이 프로젝트는 반응형 이미지 시스템을 구현하여 PC와 모바일에서 최적화된 이미지를 제공합니다.

## 디렉토리 구조

```
images/
├── portfolio/
│   ├── mobile/     # 모바일용 포트폴리오 이미지 (800px, 품질 75%)
│   ├── pc/         # PC용 포트폴리오 이미지 (1200px+, 품질 85%)
│   └── *.jpg       # 원본 고해상도 이미지 (클릭 시 모달 팝업용)
└── promotional/
    ├── mobile/     # 모바일용 홍보 이미지 (768px, 품질 80%)
    ├── pc/         # PC용 홍보 이미지 (1920px+, 품질 90%)
    └── *.png       # 원본 고해상도 이미지
```

**중요 - 이미지 사용 용도:**
- **mobile/** - 모바일 기기 목록에서 보이는 썸네일 (작은 크기, 빠른 로딩)
- **pc/** - 데스크톱 목록에서 보이는 썸네일 (중간 크기)
- **루트 폴더 (*.jpg, *.png)** - 클릭 시 모달 팝업에서 보이는 원본 이미지 (고해상도)

## 이미지 준비 방법

### 1. 포트폴리오 이미지

**원본 이미지 (images/portfolio/):**
- 용도: 클릭 시 모달에서 크게 보기
- 권장 크기: 2000px+ (제한 없음)
- 형식: JPG
- 품질: 90-95%

**PC용 이미지 (images/portfolio/pc/):**
- 용도: 데스크톱 목록 썸네일
- 권장 크기: 1200x800px 이상
- 형식: JPG
- 품질: 80-90%
- 파일명 예시: `메뉴판-1.jpg`, `스프링제본-1.jpg`

**모바일용 이미지 (images/portfolio/mobile/):**
- 용도: 모바일 목록 썸네일
- 권장 크기: 800x600px
- 형식: JPG
- 품질: 70-80%
- 파일명: PC용과 동일한 이름 사용

### 2. 홍보 이미지

**PC용 이미지 (images/promotional/pc/):**
- 권장 크기: 1920x1080px 이상
- 형식: PNG (투명 배경 필요 시) 또는 JPG
- 품질: 90%
- 파일명 예시: `urgent-deadline.png`, `perfect-result.png`

**모바일용 이미지 (images/promotional/mobile/):**
- 권장 크기: 768x432px
- 형식: PNG 또는 JPG
- 품질: 75-85%
- 파일명: PC용과 동일한 이름 사용

## 이미지 최적화 도구

### Python 스크립트 (권장)

```bash
# 1. Pillow 설치
pip install Pillow

# 2. 스크립트 실행
python python/optimize-images.py
```

**자동으로 처리:**
- PC 폴더의 이미지를 읽어서 모바일 폴더에 최적화된 버전 생성
- 리사이즈 + 압축 자동 처리
- 절감률 통계 표시

### 온라인 도구
- **TinyPNG** (https://tinypng.com/) - PNG/JPG 압축
- **Squoosh** (https://squoosh.app/) - 다양한 형식 최적화
- **Optimizilla** (https://imagecompressor.com/) - 일괄 이미지 압축

## 작동 원리

### 1. HTML Picture 태그 (홍보 이미지)

```html
<picture>
  <source media="(max-width: 768px)" srcset="images/promotional/mobile/urgent-deadline.png">
  <source media="(min-width: 769px)" srcset="images/promotional/pc/urgent-deadline.png">
  <img src="images/promotional/pc/urgent-deadline.png" alt="마감 임박" loading="lazy">
</picture>
```

- 브라우저가 자동으로 화면 크기에 맞는 이미지 선택
- `loading="lazy"`: 지연 로딩으로 초기 로딩 속도 향상

### 2. JavaScript 동적 경로 (포트폴리오 이미지)

`js/responsive-images.js`가 자동으로:
- 디바이스 타입 감지 (모바일/PC)
- 이미지 경로를 적절한 폴더로 변경
- 화면 크기 변경 시 자동 업데이트

```javascript
// 예시: 자동 경로 변환
'images/portfolio/메뉴판-1.jpg'
↓
모바일 목록: 'images/portfolio/mobile/메뉴판-1.jpg'
PC 목록: 'images/portfolio/pc/메뉴판-1.jpg'
클릭 시 모달: 'images/portfolio/메뉴판-1.jpg' (원본)
```

## 새 이미지 추가하기

### 1. 홍보 이미지 추가

1. PC용 이미지를 `images/promotional/pc/`에 저장
2. 모바일용 이미지를 `images/promotional/mobile/`에 저장
3. `index.html`에 picture 태그 추가:

```html
<div class="promotional-item animate-on-scroll">
  <picture>
    <source media="(max-width: 768px)" srcset="images/promotional/mobile/새이미지.png">
    <source media="(min-width: 769px)" srcset="images/promotional/pc/새이미지.png">
    <img src="images/promotional/pc/새이미지.png" alt="설명" class="promotional-img" loading="lazy">
  </picture>
</div>
```

### 2. 포트폴리오 이미지 추가

**방법 1: Python 스크립트 사용 (권장)**

```bash
# 1. 원본과 PC용 이미지 준비
images/portfolio/메뉴판-10.jpg        # 원본 (2000px+)
images/portfolio/pc/메뉴판-10.jpg     # PC용 (1200px로 리사이즈)

# 2. 자동으로 모바일 버전 생성
python python/optimize-images.py

# 3. 결과
images/portfolio/mobile/메뉴판-10.jpg  # 자동 생성됨 (800px)
```

**방법 2: 수동**

1. 원본 이미지: `images/portfolio/메뉴판-10.jpg` (고해상도)
2. PC용 이미지: `images/portfolio/pc/메뉴판-10.jpg` (1200px, 85% 품질)
3. 모바일용 이미지: `images/portfolio/mobile/메뉴판-10.jpg` (800px, 75% 품질)

**3. JSON 파일 업데이트**

`data/portfolio.json` 파일에 추가:

```json
{
  "id": 99,
  "title": "새 작업물",
  "description": "설명",
  "category": "메뉴판",
  "image": "images/portfolio/메뉴판-99.jpg",
  "alt": "새 작업물"
}
```

**참고:** portfolio.json의 경로는 원본 경로를 사용하며, `responsive-images.js`가 자동으로 적절한 폴더로 변환합니다.

## 성능 최적화 팁

### 1. 이미지 크기 최적화
- 모바일: 화면 크기 고려하여 작게 (768px 이하)
- PC: 고해상도 화면 고려하여 크게 (1920px 권장)
- 원본: 클릭 시에만 로드되므로 고해상도 유지 가능

### 2. 파일 형식 선택
- **JPG**: 사진, 복잡한 이미지 (더 작은 파일 크기)
- **PNG**: 투명 배경, 로고, 아이콘 (품질 유지)
- **WebP**: 최신 브라우저용 차세대 형식 (향후 고려)

### 3. 압축 품질
- 원본 이미지: 90-95% 품질 (모달 표시용)
- PC 썸네일: 85-90% 품질
- 모바일 썸네일: 70-80% 품질

### 4. Lazy Loading
- 모든 이미지에 `loading="lazy"` 속성 사용
- 스크롤 시점에 이미지 로드로 초기 로딩 시간 단축

## 브라우저 지원

- **Picture 태그**: IE 제외 모든 최신 브라우저 지원
- **Loading 속성**: Chrome 77+, Firefox 75+, Safari 15.4+
- **폴백**: 이전 브라우저는 `<img src="...">` 사용

## 문제 해결

### 이미지가 표시되지 않을 때
1. 파일명이 정확한지 확인 (대소문자, 한글 인코딩)
2. 이미지가 올바른 폴더에 있는지 확인
3. 브라우저 콘솔에서 404 에러 확인
4. 캐시 삭제 후 재시도 (Ctrl+Shift+R)

### 모바일/PC 이미지 전환이 안 될 때
1. `responsive-images.js`가 로드되었는지 확인
2. 브라우저 콘솔에서 JavaScript 에러 확인
3. 이미지 경로가 올바른지 확인

### 클릭 시 원본이 안 보일 때
1. 루트 `images/portfolio/` 폴더에 원본 파일이 있는지 확인
2. 파일명이 JSON에 기록된 것과 일치하는지 확인

```bash
# 원본 이미지 복사
cp images/portfolio/pc/*.jpg images/portfolio/
```

## 유지보수

### 정기 점검
- 월 1회: 사용하지 않는 이미지 정리
- 분기 1회: 이미지 압축 최적화 재실행
- 반기 1회: 새로운 이미지 형식 (WebP 등) 도입 검토

### 백업
- 원본 고해상도 이미지는 별도 보관
- Git에는 최적화된 이미지만 커밋
