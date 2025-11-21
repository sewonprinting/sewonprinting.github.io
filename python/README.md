# Python 이미지 최적화 도구

이 폴더에는 이미지 자동 최적화를 위한 Python 스크립트가 있습니다.

## 설치 방법

### 1. Python 설치 확인

```bash
python --version
# 또는
python3 --version
```

Python이 없다면 https://www.python.org/downloads/ 에서 설치하세요.

### 2. Pillow 라이브러리 설치

```bash
pip install Pillow
```

## 사용 방법

### 프로젝트 루트에서 실행

```bash
python python/optimize-images.py
```

### 또는 python 폴더에서 실행

```bash
cd python
python optimize-images.py
```

## 작동 방식

1. **포트폴리오 이미지**
   - 입력: `images/portfolio/pc/*.jpg`
   - 출력: `images/portfolio/mobile/*.jpg`
   - 크기: 800px 너비로 리사이즈
   - 품질: 75%

2. **홍보 이미지**
   - 입력: `images/promotional/pc/*.png, *.jpg`
   - 출력: `images/promotional/mobile/*.png, *.jpg`
   - 크기: 768px 너비로 리사이즈
   - 품질: 80%

## 기능

- ✅ 자동 비율 유지 리사이즈
- ✅ 이미지 압축 및 최적화
- ✅ PNG/JPG 자동 감지
- ✅ 투명 배경 처리 (PNG → RGB 변환)
- ✅ 파일 크기 절감률 표시
- ✅ 일괄 처리

## 문제 해결

### ModuleNotFoundError: No module named 'PIL'

```bash
pip install Pillow
```

### 이미지 폴더를 찾을 수 없습니다

프로젝트 루트 디렉토리에서 실행했는지 확인하세요.

```bash
# 올바른 위치
sewonprinting.github.io/
  ├── images/
  ├── python/
  └── ...

# 실행
python python/optimize-images.py
```

### 이미지가 처리되지 않습니다

1. `images/portfolio/pc/` 폴더에 이미지가 있는지 확인
2. 이미지 파일 형식이 `.jpg`, `.jpeg`, `.png`인지 확인
3. 파일 권한 확인

## 예시 출력

```
==================================================
세원프린팅 이미지 최적화 스크립트
==================================================

✓ Pillow 확인됨
✓ 작업 디렉토리: D:\github\sewonprinting.github.io

>>> 1. 포트폴리오 이미지 최적화
--------------------------------------------------
처리 중: 메뉴판-1.jpg
  ✓ 완료: 245.67 KB → 89.34 KB (63.6% 절감)
처리 중: 스프링제본-1.jpg
  ✓ 완료: 312.89 KB → 124.56 KB (60.2% 절감)

  📊 총계: 558.56 KB → 213.90 KB (61.7% 절감)
  총 2개 이미지 처리 완료

>>> 2. 홍보 이미지 최적화
--------------------------------------------------
처리 중: urgent-deadline.png
  ✓ 완료: 1573.22 KB → 456.78 KB (71.0% 절감)

  📊 총계: 1573.22 KB → 456.78 KB (71.0% 절감)
  총 1개 이미지 처리 완료

==================================================
최적화 완료!
==================================================

다음 단계:
1. images/portfolio/mobile/ 폴더의 이미지 확인
2. images/promotional/mobile/ 폴더의 이미지 확인
3. 이미지 품질이 만족스러운지 테스트
4. Git에 변경사항 커밋
```
