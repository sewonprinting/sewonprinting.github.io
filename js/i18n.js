// 다국어 지원 시스템 (Internationalization)

class I18nManager {
  constructor() {
    this.currentLanguage = 'ko';
    this.translations = {};
    this.defaultLanguage = 'ko';
    this.supportedLanguages = ['ko', 'en'];
    
    // 초기화
    this.init();
  }

  async init() {
    try {
      // 저장된 언어 설정 로드
      this.loadSavedLanguage();
      
      // URL 파라미터에서 언어 확인
      this.checkUrlLanguage();
      
      // 번역 데이터 로드
      await this.loadTranslations();
      
      // 언어 적용
      this.applyLanguage();
      
      console.log('다국어 시스템 초기화 완료:', this.currentLanguage);
    } catch (error) {
      console.error('다국어 시스템 초기화 오류:', error);
      this.currentLanguage = this.defaultLanguage;
    }
  }

  // 저장된 언어 설정 로드
  loadSavedLanguage() {
    const savedLang = localStorage.getItem('sewon-language');
    if (savedLang && this.supportedLanguages.includes(savedLang)) {
      this.currentLanguage = savedLang;
    }
  }

  // URL 파라미터에서 언어 확인
  checkUrlLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    
    if (langParam && this.supportedLanguages.includes(langParam)) {
      this.currentLanguage = langParam;
      // URL 파라미터로 설정된 언어는 저장
      this.saveLanguagePreference(langParam);
    }
  }

  // 번역 데이터 로드
  async loadTranslations() {
    try {
      // 현재 경로에 따라 상대 경로 조정
      const currentPath = window.location.pathname;
      let dataPath;
      
      if (currentPath.includes('/pages/')) {
        dataPath = '../data/translations.json';
      } else if (currentPath.includes('/admin/')) {
        dataPath = '../data/translations.json';
      } else {
        dataPath = 'data/translations.json';
      }
      
      const response = await fetch(dataPath + '?cache=bust&t=' + Date.now());
      if (!response.ok) {
        throw new Error(`번역 데이터를 불러올 수 없습니다. Status: ${response.status}`);
      }
      
      this.translations = await response.json();
      console.log('번역 데이터 로드 성공');
    } catch (error) {
      console.error('번역 데이터 로드 오류:', error);
      // 기본 번역 데이터 사용
      this.translations = this.getDefaultTranslations();
    }
  }

  // 기본 번역 데이터 (백업용)
  getDefaultTranslations() {
    return {
      ko: {
        navigation: {
          home: "홈",
          services: "서비스",
          portfolio: "성과품",
          location: "오시는길",
          contact: "문의하기"
        }
      },
      en: {
        navigation: {
          home: "Home",
          services: "Services", 
          portfolio: "Portfolio",
          location: "Location",
          contact: "Contact"
        }
      }
    };
  }

  // 언어 변경
  async changeLanguage(language) {
    if (!this.supportedLanguages.includes(language)) {
      console.error('지원하지 않는 언어:', language);
      return;
    }

    this.currentLanguage = language;
    this.saveLanguagePreference(language);
    
    // 언어 적용
    this.applyLanguage();
    
    // 포트폴리오 데이터도 언어에 맞게 다시 로드
    if (window.portfolioManager) {
      await window.portfolioManager.loadData();
      window.portfolioManager.renderPortfolio();
    }
    
    console.log('언어 변경됨:', language);
  }

  // 언어 설정 저장
  saveLanguagePreference(language) {
    localStorage.setItem('sewon-language', language);
  }

  // 현재 언어 가져오기
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  // 번역 텍스트 가져오기
  getText(key, defaultText = '') {
    try {
      const keys = key.split('.');
      let text = this.translations[this.currentLanguage];
      
      for (const k of keys) {
        if (text && text[k]) {
          text = text[k];
        } else {
          // 현재 언어에 해당 키가 없으면 기본 언어에서 찾기
          text = this.translations[this.defaultLanguage];
          for (const k2 of keys) {
            if (text && text[k2]) {
              text = text[k2];
            } else {
              return defaultText || key;
            }
          }
          break;
        }
      }
      
      return text || defaultText || key;
    } catch (error) {
      console.error('번역 텍스트 가져오기 오류:', error);
      return defaultText || key;
    }
  }

  // 언어 적용
  applyLanguage() {
    try {
      // HTML lang 속성 변경
      document.documentElement.lang = this.currentLanguage;
      
      // data-i18n 속성을 가진 요소들 번역
      const elements = document.querySelectorAll('[data-i18n]');
      elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const text = this.getText(key);
        
        if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'email')) {
          element.placeholder = text;
        } else if (element.tagName === 'INPUT' && element.type === 'submit') {
          element.value = text;
        } else if (element.tagName === 'TEXTAREA') {
          element.placeholder = text;
        } else {
          element.textContent = text;
        }
      });

      // 메타 태그 업데이트
      this.updateMetaTags();
      
      // 언어 선택기 UI 업데이트
      this.updateLanguageSwitcher();
      
    } catch (error) {
      console.error('언어 적용 오류:', error);
    }
  }

  // 메타 태그 업데이트
  updateMetaTags() {
    try {
      // 제목 업데이트
      const titleText = this.getText('site.title');
      if (titleText && titleText !== 'site.title') {
        document.title = titleText;
      }
      
      // 설명 메타 태그 업데이트
      const descriptionMeta = document.querySelector('meta[name="description"]');
      if (descriptionMeta) {
        const descText = this.getText('site.description');
        if (descText && descText !== 'site.description') {
          descriptionMeta.content = descText;
        }
      }
      
      // 키워드 메타 태그 업데이트
      const keywordsMeta = document.querySelector('meta[name="keywords"]');
      if (keywordsMeta) {
        const keywordsText = this.getText('site.keywords');
        if (keywordsText && keywordsText !== 'site.keywords') {
          keywordsMeta.content = keywordsText;
        }
      }
    } catch (error) {
      console.error('메타 태그 업데이트 오류:', error);
    }
  }

  // 언어 선택기 UI 업데이트
  updateLanguageSwitcher() {
    const languageSwitcher = document.querySelector('.language-switcher');
    if (languageSwitcher) {
      const buttons = languageSwitcher.querySelectorAll('.lang-btn');
      buttons.forEach(btn => {
        const lang = btn.getAttribute('data-lang');
        if (lang === this.currentLanguage) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }
  }

  // 지원 언어 목록 가져오기
  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  // 언어 이름 가져오기
  getLanguageName(langCode) {
    const names = {
      ko: '한국어',
      en: 'English'
    };
    return names[langCode] || langCode;
  }
}

// 전역 인스턴스 생성
window.i18nManager = new I18nManager();

// DOM 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', function() {
  // 이미 초기화되었다면 건너뛰기
  if (window.i18nManager.translations && Object.keys(window.i18nManager.translations).length > 0) {
    return;
  }
  
  // 다시 초기화 시도
  window.i18nManager.init();
});

// 언어 변경 함수 (전역에서 사용 가능)
function changeLanguage(language) {
  if (window.i18nManager) {
    window.i18nManager.changeLanguage(language);
  }
}

// 번역 텍스트 가져오기 함수 (전역에서 사용 가능)
function t(key, defaultText = '') {
  if (window.i18nManager) {
    return window.i18nManager.getText(key, defaultText);
  }
  return defaultText || key;
}