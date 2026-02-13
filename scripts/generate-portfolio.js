/**
 * 포트폴리오 자동 생성 스크립트
 *
 * 사용법:
 * 1. images/portfolio/ 폴더에 이미지를 넣습니다
 * 2. 파일명 형식: 카테고리명-번호.jpg (예: 메뉴판-1.jpg, 스프링제본-2.jpg)
 * 3. 터미널에서 실행: node scripts/generate-portfolio.js
 * 4. data/portfolio.json이 자동으로 업데이트됩니다
 */

const fs = require('fs');
const path = require('path');

// 경로 설정
const ROOT_DIR = path.join(__dirname, '..');
const PORTFOLIO_DIR = path.join(ROOT_DIR, 'images', 'portfolio');
const OUTPUT_FILE = path.join(ROOT_DIR, 'data', 'portfolio.json');

// 지원하는 이미지 확장자
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

// 카테고리별 기본 설명 (필요시 수정)
const CATEGORY_DESCRIPTIONS = {
  '메뉴판': ['칼라출력 + 코팅', '고급 코팅 마감', '다양한 사이즈 지원', '고급 마감 처리', '저렴한 메뉴판 제작'],
  '스프링제본': ['앞뒤 PP필름 포함', '다양한 색상 선택 가능', '대량 주문 가능', '고급 표지 옵션', '내구성 높은 마감'],
  '무선제본': ['표지칼라 무광코팅', '책자형 제본', '고급 마감처리', '대량 제작 가능', '맞춤형 옵션'],
  '책자제작': ['대량시 표지 선택가능', '예약시 당일 작업 가능', '다양한 제본 방식', '맞춤형 표지 디자인', '고급 인쇄'],
  '결산서.세무조정계산서': ['대량 제작 가능', '전문 제본', '회계사무소 납품'],
  '제안서': ['고급 제본', '맞춤형 제작', '고급 표지 옵션', '기업 맞춤형'],
  '도면출력제본': ['각종 도면 출력제본', '건축/인테리어 도면', '대형 출력 가능'],
  '카드.초대장': ['중앙절취선 포함', '엽서타입', '맞춤형 디자인', '고급 용지'],
  '팜플렛.전단지': ['고급 인쇄', '맞춤형 디자인', '대량 제작 가능'],
  '포토폴리오': ['고급 제작', '맞춤형 디자인', '고급 용지 옵션'],
  '탁상달력': ['고급 용지 옵션', '맞춤형 디자인', '기업 로고 인쇄'],
  '대봉투': ['고급 용지 옵션', '맞춤형 사이즈', '대량 제작']
};

// 기본 설명
const DEFAULT_DESCRIPTION = '고급 제작';

function getDescription(category, index) {
  const descriptions = CATEGORY_DESCRIPTIONS[category];
  if (descriptions && descriptions.length > 0) {
    return descriptions[index % descriptions.length];
  }
  return DEFAULT_DESCRIPTION;
}

function getTitle(category) {
  // 카테고리명에서 제목 생성
  const titleMap = {
    '결산서.세무조정계산서': '세무조정계산서',
    '카드.초대장': '카드/초대장',
    '팜플렛.전단지': '팜플렛/전단지',
    '도면출력제본': '도면 출력 제본'
  };
  return titleMap[category] || category;
}

function generatePortfolio() {
  console.log('포트폴리오 자동 생성 시작...\n');

  // 이미지 폴더 확인
  if (!fs.existsSync(PORTFOLIO_DIR)) {
    console.error(`오류: 이미지 폴더가 없습니다: ${PORTFOLIO_DIR}`);
    process.exit(1);
  }

  // 이미지 파일 목록 가져오기
  const files = fs.readdirSync(PORTFOLIO_DIR);
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return IMAGE_EXTENSIONS.includes(ext);
  });

  console.log(`발견된 이미지 파일: ${imageFiles.length}개\n`);

  // 카테고리별로 파일 분류
  const categoryMap = new Map();
  const invalidFiles = [];

  imageFiles.forEach(file => {
    const nameWithoutExt = path.basename(file, path.extname(file));
    const match = nameWithoutExt.match(/^(.+)-(\d+)$/);

    if (match) {
      const category = match[1];
      const number = parseInt(match[2], 10);

      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category).push({ file, number });
    } else {
      invalidFiles.push(file);
    }
  });

  // 잘못된 파일명 경고
  if (invalidFiles.length > 0) {
    console.log('⚠️  잘못된 파일명 형식 (무시됨):');
    invalidFiles.forEach(file => console.log(`   - ${file}`));
    console.log('   올바른 형식: 카테고리명-번호.jpg (예: 메뉴판-1.jpg)\n');
  }

  // 카테고리 목록 생성 (정렬)
  const categories = Array.from(categoryMap.keys()).sort();

  // 포트폴리오 아이템 생성
  const items = [];
  let id = 1;

  categories.forEach(category => {
    const categoryFiles = categoryMap.get(category);
    // 번호순 정렬
    categoryFiles.sort((a, b) => a.number - b.number);

    categoryFiles.forEach((item, index) => {
      items.push({
        id: id++,
        title: getTitle(category),
        description: getDescription(category, index),
        category: category,
        image: `images/portfolio/${item.file}`,
        alt: getTitle(category)
      });
    });
  });

  // JSON 생성
  const portfolioData = {
    categories: categories,
    items: items
  };

  // 파일 저장
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(portfolioData, null, 2), 'utf8');

  // 결과 출력
  console.log('✅ 포트폴리오 생성 완료!\n');
  console.log(`📁 출력 파일: ${OUTPUT_FILE}`);
  console.log(`📂 카테고리: ${categories.length}개`);
  console.log(`🖼️  이미지: ${items.length}개\n`);

  console.log('카테고리별 현황:');
  categories.forEach(category => {
    const count = categoryMap.get(category).length;
    console.log(`   ${category}: ${count}개`);
  });

  console.log('\n💡 팁: 설명을 수정하려면 스크립트의 CATEGORY_DESCRIPTIONS를 편집하세요.');
}

// 실행
generatePortfolio();
