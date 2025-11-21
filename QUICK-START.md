# 빠른 시작 가이드

## ✅ 완료된 작업

반응형 이미지 시스템이 성공적으로 구현되었습니다!

### 생성된 이미지
- ✅ 포트폴리오 모바일: 47개
- ✅ 홍보 모바일: 6개
- ✅ 원본 이미지: 클릭 시 고해상도 표시

## 📁 디렉토리 구조

```
images/
├── portfolio/
│   ├── *.jpg           (원본 - 클릭 시 모달 표시)
│   ├── pc/             (47개 - PC 목록용)
│   └── mobile/         (47개 - 모바일 목록용) ✅ 생성됨
└── promotional/
    ├── *.png           (원본)
    ├── pc/             (6개 - PC 배너용)
    └── mobile/         (6개 - 모바일 배너용) ✅ 생성됨
```

## 🎯 동작 방식

### 1. 포트폴리오 목록
- **모바일**: `images/portfolio/mobile/메뉴판-1.jpg` (800px, 작음)
- **PC**: `images/portfolio/pc/메뉴판-1.jpg` (원본 크기)
- **클릭 시 모달**: `images/portfolio/메뉴판-1.jpg` (원본 고해상도)

### 2. 홍보 배너
- **모바일**: `images/promotional/mobile/urgent-deadline.png` (768px)
- **PC**: `images/promotional/pc/urgent-deadline.png` (1920px)

## 🚀 새 이미지 추가 방법

### 방법 1: 자동 (권장)

```bash
# 1. PC 폴더에 이미지 추가
images/portfolio/pc/새작업물-1.jpg

# 2. 스크립트 실행
python python/optimize-images.py

# 3. 자동으로 생성됨
images/portfolio/mobile/새작업물-1.jpg
```

### 방법 2: 기존 이미지에서 생성

```bash
# 원본 이미지가 루트에 있는 경우
cp images/portfolio/*.jpg images/portfolio/pc/
python python/optimize-images.py
```

## 📊 최적화 결과

**포트폴리오**: 16MB → 824KB (95% 절감)
**홍보**: 8.9MB → 5.2MB (42% 절감)

특히 큰 이미지들:
- 대봉투-1.jpg: 3.9MB → 48KB (99% 절감)
- 탁상달력-2.jpg: 3.2MB → 46KB (99% 절감)

## 🔧 문제 해결

### 스크립트 실행 시 이미지가 안 생기는 경우

**원인**: PC 폴더에 이미지가 없음

**해결**:
```bash
# 원본 이미지를 PC 폴더로 복사
cp images/portfolio/*.jpg images/portfolio/pc/
cp images/promotional/*.png images/promotional/pc/

# 스크립트 재실행
python python/optimize-images.py
```

### 한글이 깨지는 경우

**해결**: 업데이트된 스크립트는 영어 출력으로 변경되어 문제 해결됨

### Pillow 설치 오류

```bash
pip install Pillow
```

## 📱 테스트 방법

### 1. 모바일 테스트
1. 크롬 개발자 도구 (F12)
2. Device Toolbar 켜기 (Ctrl+Shift+M)
3. iPhone/Android 선택
4. 페이지 새로고침
5. Network 탭에서 `mobile/` 경로 확인

### 2. PC 테스트
1. 일반 브라우저로 접속
2. Network 탭에서 `pc/` 경로 확인
3. 포트폴리오 이미지 클릭
4. 모달에서 원본 크기 이미지 확인

### 3. 클릭 테스트
1. 포트폴리오 페이지 접속
2. 이미지 클릭
3. 모달 팝업에서 선명한 고해상도 이미지 확인

## 📝 JSON 파일 업데이트

새 이미지 추가 시 `data/portfolio.json`에 등록:

```json
{
  "id": 100,
  "title": "새 작업물",
  "description": "설명",
  "category": "메뉴판",
  "image": "images/portfolio/새작업물-1.jpg",
  "alt": "새 작업물"
}
```

**중요**: 경로는 원본 경로를 사용! (mobile/pc 폴더 경로 아님)

## 🎉 완료!

시스템이 완벽하게 작동합니다:
- ✅ 모바일: 빠른 로딩
- ✅ PC: 적절한 품질
- ✅ 클릭: 원본 고해상도
- ✅ 자동화: Python 스크립트

---

상세 가이드: [IMAGE-OPTIMIZATION-GUIDE.md](IMAGE-OPTIMIZATION-GUIDE.md)
