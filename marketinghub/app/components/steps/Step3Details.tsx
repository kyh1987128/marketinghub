
'use client';

import { useState, useEffect } from 'react';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Step3Details({ data, onUpdate, onNext, onPrev }: Props) {
  const [selectedDetails, setSelectedDetails] = useState<string[]>(data.details || []);
  const [additionalNotes, setAdditionalNotes] = useState(data.step3Notes || '');

  // 🚀 FIXED: 매칭 로직 개선 - 실제 목적과 정확히 매칭되도록 수정
  const detailOptions = [
    {
      category: '교육·콘텐츠',
      items: ['직원 교육·연수', '고객 교육·안내', '제품 사용 가이드', '안전 교육·매뉴얼', '온보딩·신입교육', '프로세스 설명'],
      matchingPurposes: ['교육·훈련', '안전·보건', '매뉴얼·가이드', '온보딩', '프로세스 안내', '제품 사용법', '교육용', '기업 내부용', '고객 서비스']
    },
    {
      category: '마케팅·홍보',
      items: ['제품·서비스 소개', '브랜드 스토리', '고객 후기·사례', '이벤트·프로모션', 'SNS 콘텐츠', '광고 캠페인'],
      matchingPurposes: ['브랜드 홍보', '제품 소개', '서비스 소개', '매출 증대', '고객 확보', '시장 진입', '마케팅·홍보용', 'SNS·소셜미디어']
    },
    {
      category: '기업·조직',
      items: ['기업 소개·채용', '내부 소통·공지', '기업 IR·투자유치', '파트너십·협력', '성과 발표·보고', '기업 문화·가치'],
      matchingPurposes: ['채용·인사', '투자·IR', '내부 소통', '기업 문화', '협력사 소개', '언론 홍보', '기업 소개', '투자 유치', '기업 내부용']
    },
    {
      category: '행사·이벤트',
      items: ['컨퍼런스·세미나', '제품 런칭 행사', '시상식·축하', '전시회·박람회', '페스티벌·축제', '워크숍·교육'],
      matchingPurposes: ['행사·이벤트', '세미나·컨퍼런스', '런칭 행사', '시상식·축하', '페스티벌', '전시회', '이벤트·행사', '컨퍼런스·세미나']
    },
    {
      category: '개인·창작',
      items: ['개인 포트폴리오', '웨딩·가족 기념', '예술·창작 활동', '개인 브랜딩', '취미·관심사', '기타 개인 목적'],
      matchingPurposes: ['기록·아카이브', '다큐멘터리', '예술·창작', '개인 기념', '웨딩·가족', '기타', '개인용', '포트폴리오', '기념·추모']
    }
  ];

  // 🚀 FIXED: 개선된 매칭 로직 - 더 유연한 문자열 매칭
  const getActiveCategories = () => {
    const selectedPurposes = data?.purposes || [];
    if (selectedPurposes.length === 0) return detailOptions; // 목적이 없으면 모든 카테고리 활성화
    
    return detailOptions.map(category => {
      const isActive = category.matchingPurposes.some(purpose => 
        selectedPurposes.some(selected => {
          // 정확한 일치 검사
          if (selected === purpose) return true;
          // 포함 관계 검사 (양방향)
          if (selected.includes(purpose) || purpose.includes(selected)) return true;
          // 키워드 기반 매칭
          const selectedKeywords = selected.split(/[·\s]/);
          const purposeKeywords = purpose.split(/[·\s]/);
          return selectedKeywords.some(sk => purposeKeywords.some(pk => sk === pk));
        })
      );
      return { ...category, isActive };
    });
  };

  // 🚀 FIXED: useState 대신 직접 onUpdate 호출로 렌더링 중 상태 업데이트 방지
  const handleDetailToggle = (detail: string) => {
    const updated = selectedDetails.includes(detail)
      ? selectedDetails.filter(d => d !== detail)
      : [...selectedDetails, detail];
    
    setSelectedDetails(updated);
    
    // 디바운스 없이 즉시 업데이트하지만 렌더링 후에 실행
    setTimeout(() => {
      onUpdate({
        details: updated,
        step3Notes: additionalNotes
      });
    }, 0);
  };

  // 🚀 FIXED: additionalNotes 변경 시에만 디바운스 적용
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onUpdate({
        details: selectedDetails,
        step3Notes: additionalNotes
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [additionalNotes]);

  const handleNext = () => {
    onNext();
  };

  const canProceed = selectedDetails.length > 0;
  const activeCategories = getActiveCategories();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">세부 용도를 선택해주세요</h2>
        <p className="text-gray-600 mb-6">
          영상의 구체적인 활용 목적을 선택해주세요. 선택하신 목적에 맞는 용도만 표시됩니다. (그룹 내 중복 선택 가능)
        </p>
        
        {/* 이전 단계 정보 표시 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <i className="ri-target-line text-blue-600 mr-2 w-4 h-4 flex items-center justify-center"></i>
              <span className="font-medium text-blue-800">선택된 목적: </span>
              <span className="text-blue-700">{data?.purposes?.join(', ') || '없음'}</span>
            </div>
            {data?.targetData && (
              <div className="flex items-center">
                <i className="ri-user-line text-blue-600 mr-2 w-4 h-4 flex items-center justify-center"></i>
                <span className="font-medium text-blue-800">주요 타겟: </span>
                <span className="text-blue-700">
                  {[
                    ...(data.targetData.ageGroups || []).slice(0, 2),
                    ...(data.targetData.occupations || []).slice(0, 2),
                    ...(data.targetData.gender || [])
                  ].join(', ') || '설정되지 않음'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 세부 용도 선택 */}
      <div>
        <h3 className="font-medium mb-4">세부 용도 선택 <span className="text-red-500">*</span> (각 그룹 내에서 중복 선택 가능)</h3>
        
        <div className="space-y-6">
          {activeCategories.map((category) => {
            const isDisabled = category.isActive === false;
            
            return (
              <div key={category.category} className={`rounded-lg p-4 ${
                isDisabled 
                  ? 'bg-gray-100 opacity-50' 
                  : 'bg-gray-50'
              }`}>
                <h4 className={`font-medium mb-3 flex items-center ${
                  isDisabled ? 'text-gray-400' : 'text-gray-800'
                }`}>
                  <span className={`w-2 h-2 rounded-full mr-2 ${
                    isDisabled ? 'bg-gray-300' : 'bg-green-500'
                  }`}></span>
                  {category.category}
                  {isDisabled ? (
                    <span className="ml-2 text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded">
                      선택한 목적과 매칭되지 않음
                    </span>
                  ) : (
                    <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                      ✅ 매칭됨
                    </span>
                  )}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {category.items.map((item) => {
                    const isSelected = selectedDetails.includes(item);
                    
                    return (
                      <div key={item} className="relative group">
                        <label
                          className={`flex items-center p-3 border rounded-lg transition-colors ${
                            isDisabled
                              ? 'cursor-not-allowed bg-gray-200 border-gray-300'
                              : `cursor-pointer ${
                                  isSelected
                                    ? 'border-green-500 bg-green-50 hover:bg-green-100'
                                    : 'border-gray-200 bg-white hover:bg-gray-50'
                                }`
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => !isDisabled && handleDetailToggle(item)}
                            disabled={isDisabled}
                            className={`mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded ${
                              isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          />
                          <span className={`flex-1 text-sm ${
                            isDisabled
                              ? 'text-gray-400'
                              : isSelected 
                                ? 'text-green-700 font-medium' 
                                : 'text-gray-700'
                          }`}>
                            {item}
                          </span>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 선택 결과 미리보기 */}
      {selectedDetails.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 border rounded-lg p-4">
          <h3 className="font-semibold mb-3 text-green-800">
            ✅ 세부 용도 설정 완료
          </h3>
          
          <div className="mb-3">
            <div className="text-sm font-medium mb-2 text-green-700">
              선택된 세부 용도 ({selectedDetails.length}개):
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedDetails.map((detail) => (
                <div key={detail} className="flex items-center rounded-full bg-green-100 text-green-700">
                  <span className="px-3 py-1 text-sm font-medium">
                    {detail}
                  </span>
                  <button
                    onClick={() => handleDetailToggle(detail)}
                    className="ml-1 mr-2 text-green-600 hover:text-green-800 transition-colors"
                    title="선택 해제"
                  >
                    <i className="ri-close-line text-sm"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 p-3 bg-blue-100 rounded-lg">
            <div className="text-xs text-blue-700">
              <p className="font-medium mb-1">💡 매칭 시스템 적용</p>
              <p>• 선택한 목적과 연관된 용도만 활성화되어 정확한 견적 산출</p>
              <p>• 각 그룹 내에서 여러 항목 선택 가능</p>
              <p>• 목적-용도 매칭으로 최적화된 제작 방향 제안</p>
            </div>
          </div>
        </div>
      )}

      {/* 기타 추가 입력사항 */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="font-medium text-orange-800 mb-3">
          <i className="ri-sticky-note-line mr-2 w-4 h-4 flex items-center justify-center"></i>
          기타 추가 입력사항
        </h3>
        <textarea
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
          placeholder="예: 특별한 제작 방식 요청 / 복합적인 용도가 필요한 상황 / 추가로 고려해야 할 사항 등"
          className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none bg-white"
          rows={4}
        />
        <p className="text-xs text-orange-700 mt-2">
          💡 추가적인 요구사항이나 특별한 상황이 있으시면 자세히 설명해주세요!
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