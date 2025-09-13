
'use client';

import { useState, useEffect } from 'react';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

interface ScaleData {
  timeScale?: {
    type: string;
    value: string;
  };
  contentScale?: {
    type: string;
    value: string;
  };
  custom?: string;
}

interface AIGuide {
  status: 'good' | 'warning' | 'error';
  message: string;
  suggestions: string[];
  platformTips: string[];
}

export default function Step4Scale({ data, onUpdate, onNext, onPrev }: Props) {
  const [scale, setScale] = useState<ScaleData>(data.scale || {});
  const [specialNotes, setSpecialNotes] = useState(data.step4Notes || '');
  const [aiGuide, setAiGuide] = useState<AIGuide | null>(null);

  // 🚀 NEW: 시간 기준 옵션들
  const timeOptions = [
    { value: '15초', description: 'SNS 숏폼, 광고', icon: 'ri-timer-line', platforms: ['TikTok', 'Instagram Reels', 'YouTube Shorts'], cost: 'low' },
    { value: '30초', description: '광고, 티저', icon: 'ri-timer-line', platforms: ['TV광고', 'YouTube 광고', 'Facebook'], cost: 'low' },
    { value: '1분', description: '홍보, 소개', icon: 'ri-time-line', platforms: ['Instagram', 'LinkedIn', 'Twitter'], cost: 'medium' },
    { value: '3분', description: '설명, 교육', icon: 'ri-time-line', platforms: ['YouTube', '회사 홈페이지', '교육 플랫폼'], cost: 'medium' },
    { value: '5분', description: '상세 교육', icon: 'ri-hourglass-line', platforms: ['YouTube', 'Vimeo', '내부 교육'], cost: 'high' },
    { value: '10분', description: '강의, 웨비나', icon: 'ri-hourglass-line', platforms: ['YouTube', '교육 플랫폼', '웨비나'], cost: 'high' },
    { value: '10분+', description: '다큐, 장편', icon: 'ri-hourglass-fill', platforms: ['YouTube', 'TV', '스트리밍'], cost: 'very-high' }
  ];

  // 🚀 NEW: 분량 기준 옵션들
  const contentOptions = [
    { value: '초간단', description: '핵심 메시지만', icon: 'ri-flashlight-line', density: 'very-low', cost: 'low' },
    { value: '간단', description: '요점 위주', icon: 'ri-focus-3-line', density: 'low', cost: 'low' },
    { value: '보통', description: '적당한 정보량', icon: 'ri-scales-line', density: 'medium', cost: 'medium' },
    { value: '상세', description: '풍부한 내용', icon: 'ri-book-open-line', density: 'high', cost: 'high' },
    { value: '매우상세', description: '모든 정보 포함', icon: 'ri-book-2-line', density: 'very-high', cost: 'very-high' },
    { value: '꽉찬', description: '압축적 고밀도', icon: 'ri-stack-line', density: 'ultra-high', cost: 'very-high' }
  ];

  // 🚀 NEW: AI 가이드 생성 로직
  const generateAIGuide = () => {
    const timeScale = scale.timeScale;
    const contentScale = scale.contentScale;
    
    if (!timeScale || !contentScale) {
      setAiGuide(null);
      return;
    }

    const timeValue = timeScale.value;
    const contentValue = contentScale.value;
    const purposes = data.purposes || [];
    const details = data.details || [];

    let guide: AIGuide = {
      status: 'good',
      message: '',
      suggestions: [],
      platformTips: []
    };

    // 🚨 문제 조합 검사
    if ((timeValue === '15초' || timeValue === '30초') && (contentValue === '상세' || contentValue === '매우상세' || contentValue === '꽉찬')) {
      guide.status = 'error';
      guide.message = '⚠️ 짧은 시간에 너무 많은 내용을 담으려고 합니다. 시청자가 정보를 제대로 소화하기 어려울 수 있습니다.';
      guide.suggestions = [
        '15-30초 영상은 "초간단" 또는 "간단" 분량을 권장합니다',
        '핵심 메시지 1-2개만 선택하여 임팩트 있게 전달하세요',
        '상세한 내용은 별도 영상으로 제작하거나 시간을 늘리세요'
      ];
      guide.platformTips = [
        'TikTok/Instagram: 첫 3초가 중요, 즉시 핵심 노출',
        'YouTube Shorts: 자막 활용으로 정보 밀도 높이기'
      ];
    }
    else if ((timeValue === '10분' || timeValue === '10분+') && (contentValue === '초간단' || contentValue === '간단')) {
      guide.status = 'warning';
      guide.message = '🤔 긴 시간에 비해 내용이 부족할 수 있습니다. 시청자가 지루해할 가능성이 있습니다.';
      guide.suggestions = [
        '10분 이상 영상은 "보통" 이상의 분량을 권장합니다',
        '챕터를 나누어 구성하거나 여러 주제를 다뤄보세요',
        '인터뷰, 사례 연구 등으로 내용을 풍성하게 만드세요'
      ];
      guide.platformTips = [
        'YouTube: 챕터 기능 활용으로 구간별 접근성 향상',
        '교육 플랫폼: 퀴즈나 실습 구간 삽입 권장'
      ];
    }
    else if (timeValue === '5분' && contentValue === '꽉찬') {
      guide.status = 'warning';
      guide.message = '⚡ 5분에 고밀도 내용을 담으면 매우 빠른 전개가 필요합니다. 타겟 시청자의 집중력을 고려하세요.';
      guide.suggestions = [
        '빠른 컷 편집과 강력한 자막이 필수입니다',
        '복잡한 개념은 그래픽으로 시각화하세요',
        '중간중간 휴식 구간을 두는 것을 고려하세요'
      ];
      guide.platformTips = [
        'YouTube: 고품질 썸네일로 클릭률 높이기',
        '교육용: 배속 재생 옵션 안내 필요'
      ];
    }
    // ✅ 좋은 조합들
    else if ((timeValue === '15초' || timeValue === '30초') && (contentValue === '초간단' || contentValue === '간단')) {
      guide.status = 'good';
      guide.message = '🎯 완벽한 숏폼 조합입니다! 짧은 시간에 명확한 메시지를 전달할 수 있습니다.';
      guide.suggestions = [
        '첫 3초에 훅(Hook)을 배치하여 시청자 관심을 끌어보세요',
        '강력한 CTA(Call to Action)로 마무리하세요',
        '반복 시청을 유도하는 루프 구조를 고려하세요'
      ];
      guide.platformTips = [
        'TikTok: 트렌드 사운드와 해시태그 활용',
        'Instagram Reels: 스토리 연계로 추가 정보 제공',
        'YouTube Shorts: 시리즈물로 제작하여 구독 유도'
      ];
    }
    else if ((timeValue === '3분' || timeValue === '5분') && (contentValue === '보통' || contentValue === '상세')) {
      guide.status = 'good';
      guide.message = '👍 교육용 영상에 최적화된 조합입니다. 충분한 설명과 적절한 시청 시간을 유지합니다.';
      guide.suggestions = [
        '도입-전개-결론 구조로 체계적으로 구성하세요',
        '중간에 요약 구간을 두어 이해도를 높이세요',
        '실제 사례나 데모를 포함하면 더욱 효과적입니다'
      ];
      guide.platformTips = [
        'YouTube: 타임스탬프 활용으로 원하는 구간 접근 가능',
        '회사 교육: 반복 학습을 위한 북마크 기능 안내',
        'LinkedIn: 전문성을 어필할 수 있는 좋은 길이'
      ];
    }
    else if (timeValue === '10분+' && (contentValue === '상세' || contentValue === '매우상세')) {
      guide.status = 'good';
      guide.message = '📚 심화 교육이나 다큐멘터리에 적합한 조합입니다. 깊이 있는 내용 전달이 가능합니다.';
      guide.suggestions = [
        '챕터별로 구성하여 구간별 접근성을 높이세요',
        '정기적인 요약과 복습 구간을 배치하세요',
        '긴 영상에서 편집된 숏폼 버전도 함께 제작하세요'
      ];
      guide.platformTips = [
        'YouTube: 챕터, 카드, 엔드스크린 모두 활용',
        '교육 플랫폼: 진도 표시와 북마크 기능 필수',
        '웨비나: Q&A 세션을 위한 시간 확보'
      ];
    }
    else {
      guide.status = 'good';
      guide.message = '✅ 균형 잡힌 조합입니다. 목적에 맞게 내용을 구성하세요.';
      guide.suggestions = [
        '선택하신 조합에 맞는 스토리보드를 계획하세요',
        '타겟 시청자의 관심도를 유지하는 것이 중요합니다'
      ];
    }

    // 목적별 추가 가이드
    if (purposes.includes('마케팅·홍보')) {
      guide.platformTips.push('마케팅용: ROI 측정을 위한 추적 코드 삽입 권장');
      if (timeValue === '10분+') {
        guide.suggestions.push('🎬 긴 영상은 숏폼 클립으로 재편집하여 다중 플랫폼 활용하세요');
      }
    }

    if (purposes.includes('교육·정보전달')) {
      guide.platformTips.push('교육용: 학습 효과 측정을 위한 퀴즈나 과제 연계 고려');
      if (contentValue === '꽉찬') {
        guide.suggestions.push('📖 고밀도 내용은 보조 자료(PDF, 슬라이드)와 함께 제공하세요');
      }
    }

    setAiGuide(guide);
  };

  // 스케일 변경 핸들러들
  const handleTimeScaleChange = (type: string, value: string) => {
    const newScale = { ...scale, timeScale: { type, value } };
    setScale(newScale);
    onUpdate({
      scale: newScale,
      step4Notes: specialNotes
    });
  };

  const handleContentScaleChange = (type: string, value: string) => {
    const newScale = { ...scale, contentScale: { type, value } };
    setScale(newScale);
    onUpdate({
      scale: newScale,
      step4Notes: specialNotes
    });
  };

  const handleNotesChange = (notes: string) => {
    setSpecialNotes(notes);
    onUpdate({
      scale: scale,
      step4Notes: notes
    });
  };

  // AI 가이드 업데이트
  useEffect(() => {
    generateAIGuide();
  }, [scale.timeScale, scale.contentScale, data.purposes]);

  const getCostIndicator = (cost: string) => {
    const indicators = {
      low: { color: 'text-green-600', label: '💰', desc: '경제적' },
      medium: { color: 'text-yellow-600', label: '💰💰', desc: '보통' },
      high: { color: 'text-red-600', label: '💰💰💰', desc: '고비용' },
      'very-high': { color: 'text-purple-600', label: '💰💰💰💰', desc: '최고급' }
    };
    return indicators[cost] || indicators.medium;
  };

  const handleNext = () => {
    onNext();
  };

  const canProceed = scale.timeScale && scale.contentScale;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">영상 분량을 선택해주세요</h2>
        <p className="text-gray-600 mb-6">
          시간 기준과 내용 분량을 각각 선택해주세요. AI가 조합을 분석하여 최적의 가이드를 제공합니다.
        </p>
        
        {/* 이전 단계 정보 표시 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <i className="ri-target-line text-blue-600 mr-2"></i>
              <span className="font-medium text-blue-800">선택된 목적: </span>
              <span className="text-blue-700">{data?.purposes?.join(', ') || '없음'}</span>
            </div>
            <div className="flex items-center">
              <i className="ri-list-check text-blue-600 mr-2"></i>
              <span className="font-medium text-blue-800">세부 용도: </span>
              <span className="text-blue-700">
                {data?.details?.slice(0, 3).join(', ') || '없음'}
                {data?.details?.length > 3 && ` 외 ${data.details.length - 3}개`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 NEW: 시간 기준 선택 (독립적) */}
      <div className="bg-purple-50 rounded-lg p-4">
        <h3 className="font-medium text-purple-800 mb-4 flex items-center">
          <i className="ri-time-line text-purple-600 mr-2 w-5 h-5 flex items-center justify-center"></i>
          1️⃣ 시간 기준 선택 (필수)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {timeOptions.map((option) => {
            const isSelected = scale.timeScale?.value === option.value;
            const costInfo = getCostIndicator(option.cost);
            
            return (
              <div key={option.value} className="relative group">
                <label
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                    ? 'border-purple-500 bg-purple-100 hover:bg-purple-200'
                    : 'border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="timeScale"
                    checked={isSelected}
                    onChange={() => handleTimeScaleChange('시간', option.value)}
                    className="sr-only"
                  />
                  
                  <div className={`${
                    isSelected 
                    ? 'text-purple-700' 
                    : 'text-gray-700'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <i className={`${option.icon} text-xl mr-2 w-6 h-6 flex items-center justify-center`}></i>
                        <span className="font-semibold">{option.value}</span>
                      </div>
                      <span className={`text-xs ${costInfo.color}`} title={`${costInfo.desc} 비용`}>
                        {costInfo.label}
                      </span>
                    </div>
                    
                    <div className="text-sm mb-2">{option.description}</div>
                    
                    <div className="text-xs text-gray-500">
                      <div className="font-medium mb-1">주요 플랫폼:</div>
                      <div className="flex flex-wrap gap-1">
                        {option.platforms.map((platform, idx) => (
                          <span key={idx} className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🚀 NEW: 내용 분량 선택 (독립적) */}
      <div className="bg-green-50 rounded-lg p-4">
        <h3 className="font-medium text-green-800 mb-4 flex items-center">
          <i className="ri-file-list-3-line text-green-600 mr-2 w-5 h-5 flex items-center justify-center"></i>
          2️⃣ 내용 분량 선택 (필수)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contentOptions.map((option) => {
            const isSelected = scale.contentScale?.value === option.value;
            const costInfo = getCostIndicator(option.cost);
            
            return (
              <div key={option.value} className="relative group">
                <label
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                    ? 'border-green-500 bg-green-100 hover:bg-green-200'
                    : 'border-gray-300 bg-white hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="contentScale"
                    checked={isSelected}
                    onChange={() => handleContentScaleChange('분량', option.value)}
                    className="sr-only"
                  />
                  
                  <div className={`${
                    isSelected 
                    ? 'text-green-700' 
                    : 'text-gray-700'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <i className={`${option.icon} text-xl mr-2 w-6 h-6 flex items-center justify-center`}></i>
                        <span className="font-semibold">{option.value}</span>
                      </div>
                      <span className={`text-xs ${costInfo.color}`} title={`${costInfo.desc} 비용`}>
                        {costInfo.label}
                      </span>
                    </div>
                    
                    <div className="text-sm mb-2">{option.description}</div>
                    
                    <div className="text-xs">
                      <span className="font-medium">정보 밀도: </span>
                      <span className={`
                        ${option.density === 'very-low' ? 'text-green-600' :
                          option.density === 'low' ? 'text-green-600' :
                          option.density === 'medium' ? 'text-yellow-600' :
                          option.density === 'high' ? 'text-orange-600' :
                          option.density === 'very-high' ? 'text-red-600' :
                          'text-purple-600'
                        }
                      `}>
                        {option.density === 'very-low' ? '매우 낮음' :
                         option.density === 'low' ? '낮음' :
                         option.density === 'medium' ? '보통' :
                         option.density === 'high' ? '높음' :
                         option.density === 'very-high' ? '매우 높음' :
                         '초고밀도'
                        }
                      </span>
                    </div>
                  </div>
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🚀 NEW: AI 스마트 가이드 */}
      {aiGuide && (
        <div className={`border-2 rounded-lg p-6 ${
          aiGuide.status === 'good' ? 'bg-blue-50 border-blue-300' :
          aiGuide.status === 'warning' ? 'bg-yellow-50 border-yellow-300' :
          'bg-red-50 border-red-300'
        }`}>
          <div className="flex items-start mb-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
              aiGuide.status === 'good' ? 'bg-blue-100 text-blue-600' :
              aiGuide.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
              'bg-red-100 text-red-600'
            }`}>
              <i className={`${
                aiGuide.status === 'good' ? 'ri-ai-generate' :
                aiGuide.status === 'warning' ? 'ri-error-warning-line' :
                'ri-error-warning-fill'
              } w-5 h-5 flex items-center justify-center`}></i>
            </div>
            <div className="flex-1">
              <h4 className={`font-semibold mb-2 ${
                aiGuide.status === 'good' ? 'text-blue-800' :
                aiGuide.status === 'warning' ? 'text-yellow-800' :
                'text-red-800'
              }`}>
                🤖 AI 분석 결과
              </h4>
              <p className={`text-sm mb-3 ${
                aiGuide.status === 'good' ? 'text-blue-700' :
                aiGuide.status === 'warning' ? 'text-yellow-700' :
                'text-red-700'
              }`}>
                {aiGuide.message}
              </p>
            </div>
          </div>

          {aiGuide.suggestions.length > 0 && (
            <div className="mb-4">
              <h5 className={`font-medium mb-2 ${
                aiGuide.status === 'good' ? 'text-blue-800' :
                aiGuide.status === 'warning' ? 'text-yellow-800' :
                'text-red-800'
              }`}>
                💡 AI 추천사항
              </h5>
              <ul className={`text-sm space-y-1 ${
                aiGuide.status === 'good' ? 'text-blue-700' :
                aiGuide.status === 'warning' ? 'text-yellow-700' :
                'text-red-700'
              }`}>
                {aiGuide.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {aiGuide.platformTips.length > 0 && (
            <div className={`p-3 rounded-lg ${
              aiGuide.status === 'good' ? 'bg-blue-100' :
              aiGuide.status === 'warning' ? 'bg-yellow-100' :
              'bg-red-100'
            }`}>
              <h5 className={`font-medium mb-2 ${
                aiGuide.status === 'good' ? 'text-blue-800' :
                aiGuide.status === 'warning' ? 'text-yellow-800' :
                'text-red-800'
              }`}>
                📱 플랫폼별 팁
              </h5>
              <ul className={`text-xs space-y-1 ${
                aiGuide.status === 'good' ? 'text-blue-600' :
                aiGuide.status === 'warning' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {aiGuide.platformTips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 선택 결과 미리보기 */}
      {canProceed && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-3">✅ 분량 설정 완료</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div className="bg-white p-3 rounded border border-purple-200">
              <div className="text-sm font-medium text-purple-700 mb-1">⏱️ 시간 기준</div>
              <div className="text-purple-600 font-medium">{scale.timeScale?.value}</div>
            </div>
            
            <div className="bg-white p-3 rounded border border-green-200">
              <div className="text-sm font-medium text-green-700 mb-1">📝 내용 분량</div>
              <div className="text-green-600 font-medium">{scale.contentScale?.value}</div>
            </div>
          </div>

          <div className="mt-3 p-3 bg-blue-100 rounded-lg">
            <div className="text-xs text-blue-700">
              <p className="font-medium mb-1">🎯 설정 효과</p>
              <p>• 시간과 분량 조합으로 정확한 제작 계획 수립</p>
              <p>• 플랫폼별 최적화된 콘텐츠 제작 가능</p>
              <p>• AI 가이드로 효과적인 영상 구성 보장</p>
            </div>
          </div>
        </div>
      )}

      {/* 기타 추가 입력사항 */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="font-medium text-orange-800 mb-3">
          <i className="ri-sticky-note-line mr-2"></i>
          기타 추가 입력사항
        </h3>
        <textarea
          value={specialNotes}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="예: 특별한 분량 요구사항 / 플랫폼별 버전 제작 희망 / 시간이나 내용 조정이 필요한 상황 / AI 가이드와 다른 방향이 필요한 이유 등"
          className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none bg-white"
          rows={4}
        />
        <p className="text-xs text-orange-700 mt-2">
          💡 AI 가이드와 다른 방향을 원하시거나 특별한 요구사항이 있으시면 자세히 설명해주세요!
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
