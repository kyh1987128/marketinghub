
// 🚀 완전히 단순화된 검증 시스템 - Simplified Validation Engine
export interface ValidationResult {
  isValid: boolean;
  level: 'error' | 'warning' | 'info';
  field: string;
  message: string;
  suggestions: string[];
  autoFix?: {
    action: string;
    value: any;
  };
}

export interface ValidationContext {
  step: number;
  formData: any;
  previousSteps: any[];
}

// 🎯 단순화된 목적 카테고리 정의
export const purposeCategories = [
  {
    id: 'marketing-promotion',
    title: '홍보·마케팅',
    purposes: ['브랜드 홍보', '제품 소개', '서비스 소개', '매출 증대', '고객 확보', '시장 진입'],
    keywords: ['홍보', '마케팅', '브랜드', '제품', '서비스', '판매', '고객']
  },
  {
    id: 'education-guidance', 
    title: '교육·안내',
    purposes: ['교육·훈련', '안전·보건', '매뉴얼·가이드', '온보딩', '프로세스 안내', '제품 사용법'],
    keywords: ['교육', '훈련', '안전', '가이드', '매뉴얼', '설명', '안내']
  },
  {
    id: 'event-festival',
    title: '행사·이벤트', 
    purposes: ['행사·이벤트', '세미나·컨퍼런스', '런칭 행사', '시상식·축하', '페스티벌', '전시회'],
    keywords: ['행사', '이벤트', '축하', '시상', '페스티벌', '전시']
  },
  {
    id: 'corporate-business',
    title: '기업·조직',
    purposes: ['채용·인사', '투자·IR', '내부 소통', '기업 문화', '협력사 소개', '언론 홍보'],
    keywords: ['기업', '채용', '투자', 'IR', '소통', '문화', '협력']
  },
  {
    id: 'special-purpose',
    title: '특수 목적',
    purposes: ['기록·아카이브', '다큐멘터리', '예술·창작', '개인 기념', '웨딩·가족', '기타'],
    keywords: ['기록', '다큐', '예술', '창작', '개인', '웨딩', '가족']
  }
];

// 🚀 단순화된 AI 추천 시스템
export const getAIRecommendations = (inputText: string): {
  recommendations: Array<{
    purpose: string;
    confidence: number;
    reason: string;
  }>;
  analysisResult: {
    detectedCategories: string[];
    primaryContext: string;
    suggestedApproach: string;
  };
} => {
  if (!inputText.trim()) {
    return {
      recommendations: [],
      analysisResult: {
        detectedCategories: [],
        primaryContext: '',
        suggestedApproach: ''
      }
    };
  }

  const lowerInput = inputText.toLowerCase();
  const recommendations = [];

  // 단순한 키워드 매칭
  if (lowerInput.includes('안전') || lowerInput.includes('교육') || lowerInput.includes('훈련')) {
    recommendations.push({
      purpose: '안전·보건',
      confidence: 0.9,
      reason: '안전 및 교육 키워드 감지'
    });
    recommendations.push({
      purpose: '교육·훈련',
      confidence: 0.8,
      reason: '교육 관련 키워드 감지'
    });
  }
  
  if (lowerInput.includes('홍보') || lowerInput.includes('마케팅') || lowerInput.includes('브랜드')) {
    recommendations.push({
      purpose: '브랜드 홍보',
      confidence: 0.8,
      reason: '마케팅 키워드 감지'
    });
  }

  if (lowerInput.includes('행사') || lowerInput.includes('이벤트')) {
    recommendations.push({
      purpose: '행사·이벤트',
      confidence: 0.7,
      reason: '이벤트 키워드 감지'
    });
  }

  return {
    recommendations: recommendations.slice(0, 3),
    analysisResult: {
      detectedCategories: [],
      primaryContext: '',
      suggestedApproach: ''
    }
  };
};

