
'use client';

import { useState, useEffect, useCallback } from 'react';
// 🚀 새로운 크로스 스텝 검증 시스템 import
import { 
  getSemanticConflicts, 
  getAIRecommendations,
  getFilteredPurposesByContext,
  parseUserInputComprehensive,
  purposeCategories
} from '../../lib/validationRules';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

export default function Step1Purpose({ data = {}, onUpdate, onNext }: Props) {
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>(data.purposes || []);
  const [userInput, setUserInput] = useState(data.userInput || '');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [specialNotes, setSpecialNotes] = useState(data.step1Notes || '');
  
  // 🚀 NEW: 완전 강력한 카테고리 잠금 시스템
  const [categoryLock, setCategoryLock] = useState<{
    isLocked: boolean;
    lockedCategory: string;
    allowedPurposes: string[];
    blockedCategories: string[];
    lockReason: string;
    canOverride: boolean;
  }>({
    isLocked: false,
    lockedCategory: '',
    allowedPurposes: [],
    blockedCategories: [],
    lockReason: '',
    canOverride: false
  });
  
  // 🚀 NEW: 카테고리 필터링 시스템 상태
  const [categoryFilter, setCategoryFilter] = useState<{
    isActive: boolean;
    availableCategories: string[];
    availablePurposes: string[];
    blockedCategories: string[];
    blockedPurposes: string[];
    filterReason: string;
    showAllCategories: boolean;
  }>({
    isActive: false,
    availableCategories: [],
    availablePurposes: [],
    blockedCategories: [],
    blockedPurposes: [],
    filterReason: '',
    showAllCategories: false
  });
  
  // 🚀 완전히 새로운 의미론적 검증 상태
  const [semanticValidation, setSemanticValidation] = useState<{
    hasConflicts: boolean;
    conflicts: Array<{
      purpose: string;
      reason: string;
      severity: 'high' | 'medium' | 'low';
      suggestion?: string;
    }>;
    blockedPurposes: string[];
    aiAnalyzed: boolean;
    isAiOnlyMode: boolean;
    analysisResult?: {
      detectedCategories: string[];
      primaryContext: string;
      suggestedApproach: string;
    };
  }>({ 
    hasConflicts: false, 
    conflicts: [],
    blockedPurposes: [],
    aiAnalyzed: false, 
    isAiOnlyMode: false
  });

  // 🚀 NEW: 완전 분리된 서비스 타입
  const [selectedServiceType, setSelectedServiceType] = useState<'video' | 'design' | 'marketing'>(data?.serviceType || 'video');

  // 🚀 NEW: 분리된 서비스 옵션들
  const serviceOptions = [
    {
      id: 'video',
      name: '영상 제작',
      category: '영상',
      description: '완전한 영상 제작 서비스',
      icon: 'ri-video-line',
      color: 'blue'
    },
    {
      id: 'design',
      name: '디자인 제작',
      category: '디자인',
      description: '그래픽 디자인 및 브랜딩',
      icon: 'ri-palette-line',
      color: 'green'
    },
    {
      id: 'marketing',
      name: '마케팅 서비스',
      category: '마케팅',
      description: 'SNS 마케팅 및 광고',
      icon: 'ri-advertisement-line',
      color: 'purple'
    }
  ];

  // 🚀 NEW: 완전히 새로운 AI 분석 기능 - 카테고리 필터링 + 의미론적 엔진 통합
  const analyzeUserInput = async (input: string) => {
    if (!input.trim()) {
      setAiSuggestions([]);
      setShowSuggestions(false);
      setCategoryFilter({
        isActive: false,
        availableCategories: [],
        availablePurposes: [],
        blockedCategories: [],
        blockedPurposes: [],
        filterReason: '',
        showAllCategories: false
      });
      setSemanticValidation({
        hasConflicts: false,
        conflicts: [],
        blockedPurposes: [],
        aiAnalyzed: false,
        isAiOnlyMode: false
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('🚀 통합 AI 분석 시작:', input);

      // 🎯 1단계: 카테고리 필터링 분석
      const filterResult = getFilteredPurposesByContext(input, false);
      
      // 🎯 2단계: AI 추천 엔진 실행
      const aiResult = getAIRecommendations(input);
      const recommendations = aiResult.recommendations.map(rec => rec.purpose);
      
      // 🎯 3단계: 종합 입력 파싱
      const parsedInput = parseUserInputComprehensive(input);
      
      console.log('🎯 카테고리 필터링 결과:', filterResult);
      console.log('🎯 AI 추천 결과:', recommendations);
      console.log('📊 입력 파싱 결과:', parsedInput);
      
      // 카테고리 필터 상태 업데이트
      setCategoryFilter({
        isActive: filterResult.availableCategories.length < purposeCategories.length,
        availableCategories: filterResult.availableCategories,
        availablePurposes: filterResult.availablePurposes,
        blockedCategories: filterResult.blockedCategories,
        blockedPurposes: filterResult.blockedPurposes,
        filterReason: filterResult.filterReason,
        showAllCategories: false
      });
      
      setAiSuggestions(recommendations);
      setShowSuggestions(recommendations.length > 0);
      setSemanticValidation(prev => ({ 
        ...prev, 
        aiAnalyzed: true, 
        isAiOnlyMode: false,
        analysisResult: aiResult.analysisResult
      }));
      
    } catch (error) {
      console.error('❌ AI 분석 중 오류 발생:', error);
      setAiSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 🚀 완전히 새로운 실시간 의미론적 검증 - useCallback으로 메모이제이션
  const validateSemantics = useCallback(() => {
    if (semanticValidation.aiAnalyzed && userInput.trim() && selectedPurposes.length > 0) {
      const semanticResult = getSemanticConflicts(userInput, selectedPurposes);
      
      setSemanticValidation(prev => ({
        ...prev,
        hasConflicts: semanticResult.conflicts.length > 0,
        conflicts: semanticResult.conflicts,
        blockedPurposes: semanticResult.blockedPurposes
      }));
    }
  }, [semanticValidation.aiAnalyzed, userInput, selectedPurposes]);

  // 🚀 FIX: useEffect 의존성 문제 해결
  useEffect(() => {
    validateSemantics();
  }, [validateSemantics]);

  // 🚀 NEW: 완전한 카테고리 잠금 시스템 - 한 카테고리 선택하면 다른 모든 카테고리 완전 차단
  const updateCategoryLock = useCallback(() => {
    if (selectedPurposes.length === 0) {
      // 선택 해제 시 잠금 해제
      setCategoryLock({
        isLocked: false,
        lockedCategory: '',
        allowedPurposes: [],
        blockedCategories: [],
        lockReason: '',
        canOverride: false
      });
      return;
    }

    // 선택된 목적들이 속한 카테고리 찾기
    const selectedCategoryIds = new Set<string>();
    selectedPurposes.forEach(purpose => {
      purposeCategories.forEach(category => {
        if (category.purposes.includes(purpose)) {
          selectedCategoryIds.add(category.id);
        }
      });
    });

    if (selectedCategoryIds.size === 1) {
      // 하나의 카테고리만 선택된 경우 - 완전 잠금
      const lockedCategoryId = Array.from(selectedCategoryIds)[0];
      const lockedCategory = purposeCategories.find(cat => cat.id === lockedCategoryId);
      
      if (lockedCategory) {
        const blockedCategories = purposeCategories
          .filter(cat => cat.id !== lockedCategoryId)
          .map(cat => cat.id);

        setCategoryLock({
          isLocked: true,
          lockedCategory: lockedCategory.title,
          allowedPurposes: lockedCategory.purposes,
          blockedCategories,
          lockReason: `"${lockedCategory.title}" 카테고리를 선택하셨습니다. 다른 카테고리의 목적들은 선택할 수 없습니다.`,
          canOverride: false
        });

        console.log(`🔒 카테고리 잠금 활성화: ${lockedCategory.title}`, {
          allowedPurposes: lockedCategory.purposes,
          blockedCategories
        });
      }
    } else if (selectedCategoryIds.size > 1) {
      // 여러 카테고리 선택된 경우 - 경고 표시하고 마지막 선택만 유지하는 것을 제안
      setCategoryLock({
        isLocked: false,
        lockedCategory: '',
        allowedPurposes: [],
        blockedCategories: [],
        lockReason: '여러 카테고리의 목적을 동시에 선택할 수 없습니다.',
        canOverride: true
      });
    }
  }, [selectedPurposes]);

  useEffect(() => {
    updateCategoryLock();
  }, [updateCategoryLock]);

  const handleAnalyzeClick = () => {
    console.log('🚀 통합 AI 분석 버튼 클릭, 입력값:', userInput);
    analyzeUserInput(userInput);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setUserInput(value);
    
    if (!value.trim()) {
      setShowSuggestions(false);
      setAiSuggestions([]);
      setCategoryFilter({
        isActive: false,
        availableCategories: [],
        availablePurposes: [],
        blockedCategories: [],
        blockedPurposes: [],
        filterReason: '',
        showAllCategories: false
      });
      setSemanticValidation({
        hasConflicts: false,
        conflicts: [],
        blockedPurposes: [],
        aiAnalyzed: false,
        isAiOnlyMode: false
      });
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!selectedPurposes.includes(suggestion)) {
      setSelectedPurposes(prev => [...prev, suggestion]);
    }
  };

  const handleSuggestionRemove = (suggestion: string) => {
    setAiSuggestions(prev => prev.filter(s => s !== suggestion));
    setSelectedPurposes(prev => prev.filter(p => p !== suggestion));
    
    if (aiSuggestions.length === 1 && aiSuggestions[0] === suggestion) {
      setShowSuggestions(false);
    }
  };

  // 🚀 NEW: 완전 강력한 카테고리 기반 목적 선택 시스템
  const handlePurposeToggle = (purpose: string) => {
    const isCurrentlySelected = selectedPurposes.includes(purpose);
    
    if (isCurrentlySelected) {
      // 선택 해제는 항상 허용
      const updated = selectedPurposes.filter(p => p !== purpose);
      setSelectedPurposes(updated);
      
      // AI 추천에서도 제거
      if (aiSuggestions.includes(purpose)) {
        setAiSuggestions(prev => prev.filter(s => s !== purpose));
        if (aiSuggestions.length === 1 && aiSuggestions[0] === purpose) {
          setShowSuggestions(false);
        }
      }
    } else {
      // 🚀 1차: 카테고리 잠금 검사 - 최우선
      if (categoryLock.isLocked && !categoryLock.allowedPurposes.includes(purpose)) {
        console.warn(`🔒 "${purpose}" 선택이 카테고리 잠금으로 완전 차단됨`);
        return; // 선택을 막음
      }

      // 🚀 2차: 카테고리 필터링 검사
      if (categoryFilter.isActive && !categoryFilter.showAllCategories) {
        const isBlocked = categoryFilter.blockedPurposes.includes(purpose);
        if (isBlocked) {
          console.warn(`❌ "${purpose}" 선택이 카테고리 필터링으로 차단됨`);
          return; // 선택을 막음
        }
      }
      
      // 🚀 3차: 의미론적 검사
      if (semanticValidation.aiAnalyzed && !semanticValidation.isAiOnlyMode) {
        const testResult = getSemanticConflicts(userInput, [...selectedPurposes, purpose]);
        const isBlocked = testResult.blockedPurposes.includes(purpose);
        
        if (isBlocked) {
          const conflict = testResult.conflicts.find(c => c.purpose === purpose);
          console.warn(`❌ "${purpose}" 선택이 의미론적으로 차단됨:`, conflict?.reason);
          return; // 선택을 막음
        }
      }
      
      const updated = [...selectedPurposes, purpose];
      setSelectedPurposes(updated);
      
      // AI Only 모드 해제
      setSemanticValidation(prev => ({ ...prev, isAiOnlyMode: false }));
    }
  };

  // 🚀 NEW: 완전 통합 목적 차단 여부 확인 - 카테고리 잠금 최우선
  const isPurposeBlocked = (purpose: string): boolean => {
    // 1차: 카테고리 잠금 검사 - 최우선
    if (categoryLock.isLocked && !categoryLock.allowedPurposes.includes(purpose)) {
      return true;
    }

    // 2차: 카테고리 필터링 검사
    if (categoryFilter.isActive && !categoryFilter.showAllCategories) {
      if (categoryFilter.blockedPurposes.includes(purpose)) {
        return true;
      }
    }
    
    // 3차: 의미론적 검사
    if (!semanticValidation.aiAnalyzed || semanticValidation.isAiOnlyMode || !userInput.trim()) {
      return false;
    }
    
    const testResult = getSemanticConflicts(userInput, [purpose]);
    return testResult.blockedPurposes.includes(purpose);
  };

  // 🚀 NEW: 완전 통합 차단 사유 반환 - 카테고리 잠금 최우선
  const getBlockedReason = (purpose: string): string => {
    // 1차: 카테고리 잠금 사유 - 최우선
    if (categoryLock.isLocked && !categoryLock.allowedPurposes.includes(purpose)) {
      return categoryLock.lockReason;
    }

    if (!userInput.trim()) return '';
    
    // 2차: 카테고리 필터링 사유
    if (categoryFilter.isActive && categoryFilter.blockedPurposes.includes(purpose)) {
      return `현재 입력 맥락(${categoryFilter.filterReason})에 해당하지 않습니다`;
    }
    
    // 3차: 의미론적 사유
    const testResult = getSemanticConflicts(userInput, [purpose]);
    const conflict = testResult.conflicts.find(c => c.purpose === purpose);
    return conflict?.reason || '현재 입력 내용과 의미적으로 맞지 않습니다';
  };

  const handleApplyAllSuggestions = () => {
    const newPurposes = [...selectedPurposes];
    aiSuggestions.forEach(suggestion => {
      if (!newPurposes.includes(suggestion)) {
        newPurposes.push(suggestion);
      }
    });
    setSelectedPurposes(newPurposes);
  };

  // 🚀 AI 추천만 적용하기 - 완벽한 의미론적 일관성 보장
  const handleApplyAiRecommendationsOnly = () => {
    setSelectedPurposes([...aiSuggestions]);
    setSemanticValidation(prev => ({ 
      ...prev, 
      hasConflicts: false, 
      conflicts: [],
      isAiOnlyMode: true
    }));
  };

  // 🚀 NEW: 카테고리 필터 토글
  const handleToggleShowAllCategories = () => {
    setCategoryFilter(prev => ({
      ...prev,
      showAllCategories: !prev.showAllCategories
    }));
  };

  // 🚀 NEW: 카테고리 잠금 해제 - 모든 선택 초기화
  const handleUnlockCategories = () => {
    setSelectedPurposes([]);
    setCategoryLock({
      isLocked: false,
      lockedCategory: '',
      allowedPurposes: [],
      blockedCategories: [],
      lockReason: '',
      canOverride: false
    });
  };

  // 🚀 NEW: 서비스 타입 변경 핸들러
  const handleServiceTypeChange = (serviceId: 'video' | 'design' | 'marketing') => {
    setSelectedServiceType(serviceId);
  };

  // 🚀 FIX: 무한 루프 방지를 위한 useCallback과 의존성 최적화
  const updateFormDataCallback = useCallback(() => {
    if (typeof onUpdate === 'function') {
      const selectedService = serviceOptions.find(s => s.id === selectedServiceType);
      const updateData = {
        purposes: selectedPurposes,
        userInput: userInput,
        serviceType: selectedServiceType,
        category: selectedService?.category || '영상',
        step1Notes: specialNotes,
        // 🚀 새로운 데이터 전달
        categoryFilter: categoryFilter,
        categoryLock: categoryLock,
        semanticValidation: semanticValidation
      };
      onUpdate(updateData);
    }
  }, [selectedPurposes, userInput, selectedServiceType, specialNotes, categoryFilter, categoryLock, semanticValidation, onUpdate]);

  // 🚀 FIX: 데이터 업데이트를 debounce로 최적화
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateFormDataCallback();
    }, 100); // 100ms 디바운스

    return () => clearTimeout(timeoutId);
  }, [updateFormDataCallback]);

  const handleNext = () => {
    try {
      if (typeof onNext === 'function') {
        onNext();
      }
    } catch (err) {
      console.error('Error while proceeding to the next step:', err);
    }
  };

  // 🚀 진행 조건 완화 - 기본 필수 조건만 체크
  const canProceed = selectedPurposes.length > 0 && selectedServiceType;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">필요한 서비스를 선택해주세요</h2>
        <p className="text-gray-600 mb-6">
          제작하려는 서비스 분야를 선택하고 구체적인 목적을 알려주세요. AI가 분석하여 적합한 목적을 추천해드립니다.
        </p>
      </div>

      {/* 🚀 NEW: 완전 분리된 서비스 선택 */}
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-4">서비스 분야 선택 <span className="text-red-500">*</span></h3>
          <p className="text-gray-600 text-sm mb-4">
            각 분야별로 전문적인 견적과 옵션을 제공합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {serviceOptions.map((option) => {
            const isSelected = selectedServiceType === option.id;
            
            return (
              <label
                key={option.id}
                className={`p-6 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                  isSelected
                    ? `border-${option.color}-600 bg-${option.color}-50`
                    : 'border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="serviceType"
                  checked={isSelected}
                  onChange={() => handleServiceTypeChange(option.id)}
                  className="sr-only"
                />
                <div className={`${
                  isSelected
                    ? `text-${option.color}-600` : 'text-gray-700'
                }`}>
                  <div className="flex items-center justify-center mb-4">
                    <i className={`${option.icon} text-4xl w-12 h-12 flex items-center justify-center`}></i>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-lg mb-2">{option.name}</div>
                    <div className="text-sm">{option.description}</div>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* 사용자 입력창 */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            목적 설명 <span className="text-sm text-gray-500">(선택사항)</span>
          </label>
          <textarea
            value={userInput}
            onChange={handleInputChange}
            placeholder={`예: ${selectedServiceType === 'video' ? '20대 직장인 대상 5분 정도의 산업현장 안전교육을 재미있게 하기 위한 영상 제작을 원합니다' : selectedServiceType === 'design' ? '스타트업 브랜드 아이덴티티와 로고 디자인이 필요해서 문의드립니다' : 'Instagram과 Facebook을 통한 20-30대 타겟 마케팅 캠페인을 기획하고 있습니다'}`}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={4}
          />
          
          {userInput.trim() && !showSuggestions && !isAnalyzing && (
            <div className="mt-3">
              <button
                onClick={handleAnalyzeClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium whitespace-nowrap cursor-pointer hover:bg-blue-700 transition-colors"
              >
                <i className="ri-magic-line mr-2 w-4 h-4 flex items-center justify-center"></i>
                AI 분석으로 맞춤 목적 추천
              </button>
            </div>
          )}
          
          {isAnalyzing && (
            <div className="mt-3">
              <div className="flex items-center justify-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full mr-3"></div>
                <span className="text-blue-700 font-medium">AI가 분석하고 있습니다...</span>
              </div>
            </div>
          )}
        </div>

        {/* 🚀 NEW: 완전 강력한 카테고리 잠금 상태 표시 */}
        {categoryLock.isLocked && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-red-800 flex items-center">
                <i className="ri-lock-line mr-2 w-5 h-5 flex items-center justify-center"></i>
                🔒 카테고리 완전 잠금 활성화
              </h3>
              <button
                onClick={handleUnlockCategories}
                className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors cursor-pointer whitespace-nowrap font-medium"
              >
                <i className="ri-unlock-line mr-1 w-4 h-4 flex items-center justify-center"></i>
                모든 선택 초기화
              </button>
            </div>
            
            <div className="bg-white/80 rounded-lg p-4 mb-3 border border-red-200">
              <div className="flex items-center mb-2">
                <i className="ri-shield-check-line text-red-600 mr-2 w-5 h-5 flex items-center justify-center"></i>
                <span className="font-bold text-red-800">선택된 카테고리: {categoryLock.lockedCategory}</span>
              </div>
              <p className="text-sm text-red-700 mb-3">{categoryLock.lockReason}</p>
              
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div>
                  <span className="font-bold text-green-800">✅ 선택 가능한 목적:</span>
                  <div className="text-green-700 ml-4">
                    {categoryLock.allowedPurposes.join(', ')}
                  </div>
                </div>
                <div>
                  <span className="font-bold text-red-800">🚫 완전 차단된 카테고리:</span>
                  <div className="text-red-700 ml-4">
                    {purposeCategories
                      .filter(cat => categoryLock.blockedCategories.includes(cat.id))
                      .map(cat => cat.title)
                      .join(', ')}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-red-800 bg-red-100 p-3 rounded-lg">
              <p className="font-bold mb-1">🔒 완전 강력한 카테고리 분리 효과:</p>
              <p>• 한 카테고리를 선택하면 다른 모든 카테고리가 완전히 차단됩니다</p>
              <p>• 논리적으로 맞지 않는 조합이 원천적으로 불가능합니다</p>
              <p>• 모든 단계에서 완벽한 일관성이 강제로 보장됩니다</p>
            </div>
          </div>
        )}

        {/* 🚀 NEW: AI 추천 UI */}
        {showSuggestions && aiSuggestions.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-blue-800">🧠 AI 분석 완료</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleApplyAllSuggestions}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  추가 선택
                </button>
                <button
                  onClick={handleApplyAiRecommendationsOnly}
                  className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap"
                >
                  🎯 최적화 적용
                </button>
              </div>
            </div>
            
            <p className="text-sm text-blue-600 mb-3">
              분석 결과, 다음 목적들이 입력 내용과 완벽히 일치합니다:
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {aiSuggestions.map((suggestion, index) => (
                <div
                  key={suggestion}
                  className="flex items-center bg-white/80 border border-blue-200 rounded-lg shadow-sm"
                >
                  <button
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`px-3 py-2 rounded-l-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      selectedPurposes.includes(suggestion)
                        ? 'bg-green-100 text-green-700'
                        : 'bg-white text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    <span className="mr-2 px-1.5 py-0.5 bg-purple-100 text-purple-600 text-xs rounded-full font-bold">
                      #{index + 1}
                    </span>
                    {selectedPurposes.includes(suggestion) ? (
                      <i className="ri-check-line mr-1 w-4 h-4 flex items-center justify-center"></i>
                    ) : (
                      <i className="ri-add-line mr-1 w-4 h-4 flex items-center justify-center"></i>
                    )}
                    {suggestion}
                  </button>
                  <button
                    onClick={() => handleSuggestionRemove(suggestion)}
                    className="px-2 py-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-r-lg border-l border-blue-200 transition-colors cursor-pointer"
                    title="AI 추천에서 제거"
                  >
                    <i className="ri-close-line text-sm w-3 h-3 flex items-center justify-center"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 목적 선택 - 카테고리별로 구성 */}
      <div>
        <h3 className="font-medium mb-4">목적 선택 <span className="text-red-500">*</span></h3>
        
        <div className="space-y-6">
          {purposeCategories.map((category) => {
            // 🚀 NEW: 완전 강력한 카테고리 필터링 적용
            const isCategoryBlocked = (categoryFilter.isActive && 
                                      !categoryFilter.showAllCategories && 
                                      categoryFilter.blockedCategories.includes(category.id)) ||
                                     (categoryLock.isLocked && 
                                      categoryLock.blockedCategories.includes(category.id));
            
            if (isCategoryBlocked) {
              return null; // 차단된 카테고리는 아예 표시하지 않음
            }
            
            return (
              <div key={category.title} className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  {category.title}
                  {/* 🚀 NEW: 카테고리 상태 표시 */}
                  {categoryLock.isLocked && categoryLock.lockedCategory === category.title && (
                    <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full font-bold">
                      🔒 잠금됨
                    </span>
                  )}
                  {categoryFilter.isActive && categoryFilter.availableCategories.includes(category.id) && (
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full font-medium">
                      ✅ 맥락 일치
                    </span>
                  )}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {category.purposes.map((purpose) => {
                    // 🚀 새로운 완전 통합 차단 시스템
                    const isBlocked = isPurposeBlocked(purpose);
                    const blockedReason = isBlocked ? getBlockedReason(purpose) : '';
                    const isAiRecommended = aiSuggestions.includes(purpose);
                    const isSelected = selectedPurposes.includes(purpose);
                    
                    return (
                      <div key={purpose} className="relative group">
                        <label
                          className={`flex items-center p-3 border rounded-lg transition-colors ${
                            isBlocked
                              ? 'border-red-300 bg-red-50 cursor-not-allowed opacity-70'
                              : isSelected
                              ? 'border-blue-500 bg-blue-50 cursor-pointer hover:bg-blue-100'
                              : 'border-gray-200 hover:bg-white bg-white cursor-pointer'
                          }`}
                          title={isBlocked ? `차단됨: ${blockedReason}` : ''}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handlePurposeToggle(purpose)}
                            disabled={isBlocked}
                            className={`mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
                              isBlocked ? 'cursor-not-allowed' : ''
                            }`}
                          />
                          <span className={`flex-1 text-sm ${
                            isBlocked
                              ? 'text-red-600'
                              : isSelected 
                              ? 'text-blue-700 font-medium' 
                              : 'text-gray-700'
                          }`}>
                            {purpose}
                          </span>
                          
                          {/* 🚀 새로운 상태 아이콘들 */}
                          <div className="flex items-center gap-1 ml-2">
                            {isBlocked && (
                              <i className="ri-forbid-line text-red-500 w-4 h-4 flex items-center justify-center" title="완전 차단됨"></i>
                            )}
                            {isAiRecommended && (
                              <span className="px-2 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-600 text-xs rounded-full font-medium">
                                🧠 AI
                              </span>
                            )}
                          </div>
                        </label>
                        
                        {/* 🚀 통합 차단 사유 툴팁 */}
                        {isBlocked && blockedReason && (
                          <div className="absolute left-0 top-full mt-1 z-10 hidden group-hover:block">
                            <div className="bg-red-100 border border-red-200 rounded-lg p-3 text-xs text-red-700 whitespace-nowrap shadow-lg max-w-xs">
                              <div className="flex items-center mb-1">
                                <i className="ri-lock-line mr-1 w-3 h-3 flex items-center justify-center"></i>
                                <span className="font-bold">완전 차단 사유</span>
                              </div>
                              <p>{blockedReason}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🚀 NEW: 선택 결과 미리보기 */}
      {selectedPurposes.length > 0 && (
        <div className={`border rounded-lg p-4 ${
          categoryLock.isLocked
            ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-300'
            : semanticValidation.hasConflicts 
            ? 'bg-gradient-to-r from-yellow-50 to-red-50 border-yellow-200' 
            : semanticValidation.isAiOnlyMode
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
            : categoryFilter.isActive
            ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200'
            : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
        }`}>
          <h3 className={`font-semibold mb-3 ${
            categoryLock.isLocked
              ? 'text-red-800'
              : semanticValidation.hasConflicts 
              ? 'text-yellow-800' 
              : semanticValidation.isAiOnlyMode
              ? 'text-green-800'
              : categoryFilter.isActive
              ? 'text-purple-800'
              : 'text-blue-800'
          }`}>
            ✅ 선택 결과
          </h3>
          
          <div className="mb-3">
            <div className={`text-sm font-medium mb-1 ${
              categoryLock.isLocked ? 'text-red-700' : semanticValidation.hasConflicts ? 'text-yellow-700' : 'text-green-700'
            }`}>
              선택된 서비스:
            </div>
            <div className={`text-sm ${
              categoryLock.isLocked ? 'text-red-600' : semanticValidation.hasConflicts ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {serviceOptions.find(s => s.id === selectedServiceType)?.name}
            </div>
          </div>

          <div>
            <div className={`text-sm font-medium mb-2 ${
              categoryLock.isLocked ? 'text-red-700' : semanticValidation.hasConflicts ? 'text-yellow-700' : 'text-green-700'
            }`}>
              목적 ({selectedPurposes.length}개):
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedPurposes.map((purpose) => (
                <div key={purpose} className={`flex items-center rounded-full ${
                  categoryLock.isLocked
                    ? 'bg-red-100 text-red-700'
                    : semanticValidation.hasConflicts 
                    ? 'bg-yellow-100 text-yellow-700' 
                    : semanticValidation.isAiOnlyMode
                    ? 'bg-green-100 text-green-700'
                    : categoryFilter.isActive
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  <span className="px-3 py-1 text-sm font-medium">
                    {purpose}
                    {categoryLock.isLocked && ' 🔒'}
                    {aiSuggestions.includes(purpose) && ' 🧠'}
                  </span>
                  <button
                    onClick={() => handlePurposeToggle(purpose)}
                    className={`ml-1 mr-2 transition-colors ${
                      categoryLock.isLocked 
                        ? 'text-red-600 hover:text-red-800'
                        : semanticValidation.hasConflicts 
                        ? 'text-yellow-600 hover:text-yellow-800' 
                        : 'text-green-600 hover:text-green-800'
                    }`}
                    title="선택 해제"
                  >
                    <i className="ri-close-line text-sm"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 특이사항 입력란 */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="font-medium text-orange-800 mb-3">
          <i className="ri-sticky-note-line mr-2"></i>
          특이사항 및 추가 요청사항
        </h3>
        <textarea
          value={specialNotes}
          onChange={(e) => setSpecialNotes(e.target.value)}
          placeholder="예: 복합적인 서비스가 필요한 상황 / 특정 스타일이나 톤 요청 / 특별한 상황 설명 등"
          className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none bg-white"
          rows={4}
        />
        <p className="text-xs text-orange-700 mt-2">
          💡 추가적인 요구사항이나 특별한 상황이 있으시면 자세히 설명해주세요!
        </p>
      </div>

      <div className="flex justify-end pt-6">
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`px-6 py-2 rounded-lg font-medium whitespace-nowrap cursor-pointer transition-colors ${
            canProceed
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
        >
          다음으로
        </button>
      </div>
    </div>
  );
}