
'use client';

import { useState } from 'react';
import Step1Purpose from './steps/Step1Purpose';
import Step2Target from './steps/Step2Target';
import Step3Details from './steps/Step3Details';
import Step4Scale from './steps/Step4Scale';
import Step5Elements from './steps/Step5Elements';
import Step6Reference from './steps/Step6Reference';
import Step7Estimate from './steps/Step7Estimate';
import Step8Inquiry from './steps/Step8Inquiry';
import ValidationPanel from './ValidationPanel';
import { validateStep, summarizeValidation, ValidationResult } from '../lib/validationRules';

interface FormData {
  purposes: string[];
  userInput?: string;
  aiConfidence: number;
  // 기존 Step2의 데이터를 Step1으로 통합
  serviceType?: 'single' | 'package';
  categories?: string[];
  primaryCategory?: string;
  // 타겟 데이터 추가
  targetData?: {
    ageGroups: string[];
    gender: string[];
    regions: string[];
    occupations: string[];
    interests: string[];
    nationality: string[];
    customTarget?: string;
  };
  // 기존 category 필드는 유지 (하위 호환성)
  category: string;
  subTasks: Array<{ category: string; detail: string }>;
  details: string[];
  productionType?: string;
  scale: {
    type: string;
    value: string;
    custom?: string;
  };
  elements: {
    [key: string]: {
      enabled: boolean;
      level?: number;
      quantity?: number;
      selectedOption?: number;
      option?: string;
    };
  };
  selectedReferences?: string[];
  references: Array<{
    id: string;
    title: string;
    thumbnail: string;
    tags: string[];
    url?: string;
    type: 'custom' | 'ai';
    analysis?: any;
  }>;
  customReferences?: Array<any>;
  aiReferences?: Array<any>;
  toneKeywords: string[];
  estimate: {
    low: number;
    mid: number;
    high: number;
    breakdown: Array<{ name: string; impact: number }>;
  };
  timeline: {
    total: number;
    phases: Array<{ name: string; days: number }>;
  };
}

