
'use client';

import { useState, useEffect, useCallback } from 'react';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

interface TargetData {
  ageGroups: string[];
  gender: string[];
  regions: string[];
  occupations: string[];
  interests: string[];
  nationality: string[];
  customTarget?: string;
}

interface AIRecommendation {
  target: TargetData;
  reasoning: string;
  confidence: number;
  tips: string[];
}

export default function Step2Target({ data, onUpdate, onNext, onPrev }: Props) {
  const [targetData, setTargetData] = useState<TargetData>({
    ageGroups: data.targetData?.ageGroups || [],
    gender: data.targetData?.gender || [],
    regions: data.targetData?.regions || [],
    occupations: data.targetData?.occupations || [],
    interests: data.targetData?.interests || [],
    nationality: data.targetData?.nationality || [],
    customTarget: data.targetData?.customTarget || ''
  });

  const [additionalNotes, setAdditionalNotes] = useState(data.step2Notes || '');
  const [aiRecommendation, setAiRecommendation] = useState<AIRecommendation | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);

  // 🚀 NEW: AI 타겟 추천 생성 로직
  const generateAIRecommendation = useCallback(async () => {
    if (!data.purposes || data.purposes.length === 0) return;
    
    setIsGeneratingAI(true);
    
    try {
      // 시뮬레이션: 실제로는 AI API 호출
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const purposes = data.purposes || [];
      const details = data.details || [];
      
      let recommendedTarget: TargetData;
      let reasoning = '';
      let tips: string[] = [];
      let confidence = 85;

      // 목적별 타겟 추천 로직
      if (purposes.includes('마케팅·홍보')) {
        if (details.includes('제품·서비스 소개')) {
          recommendedTarget = {
            ageGroups: ['20대 후반 (25-29세)', '30대 초반 (30-34세)', '30대 후반 (35-39세)'],
            gender: ['성별 무관'],
            regions: ['전국'],
            occupations: ['직장인 (사무직)', '직장인 (기술직)', '자영업자'],
            interests: ['기술/IT', '비즈니스/경영'],
            nationality: ['내국인 (한국인)']
          };
          reasoning = '제품·서비스 소개 영상은 구매 결정권을 가진 25-39세 직장인층을 타겟팅하는 것이 효과적입니다. 이 연령대는 디지털 콘텐츠 소비가 활발하고 구매력이 높아 마케팅 효과가 극대화됩니다.';
          tips = [
            '이 타겟층은 실용적이고 구체적인 정보를 선호합니다',
            'B2B 제품이라면 직장인 비중을 더 높이세요',
            '전국 대상이므로 지역 특성보다는 범용적 메시지가 좋습니다'
          ];
        } else if (details.includes('브랜드 인지도 향상')) {
          recommendedTarget = {
            ageGroups: ['20대 초반 (20-24세)', '20대 후반 (25-29세)', '30대 초반 (30-34세)'],
            gender: ['성별 무관'],
            regions: ['서울', '경기/인천'],
            occupations: ['학생', '직장인 (사무직)', '프리랜서'],
            interests: ['패션/뷰티', '문화/예술', '여행/레저'],
            nationality: ['내국인 (한국인)']
          };
          reasoning = '브랜드 인지도 향상을 위해서는 트렌드에 민감하고 SNS 활동이 활발한 20-30대 초반을 타겟팅해야 합니다. 수도권 집중으로 파급효과를 극대화할 수 있습니다.';
          tips = [
            '이 타겟층은 시각적 임팩트와 스토리텔링을 중시합니다',
            'SNS 확산을 위해 공유하고 싶은 콘텐츠로 제작하세요',
            '인플루언서 마케팅과 연계하면 시너지 효과가 큽니다'
          ];
        }
      } else if (purposes.includes('교육·정보전달')) {
        if (details.includes('직원 교육·연수')) {
          recommendedTarget = {
            ageGroups: ['20대 후반 (25-29세)', '30대 (30-39세)', '40대 (40-49세)'],
            gender: ['성별 무관'],
            regions: ['전국'],
            occupations: ['직장인 (사무직)', '직장인 (기술직)', '경영진/임원'],
            interests: ['비즈니스/경영', '교육/학습'],
            nationality: ['내국인 (한국인)']
          };
          reasoning = '직원 교육용 영상은 실무진부터 관리자급까지 폭넓은 연령대를 포괄해야 하며, 학습 효과를 위해 집중도가 높은 직장인층을 타겟팅합니다.';
          tips = [
            '교육 효과를 위해 명확하고 체계적인 구성이 중요합니다',
            '연령대가 넓으므로 중간 톤의 전문적인 스타일을 권장합니다',
            '반복 학습을 고려한 챕터 구성을 추천합니다'
          ];
        } else if (details.includes('고객 사용법·가이드')) {
          recommendedTarget = {
            ageGroups: ['30대 (30-39세)', '40대 (40-49세)', '50대 (50-59세)'],
            gender: ['성별 무관'],
            regions: ['전국'],
            occupations: ['직장인 (사무직)', '주부', '자영업자'],
            interests: ['기술/IT', '교육/학습'],
            nationality: ['내국인 (한국인)']
          };
          reasoning = '사용법 가이드는 실제 사용자층인 30-50대를 중심으로 타겟팅하되, 디지털 리터러시를 고려한 설정이 필요합니다.';
          tips = [
            '단계별로 명확하고 천천히 설명하는 것이 중요합니다',
            '실제 사용 상황을 시뮬레이션한 내용이 효과적입니다',
            '자막과 음성을 모두 활용해 접근성을 높이세요'
          ];
        }
      } else if (purposes.includes('내부 소통·보고')) {
        recommendedTarget = {
          ageGroups: ['30대 (30-39세)', '40대 (40-49세)', '50대 (50-59세)'],
          gender: ['성별 무관'],
          regions: ['전국'],
          occupations: ['경영진/임원', '직장인 (사무직)', '전문직 (의사/변호사 등)'],
          interests: ['비즈니스/경영'],
          nationality: ['내국인 (한국인)']
        };
        reasoning = '내부 소통용 영상은 의사결정권자와 관리자급을 주 타겟으로 하여 비즈니스 맥락에 맞는 전문적인 톤앤매너가 필요합니다.';
        tips = [
          '간결하고 핵심적인 메시지 전달에 집중하세요',
          '데이터와 사실 중심의 객관적 내용이 효과적입니다',
          '시간 효율성을 고려한 구성을 권장합니다'
        ];
      }

      // 기본 추천 (목적을 정확히 매칭할 수 없는 경우)
      if (!recommendedTarget!) {
        recommendedTarget = {
          ageGroups: ['20대 후반 (25-29세)', '30대 (30-39세)'],
          gender: ['성별 무관'],
          regions: ['전국'],
          occupations: ['직장인 (사무직)', '직장인 (기술직)'],
          interests: ['기술/IT', '비즈니스/경영'],
          nationality: ['내국인 (한국인)']
        };
        reasoning = '선택하신 목적을 기반으로 가장 범용적이고 효과적인 타겟 조합을 추천드립니다. 25-39세 직장인층은 구매력과 영향력이 높아 대부분의 비즈니스 목적에 적합합니다.';
        tips = [
          '추가 목적이나 세부용도를 선택하시면 더 정확한 추천이 가능합니다',
          '특정 업종이나 니치 타겟이 있다면 직접 조정해주세요'
        ];
        confidence = 70;
      }

      setAiRecommendation({
        target: recommendedTarget!,
        reasoning,
        confidence,
        tips
      });
      
    } catch (error) {
      console.error('AI 추천 생성 오류:', error);
    } finally {
      setIsGeneratingAI(false);
    }
  }, [data.purposes, data.details]);

  // 🚀 NEW: AI 추천 적용하기
  const applyAIRecommendation = () => {
    if (!aiRecommendation) return;
    
    setTargetData(aiRecommendation.target);
    setShowAIPanel(false);
    
    // 즉시 업데이트
    onUpdate({ 
      targetData: aiRecommendation.target,
      step2Notes: additionalNotes,
      appliedAIRecommendation: true
    });
  };

  // 컴포넌트 마운트 시 AI 추천 자동 생성
  useEffect(() => {
    if (data.purposes && data.purposes.length > 0 && !aiRecommendation) {
      generateAIRecommendation();
      setShowAIPanel(true);
    }
  }, [data.purposes, generateAIRecommendation, aiRecommendation]);

  const ageOptions = [
    '10대 (13-19세)',
    '20대 초반 (20-24세)',
    '20대 후반 (25-29세)',
    '30대 초반 (30-34세)',
    '30대 후반 (35-39세)',
    '40대 (40-49세)',
    '50대 (50-59세)',
    '60대 이상 (60세+)'
  ];

  const genderOptions = [
    '남성',
    '여성',
    '성별 무관'
  ];

  const regionOptions = [
    '서울',
    '경기/인천',
    '부산/경남',
    '대구/경북',
    '광주/전라',
    '대전/충청',
    '강원',
    '제주',
    '전국',
    '해외'
  ];

  const occupationOptions = [
    '학생',
    '직장인 (사무직)',
    '직장인 (기술직)',
    '직장인 (서비스업)',
    '경영진/임원',
    '전문직 (의사/변호사 등)',
    '공무원/교육자',
    '자영업자',
    '프리랜서',
    '주부',
    '은퇴자',
    '기타'
  ];

  const interestOptions = [
    '기술/IT',
    '비즈니스/경영',
    '교육/학습',
    '건강/의료',
    '여행/레저',
    '음식/요리',
    '패션/뷰티',
    '스포츠/피트니스',
    '문화/예술',
    '금융/투자',
    '부동산',
    '육아/가족',
    '반려동물',
    '환경/지속가능성'
  ];

  const nationalityOptions = [
    '내국인 (한국인)',
    '중국계',
    '일본계',
    '동남아시아계',
    '미주/유럽계',
    '중동/아프리카계',
    '다문화 가정',
    '국적 무관'
  ];

  const handleLogicalConstraints = useCallback((category: keyof TargetData, value: string, currentSelection: string[]) => {
    let updatedSelection = [...currentSelection];

    if (category === 'nationality') {
      if (value === '국적 무관') {
        if (currentSelection.includes('국적 무관')) {
          updatedSelection = currentSelection.filter(item => item !== '국적 무관');
        } else {
          updatedSelection = ['국적 무관'];
        }
      } else {
        if (currentSelection.includes('국적 무관')) {
          updatedSelection = [value];
        } else {
          if (currentSelection.includes(value)) {
            updatedSelection = currentSelection.filter(item => item !== value);
          } else {
            updatedSelection = [...currentSelection, value];
          }
        }
      }
    }
    else if (category === 'regions') {
      if (value === '전국') {
        if (currentSelection.includes('전국')) {
          updatedSelection = currentSelection.filter(item => item !== '전국');
        } else {
          const overseas = currentSelection.includes('해외') ? ['해외'] : [];
          updatedSelection = ['전국', ...overseas];
        }
      } else if (value === '해외') {
        if (currentSelection.includes(value)) {
          updatedSelection = currentSelection.filter(item => item !== value);
        } else {
          updatedSelection = [...currentSelection, value];
        }
      } else {
        if (currentSelection.includes('전국')) {
          updatedSelection = currentSelection.filter(item => item !== '전국');
          if (!updatedSelection.includes(value)) {
            updatedSelection.push(value);
          }
        } else {
          if (currentSelection.includes(value)) {
            updatedSelection = currentSelection.filter(item => item !== value);
          } else {
            updatedSelection = [...currentSelection, value];
          }
        }
      }
    }
    else if (category === 'gender') {
      if (value === '성별 무관') {
        if (currentSelection.includes('성별 무관')) {
          updatedSelection = [];
        } else {
          updatedSelection = ['성별 무관'];
        }
      } else {
        if (currentSelection.includes('성별 무관')) {
          updatedSelection = [value];
        } else {
          updatedSelection = [value];
        }
      }
    }
    else {
      if (currentSelection.includes(value)) {
        updatedSelection = currentSelection.filter(item => item !== value);
      } else {
        updatedSelection = [...currentSelection, value];
      }
    }

    return updatedSelection;
  }, []);

  const handleMultiSelect = useCallback((category: keyof TargetData, value: string) => {
    if (category === 'gender' || category === 'customTarget') return;
    
    setTargetData(prev => {
      const currentArray = prev[category] as string[];
      const updated = handleLogicalConstraints(category, value, currentArray);
      
      return {
        ...prev,
        [category]: updated
      };
    });
  }, [handleLogicalConstraints]);

  const handleSingleSelect = useCallback((category: keyof TargetData, value: string) => {
    if (category !== 'gender') return;
    
    setTargetData(prev => {
      const currentArray = prev[category] as string[];
      const updated = handleLogicalConstraints(category, value, currentArray);
      
      return {
        ...prev,
        [category]: updated
      };
    });
  }, [handleLogicalConstraints]);

  const getSelectedCount = useCallback(() => {
    return targetData.ageGroups.length + 
           targetData.gender.length + 
           targetData.regions.length + 
           targetData.occupations.length + 
           targetData.interests.length +
           targetData.nationality.length;
  }, [targetData]);

  const getTargetSummary = useCallback(() => {
    const parts = [];
    
    if (targetData.gender.length > 0) {
      parts.push(`${targetData.gender.join(', ')}`);
    }
    
    if (targetData.ageGroups.length > 0) {
      const ageDisplay = targetData.ageGroups.length > 2 
        ? `${targetData.ageGroups.slice(0, 2).join(', ')} 외 ${targetData.ageGroups.length - 2}개` 
        : targetData.ageGroups.join(', ');
      parts.push(ageDisplay);
    }
    
    if (targetData.nationality.length > 0) {
      const nationalityDisplay = targetData.nationality.length > 2 
        ? `${targetData.nationality.slice(0, 2).join(', ')} 외 ${targetData.nationality.length - 2}개` 
        : targetData.nationality.join(', ');
      parts.push(nationalityDisplay);
    }
    
    if (targetData.regions.length > 0) {
      const regionDisplay = targetData.regions.length > 2 
        ? `${targetData.regions.slice(0, 2).join(', ')} 외 ${targetData.regions.length - 2}개 지역` 
        : `${targetData.regions.join(', ')} 지역`;
      parts.push(regionDisplay);
    }
    
    if (targetData.occupations.length > 0) {
      const occupationDisplay = targetData.occupations.length > 2 
        ? `${targetData.occupations.slice(0, 2).join(', ')} 외 ${targetData.occupations.length - 2}개 직업` 
        : targetData.occupations.join(', ');
      parts.push(occupationDisplay);
    }

    return parts.join(' • ');
  }, [targetData]);

  const handleNext = useCallback(() => {
    const hasBasicSelection = getSelectedCount() > 0;
    const hasAdditionalNotes = additionalNotes && additionalNotes.trim().length > 0;
    
    if (hasBasicSelection || hasAdditionalNotes) {
      onUpdate({ 
        targetData,
        step2Notes: additionalNotes 
      });
      onNext();
    }
  }, [getSelectedCount, additionalNotes, targetData, onUpdate, onNext]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onUpdate({ 
        targetData,
        step2Notes: additionalNotes 
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [targetData, additionalNotes, onUpdate]);

  const canProceed = getSelectedCount() > 0 || (additionalNotes && additionalNotes.trim().length > 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">타겟 대상을 선택해주세요</h2>
        <p className="text-gray-600 mb-6">
          영상이 전달될 주요 대상을 선택해주세요. 타겟에 맞는 톤앤매너와 콘텐츠 방향을 제안해드립니다.
        </p>
        
        {/* 선택된 서비스 표시 */}
        {data?.serviceType && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <i className="ri-user-line text-blue-600 mr-2 w-4 h-4 flex items-center justify-center"></i>
              <div>
                <span className="font-medium text-blue-800">선택된 서비스: </span>
                <span className="text-blue-700">
                  {data.serviceType === 'single' ? '영상 제작만 필요' : '영상 제작 + 추가 서비스 필요'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 이전 단계 선택사항 표시 */}
        {data?.purposes && data.purposes.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <i className="ri-target-line text-gray-600 mr-2 mt-1 w-4 h-4 flex items-center justify-center"></i>
              <div>
                <span className="font-medium text-gray-800">선택된 목적: </span>
                <span className="text-gray-700">{data.purposes.join(', ')}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 🚀 NEW: AI 타겟 추천 패널 */}
      {showAIPanel && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-purple-800 flex items-center">
              <i className="ri-ai-generate mr-2 w-5 h-5 flex items-center justify-center"></i>
              🎯 AI 맞춤 타겟 추천
            </h3>
            <button
              onClick={() => setShowAIPanel(false)}
              className="text-purple-600 hover:text-purple-800 transition-colors"
            >
              <i className="ri-close-line w-5 h-5 flex items-center justify-center"></i>
            </button>
          </div>

          {isGeneratingAI ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mb-4"></div>
              <p className="text-purple-700 font-medium">목적과 용도를 분석하여 최적 타겟을 추천하고 있습니다...</p>
              <p className="text-purple-600 text-sm mt-2">업계 데이터와 마케팅 트렌드를 반영중입니다</p>
            </div>
          ) : aiRecommendation ? (
            <div className="space-y-4">
              <div className="bg-white border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      AI
                    </div>
                    <div>
                      <div className="font-medium text-purple-800">추천 신뢰도</div>
                      <div className="text-sm text-purple-600">{aiRecommendation.confidence}% 매칭</div>
                    </div>
                  </div>
                  <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
                    <i className="ri-thumb-up-line text-green-600 mr-1 w-4 h-4 flex items-center justify-center"></i>
                    <span className="text-green-700 text-sm font-medium">최적 조합</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-purple-800 mb-2">📊 추천 근거</h4>
                  <p className="text-purple-700 text-sm leading-relaxed">{aiRecommendation.reasoning}</p>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-purple-800 mb-2">🎯 추천 타겟 조합</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    <div className="bg-purple-50 p-2 rounded">
                      <div className="font-medium text-purple-800">연령대</div>
                      <div className="text-purple-600">{aiRecommendation.target.ageGroups.join(', ')}</div>
                    </div>
                    <div className="bg-purple-50 p-2 rounded">
                      <div className="font-medium text-purple-800">성별</div>
                      <div className="text-purple-600">{aiRecommendation.target.gender.join(', ')}</div>
                    </div>
                    <div className="bg-purple-50 p-2 rounded">
                      <div className="font-medium text-purple-800">지역</div>
                      <div className="text-purple-600">{aiRecommendation.target.regions.join(', ')}</div>
                    </div>
                    <div className="bg-purple-50 p-2 rounded">
                      <div className="font-medium text-purple-800">직업</div>
                      <div className="text-purple-600">{aiRecommendation.target.occupations.join(', ')}</div>
                    </div>
                    <div className="bg-purple-50 p-2 rounded">
                      <div className="font-medium text-purple-800">관심사</div>
                      <div className="text-purple-600">{aiRecommendation.target.interests.join(', ')}</div>
                    </div>
                    <div className="bg-purple-50 p-2 rounded">
                      <div className="font-medium text-purple-800">국적</div>
                      <div className="text-purple-600">{aiRecommendation.target.nationality.join(', ')}</div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-purple-800 mb-2">💡 AI 추천 팁</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    {aiRecommendation.tips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-purple-500 mr-1">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={applyAIRecommendation}
                    className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    <i className="ri-magic-line mr-2"></i>
                    AI 추천대로 적용하기
                  </button>
                  <button
                    onClick={() => generateAIRecommendation()}
                    className="px-4 py-3 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors"
                  >
                    <i className="ri-refresh-line mr-2"></i>
                    다시 추천받기
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <button
                onClick={generateAIRecommendation}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                <i className="ri-ai-generate mr-2"></i>
                AI 타겟 추천받기
              </button>
            </div>
          )}
        </div>
      )}

      {/* 논리적 제약 안내 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-medium text-yellow-800 mb-2">
          <i className="ri-lightbulb-line mr-2 w-4 h-4 flex items-center justify-center"></i>
          스마트 선택 제약 안내
        </h3>
        <div className="text-sm text-yellow-700 space-y-1">
          <p>• <strong>"국적 무관"</strong> 선택 시 → 다른 모든 국적 옵션이 자동 해제됩니다 (해제도 자유롭게 가능)</p>
          <p>• <strong>"전국"</strong> 선택 시 → 다른 특정 지역들이 자동 해제됩니다 (해외 제외, 해제도 자유롭게 가능)</p>
          <p>• <strong>"성별 무관"</strong> 선택 시 → 남성/여성 옵션이 자동 해제됩니다 (해제도 자유롭게 가능)</p>
          <p>• 논리적으로 중복되는 선택을 방지하여 명확한 타겟팅을 도와드립니다</p>
        </div>
      </div>

      {/* 구체적 선택 옵션들 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 나이대 선택 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium mb-3 flex items-center">
            <i className="ri-calendar-line text-blue-600 mr-2 w-4 h-4 flex items-center justify-center"></i>
            나이대 (중복 선택 가능)
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {ageOptions.map((age) => {
              return (
                <div key={age} className="relative group">
                  <label
                    className={`flex items-center p-2 border rounded-lg transition-colors ${
                      targetData.ageGroups.includes(age)
                        ? 'border-blue-500 bg-blue-50 cursor-pointer hover:bg-blue-100'
                        : 'border-gray-200 bg-white cursor-pointer hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={targetData.ageGroups.includes(age)}
                      onChange={() => handleMultiSelect('ageGroups', age)}
                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className={`text-sm ${
                      targetData.ageGroups.includes(age)
                        ? 'text-blue-700 font-medium'
                        : 'text-gray-700'
                    }`}>
                      {age}
                    </span>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* 성별 선택 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium mb-3 flex items-center">
            <i className="ri-user-3-line text-blue-600 mr-2 w-4 h-4 flex items-center justify-center"></i>
            성별 (단일 선택)
            {targetData.gender.includes('성별 무관') && (
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full font-medium">
                무관 선택됨
              </span>
            )}
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {genderOptions.map((gender) => {
              return (
                <div key={gender} className="relative group">
                  <label
                    className={`flex items-center p-2 border rounded-lg transition-colors cursor-pointer ${
                      targetData.gender.includes(gender)
                        ? 'border-blue-500 bg-blue-50 hover:bg-blue-100'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="gender"
                      checked={targetData.gender.includes(gender)}
                      onChange={() => handleSingleSelect('gender', gender)}
                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className={`text-sm ${
                      targetData.gender.includes(gender)
                        ? 'text-blue-700 font-medium'
                        : 'text-gray-700'
                    }`}>
                      {gender}
                    </span>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* 국적/출신 선택 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium mb-3 flex items-center">
            <i className="ri-earth-line text-blue-600 mr-2 w-4 h-4 flex items-center justify-center"></i>
            국적/출신 (중복 선택 가능)
            {targetData.nationality.includes('국적 무관') && (
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full font-medium">
                무관 선택됨
              </span>
            )}
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {nationalityOptions.map((nationality) => {
              return (
                <div key={nationality} className="relative group">
                  <label
                    className={`flex items-center p-2 border rounded-lg transition-colors cursor-pointer ${
                      targetData.nationality.includes(nationality)
                        ? 'border-blue-500 bg-blue-50 hover:bg-blue-100'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={targetData.nationality.includes(nationality)}
                      onChange={() => handleMultiSelect('nationality', nationality)}
                      className="mr-3 h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className={`text-sm ${
                      targetData.nationality.includes(nationality)
                        ? 'text-blue-700 font-medium'
                        : 'text-gray-700'
                    }`}>
                      {nationality}
                    </span>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* 지역 선택 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium mb-3 flex items-center">
            <i className="ri-map-pin-line text-blue-600 mr-2 w-4 h-4 flex items-center justify-center"></i>
            지역 (중복 선택 가능)
            {targetData.regions.includes('전국') && (
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full font-medium">
                전국 선택됨
              </span>
            )}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {regionOptions.map((region) => {
              return (
                <div key={region} className="relative group">
                  <label
                    className={`flex items-center p-2 border rounded-lg transition-colors cursor-pointer ${
                      targetData.regions.includes(region)
                        ? 'border-blue-500 bg-blue-50 hover:bg-blue-100'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={targetData.regions.includes(region)}
                      onChange={() => handleMultiSelect('regions', region)}
                      className="mr-3 h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className={`text-sm ${
                      targetData.regions.includes(region)
                        ? 'text-blue-700 font-medium'
                        : 'text-gray-700'
                    }`}>
                      {region}
                    </span>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* 직업 선택 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium mb-3 flex items-center">
            <i className="ri-briefcase-line text-blue-600 mr-2 w-4 h-4 flex items-center justify-center"></i>
            직업/직군 (중복 선택 가능)
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {occupationOptions.map((occupation) => {
              return (
                <div key={occupation} className="relative group">
                  <label
                    className={`flex items-center p-2 border rounded-lg transition-colors cursor-pointer ${
                      targetData.occupations.includes(occupation)
                        ? 'border-blue-500 bg-blue-50 hover:bg-blue-100'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={targetData.occupations.includes(occupation)}
                      onChange={() => handleMultiSelect('occupations', occupation)}
                      className="mr-3 h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className={`text-sm ${
                      targetData.occupations.includes(occupation)
                        ? 'text-blue-700 font-medium'
                        : 'text-gray-700'
                    }`}>
                      {occupation}
                    </span>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* 관심사/취향 선택 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium mb-3 flex items-center">
            <i className="ri-heart-line text-blue-600 mr-2 w-4 h-4 flex items-center justify-center"></i>
            관심사/취향 (중복 선택 가능)
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {interestOptions.map((interest) => {
              return (
                <div key={interest} className="relative group">
                  <label
                    className={`flex items-center p-2 border rounded-lg transition-colors cursor-pointer ${
                      targetData.interests.includes(interest)
                        ? 'border-blue-500 bg-blue-50 hover:bg-blue-100'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={targetData.interests.includes(interest)}
                      onChange={() => handleMultiSelect('interests', interest)}
                      className="mr-3 h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className={`text-sm ${
                      targetData.interests.includes(interest)
                        ? 'text-blue-700 font-medium'
                        : 'text-gray-700'
                    }`}>
                      {interest}
                    </span>
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 선택 결과 미리보기 */}
      {(getSelectedCount() > 0 || additionalNotes) && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 border rounded-lg p-4">
          <h3 className="font-semibold mb-3 text-green-800">
            ✅ 타겟 대상 설정 완료
          </h3>
          
          {additionalNotes && (
            <div className="mb-3 p-3 bg-yellow-100 rounded-lg">
              <div className="text-sm font-medium text-yellow-800 mb-1">기타 추가 입력사항:</div>
              <div className="text-sm text-yellow-700">"{additionalNotes}"</div>
            </div>
          )}

          {getSelectedCount() > 0 && (
            <div>
              <div className="text-sm font-medium mb-2 text-green-700">
                선택된 세부 타겟 ({getSelectedCount()}개):
              </div>
              <div className="text-sm p-3 rounded border text-green-600 bg-white border-green-200">
                {getTargetSummary()}
              </div>
            </div>
          )}

          {(targetData.nationality.includes('국적 무관') || 
            targetData.regions.includes('전국') || 
            targetData.gender.includes('성별 무관')) && (
            <div className="mt-3 p-3 bg-blue-100 rounded-lg">
              <div className="text-xs text-blue-700">
                <p className="font-medium mb-1">🎯 스마트 제약 적용됨:</p>
                {targetData.nationality.includes('국적 무관') && (
                  <p>• 국적 무관으로 설정되어 모든 국적 대상으로 확장됩니다</p>
                )}
                {targetData.regions.includes('전국') && (
                  <p>• 전국으로 설정되어 지역 제한이 없습니다</p>
                )}
                {targetData.gender.includes('성별 무관') && (
                  <p>• 성별 무관으로 설정되어 모든 성별 대상으로 확장됩니다</p>
                )}
              </div>
            </div>
          )}

          <div className="mt-3 p-3 bg-blue-100 rounded-lg">
            <div className="text-xs text-blue-700">
              <p className="font-medium mb-1">💡 타겟 설정 효과</p>
              <p>• 선택하신 타겟에 맞는 톤앤매너 제안</p>
              <p>• 적합한 영상 스타일과 연출 방향 추천</p>
              <p>• 타겟별 효과적인 메시지 전달 방법 안내</p>
              <p>• 타겟-용도 매칭 검증으로 효과 극대화</p>
            </div>
          </div>
        </div>
      )}

      {/* 기타 추가 입력사항 - 하단으로 이동 */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="font-medium text-orange-800 mb-3">
          <i className="ri-edit-line mr-2 w-4 h-4 flex items-center justify-center"></i>
          기타 추가 입력사항
        </h3>
        <textarea
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
          placeholder="예: 입력한 내용과 다른 타겟을 선택한 이유 / 특별히 고려해야 할 타겟 특성 / 선택 옵션에 없는 특수한 타겟 그룹 / 복합적인 타겟 상황에 대한 설명 등"
          className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none bg-white"
          rows={4}
        />
        <p className="text-xs text-orange-700 mt-2">
          💡 1단계에서 입력하신 내용과 다른 선택을 하신 경우나 특별한 상황이 있으시면 자세히 설명해주세요!
        </p>
      </div>

      {/* 네비게이션 버튼 */}
      <div className="flex justify-between pt-6">
        <button
          onClick={onPrev}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium whitespace-nowrap cursor-pointer hover:bg-gray-200 transition-colors"
        >
          이전으로
        </button>
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