// 🚀 완전히 단순화된 검증 시스템 - 경고만 표시, 진행은 허용
export const getSemanticConflicts = (inputText: string, selectedPurposes: string[]): {
  conflicts: Array<{
    purpose: string;
    reason: string;
    severity: 'high' | 'medium' | 'low';
    suggestion?: string;
  }>;
  blockedPurposes: string[];
} => {
  // 모든 목적 허용, 경고만 표시
  return { conflicts: [], blockedPurposes: [] };
};

// 🚀 단순화된 차단 옵션 검사 - 아무것도 차단하지 않음
export const getDisabledOptions = (step: number, data: any): { [key: string]: string[] } => {
  return {}; // 아무것도 차단하지 않음
};

// 🚀 단순화된 차단 사유 - 빈 문자열 반환
export const getDisabledReason = (step: number, category: string, value: string, data: any): string => {
  return ''; // 아무것도 차단하지 않으므로 사유 없음
};

// 🚀 단순화된 검증 함수들
export const validateFormat = (data: any, step: number): ValidationResult[] => {
  const results: ValidationResult[] = [];
  
  if (step === 1) {
    // 최소한의 필수 검증만
    if (!data.purposes || data.purposes.length === 0) {
      results.push({
        isValid: false,
        level: 'warning', // error → warning으로 변경
        field: 'purposes',
        message: '제작 목적을 선택하시면 더 정확한 견적을 제공할 수 있습니다.',
        suggestions: ['목적을 선택해주세요']
      });
    }
    
    if (!data.serviceType) {
      results.push({
        isValid: false,
        level: 'warning', // error → warning으로 변경
        field: 'serviceType',
        message: '서비스 타입을 선택해주세요.',
        suggestions: ['필요한 서비스를 선택하세요']
      });
    }
  }
  
  return results;
};

export const validateLogic = (data: any, step: number): ValidationResult[] => {
  // 논리 검증 완전 제거 - 경고만 표시
  return [];
};

export const validateConsistency = (data: any, step: number): ValidationResult[] => {
  // 일관성 검증 완전 제거
  return [];
};

export const validateBusiness = (data: any, step: number): ValidationResult[] => {
  // 비즈니스 검증 완전 제거
  return [];
};

export const validateStep = (step: number, data: any, context?: ValidationContext): ValidationResult[] => {
  const allResults: ValidationResult[] = [];
  
  // 최소한의 포맷 검증만 실행
  allResults.push(...validateFormat(data, step));
  
  return allResults;
};

export const applyAutoFix = (data: any, validationResult: ValidationResult): any => {
  return data;
};

export const getValidationMessage = (result: ValidationResult): string => {
  const levelEmojis = { error: '❌', warning: '⚠️', info: 'ℹ️' };
  return `${levelEmojis[result.level]} ${result.message}`;
};

export const summarizeValidation = (results: ValidationResult[]): {
  isValid: boolean;
  canProceed: boolean;
  errorCount: number;
  warningCount: number;
  infoCount: number;
} => {
  const errorCount = results.filter(r => r.level === 'error').length;
  const warningCount = results.filter(r => r.level === 'warning').length;
  const infoCount = results.filter(r => r.level === 'info').length;
  
  return {
    isValid: true, // 항상 true
    canProceed: true, // 항상 진행 허용
    errorCount,
    warningCount,
    infoCount
  };
};

// 🚀 완전히 제거된 복잡한 함수들 - 빈 함수로 대체
export const parseUserInputComprehensive = (inputText: string) => ({
  detectedCategories: [],
  primaryContext: '',
  extractedInfo: {},
  confidence: 0
});

export const validateCrossStepConsistency = (currentStep: number, formData: any) => [];

export const getFilteredPurposesByContext = (inputText: string, allowAllCategories: boolean = true) => ({
  availableCategories: purposeCategories.map(cat => cat.id),
  blockedCategories: [],
  availablePurposes: purposeCategories.flatMap(cat => cat.purposes),
  blockedPurposes: [],
  filterReason: ''
});

export const getSemanticValidationForAllSteps = (step: number, data: any) => ({
  conflicts: [],
  blockedOptions: {}
});