export default function StepForm() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    purposes: [],
    userInput: '',
    aiConfidence: 0,
    serviceType: 'single',
    categories: [],
    primaryCategory: '',
    targetData: {
      ageGroups: [],
      gender: [],
      regions: [],
      occupations: [],
      interests: [],
      nationality: [],
      customTarget: ''
    },
    category: '', // 하위 호환성을 위해 유지
    subTasks: [],
    details: [],
    scale: { type: '', value: '' },
    elements: {},
    selectedReferences: [],
    references: [],
    customReferences: [],
    aiReferences: [],
    toneKeywords: [],
    estimate: {
      low: 0,
      mid: 0,
      high: 0,
      breakdown: [],
    },
    timeline: {
      total: 0,
      phases: [],
    },
  });
  
  // 스마트 검증 시스템 상태
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [showValidation, setShowValidation] = useState(false);

  const updateFormData = (stepData: Partial<FormData>) => {
    setFormData((prev) => {
      const newData = { ...prev, ...stepData };
      
      // Step1에서 넘어온 데이터 처리: primaryCategory를 category에도 동기화
      if (stepData.primaryCategory && !stepData.category) {
        newData.category = stepData.primaryCategory;
      }
      
      // 데이터 업데이트 후 실시간 검증 실행
      const results = validateStep(currentStep, newData);
      setValidationResults(results);
      
      return newData;
    });
  };

  const nextStep = () => {
    // 진행 전 최종 검증
    const results = validateStep(currentStep, formData);
    const summary = summarizeValidation(results);
    
    setValidationResults(results);
    
    if (summary.canProceed) {
      setCurrentStep((prev) => Math.min(prev + 1, 8));
      setShowValidation(false); // 다음 단계로 넘어가면 검증 패널 숨기기
    } else {
      setShowValidation(true); // 오류가 있으면 검증 패널 표시
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setShowValidation(false);
  };

  // 처음으로 돌아가기 함수 추가
  const goToFirstStep = () => {
    setCurrentStep(1);
    setShowValidation(false);
    // 폼 데이터 초기화는 선택사항 (사용자가 원할 경우만)
  };

  // 자동 수정 핸들러
  const handleAutoFix = (fixedData: any, result: ValidationResult) => {
    setFormData(fixedData);
    
    // 수정 후 재검증
    const newResults = validateStep(currentStep, fixedData);
    setValidationResults(newResults);
  };

  const renderStep = () => {
    const stepProps = {
      data: formData,
      onUpdate: updateFormData,
      onNext: nextStep,
      onPrev: prevStep,
    };

    switch (currentStep) {
      case 1:
        return (
          <Step1Purpose
            data={formData}
            onUpdate={updateFormData}
            onNext={nextStep}
          />
        );
      case 2:
        return <Step2Target {...stepProps} />;
      case 3:
        return <Step3Details {...stepProps} />;
      case 4:
        return <Step4Scale {...stepProps} />;
      case 5:
        return <Step5Elements {...stepProps} />;
      case 6:
        return <Step6Reference {...stepProps} />;
      case 7:
        return <Step7Estimate {...stepProps} />;
      case 8:
        return (
          <Step8Inquiry
            data={formData}
            onUpdate={updateFormData}
            onPrev={prevStep}
            onGoToFirst={goToFirstStep} // 처음으로 돌아가기 함수 전달
          />
        );
      default:
        return null;
    }
  };

  const totalSteps = 8;
  const progressWidth = Math.min(Math.max((currentStep / totalSteps) * 100, 0), 100);
  const validationSummary = summarizeValidation(validationResults);

  return (
    <div className="max-w-4xl mx-auto p-6" suppressHydrationWarning={true}>
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            제작 의뢰 견적 시스템
          </h1>
          <div className="flex items-center space-x-4">
            {/* 검증 상태 표시 */}
            {validationResults.length > 0 && (
              <button
                onClick={() => setShowValidation(!showValidation)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  validationSummary.errorCount > 0
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : validationSummary.warningCount > 0
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                <i className="ri-shield-check-line mr-1 w-4 h-4 flex items-center justify-center"></i>
                검증 {validationResults.length}
              </button>
            )}
            
            <span className="text-lg font-semibold text-blue-600" suppressHydrationWarning={true}>
              Step {currentStep}/8
            </span>
          </div>
        </div>
        
        {/* 프로그레스 바 */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressWidth}%` }}
          />
        </div>
        
        {/* 진행 불가 경고 */}
        {!validationSummary.canProceed && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center text-red-800">
              <i className="ri-error-warning-line mr-2 w-5 h-5 flex items-center justify-center"></i>
              <span className="font-medium">
                {validationSummary.errorCount}개의 오류를 해결해야 다음 단계로 진행할 수 있습니다.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 검증 패널 */}
      {showValidation && validationResults.length > 0 && (
        <div className="mb-6">
          <ValidationPanel
            validationResults={validationResults}
            onAutoFix={handleAutoFix}
            currentData={formData}
          />
        </div>
      )}

      {/* 메인 컨텐츠 */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        {renderStep()}
      </div>
      
      {/* 디버깅 정보 (개발 모드에서만 표시) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg text-xs text-gray-600">
          <details>
            <summary className="cursor-pointer font-medium mb-2">디버깅 정보</summary>
            <div className="space-y-2">
              <div><strong>현재 단계:</strong> {currentStep}</div>
              <div><strong>검증 결과:</strong> {validationResults.length}개</div>
              <div><strong>진행 가능:</strong> {validationSummary.canProceed ? '예' : '아니오'}</div>
              <div><strong>예상 비용:</strong> {formData.estimate?.mid?.toLocaleString() || 0}원</div>
              <div><strong>예상 기간:</strong> {formData.timeline?.total || 0}일</div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
