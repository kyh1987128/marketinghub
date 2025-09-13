
'use client';

import { useState, useEffect } from 'react';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

interface Reference {
  id: string;
  title: string;
  thumbnail: string;
  tags: string[];
  url?: string;
  type: 'custom' | 'ai';
  analysis?: any;
}

export default function Step6Reference({ data, onUpdate, onNext, onPrev }: Props) {
  const [selectedReferences, setSelectedReferences] = useState<string[]>(data.selectedReferences || []);
  const [customReferences, setCustomReferences] = useState<Reference[]>(data.customReferences || []);
  const [aiReferences, setAiReferences] = useState<Reference[]>(data.aiReferences || []);
  const [toneKeywords, setToneKeywords] = useState<string[]>(data.toneKeywords || []);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [specialNotes, setSpecialNotes] = useState(data.step6Notes || '');

  // 톤앤매너 키워드
  const toneOptions = [
    '신뢰할 수 있는', '전문적인', '친근한', '혁신적인', '안정적인',
    '역동적인', '따뜻한', '세련된', '실용적인', '창의적인',
    '진실한', '열정적인', '차분한', '현대적인', '품격있는'
  ];

  // AI 레퍼런스 생성
  const generateAIReferences = async () => {
    setIsLoadingAI(true);
    try {
      // 시뮬레이션 딜레이
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 선택된 용도와 타겟에 맞는 레퍼런스 생성
      const mockReferences: Reference[] = [
        {
          id: 'ai-1',
          title: '비슷한 용도의 성공 레퍼런스 #1',
          thumbnail: `https://readdy.ai/api/search-image?query=professional%20video%20production%20reference%20modern%20corporate%20style%20clean%20aesthetic&width=400&height=225&seq=ref1&orientation=landscape`,
          tags: ['전문적', '기업형', '클린'],
          url: 'https://youtube.com/example1',
          type: 'ai',
          analysis: {
            similarity: 95,
            reason: '선택하신 용도와 타겟에 가장 적합한 스타일입니다.'
          }
        },
        {
          id: 'ai-2',
          title: '추천 톤앤매너 레퍼런스 #2',
          thumbnail: `https://readdy.ai/api/search-image?query=modern%20video%20commercial%20style%20dynamic%20editing%20trendy%20design%20visual%20effects&width=400&height=225&seq=ref2&orientation=landscape`,
          tags: ['다이나믹', '트렌디', '현대적'],
          url: 'https://vimeo.com/example2',
          type: 'ai',
          analysis: {
            similarity: 88,
            reason: '선택하신 타겟 연령대에 어필할 수 있는 스타일입니다.'
          }
        },
        {
          id: 'ai-3',
          title: '업계 표준 레퍼런스 #3',
          thumbnail: `https://readdy.ai/api/search-image?query=business%20video%20presentation%20style%20professional%20lighting%20quality%20cinematography%20standard&width=400&height=225&seq=ref3&orientation=landscape`,
          tags: ['표준적', '안정적', '신뢰감'],
          url: 'https://youtube.com/example3',
          type: 'ai',
          analysis: {
            similarity: 82,
            reason: '해당 업계에서 일반적으로 사용되는 검증된 스타일입니다.'
          }
        }
      ];
      
      setAiReferences(mockReferences);
    } catch (error) {
      console.error('AI 레퍼런스 생성 오류:', error);
    } finally {
      setIsLoadingAI(false);
    }
  };

  // 커스텀 레퍼런스 추가
  const addCustomReference = (url: string) => {
    if (!url.trim()) return;
    
    const newRef: Reference = {
      id: `custom-${Date.now()}`,
      title: url,
      thumbnail: `https://readdy.ai/api/search-image?query=video%20thumbnail%20placeholder%20custom%20reference%20user%20provided%20content&width=400&height=225&seq=custom${Date.now()}&orientation=landscape`,
      tags: ['사용자 제공'],
      url: url,
      type: 'custom'
    };
    
    setCustomReferences(prev => [...prev, newRef]);
  };

  const handleToneKeywordToggle = (keyword: string) => {
    setToneKeywords(prev => 
      prev.includes(keyword) 
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  const handleNext = () => {
    onUpdate({
      selectedReferences,
      references: [...customReferences, ...aiReferences],
      customReferences,
      aiReferences,
      toneKeywords,
      step6Notes: specialNotes
    });
    onNext();
  };

  const canProceed = selectedReferences.length > 0 || toneKeywords.length > 0;

  useEffect(() => {
    // 컴포넌트 마운트 시 AI 레퍼런스 자동 생성
    if (aiReferences.length === 0 && data.details && data.targetData) {
      generateAIReferences();
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">레퍼런스와 톤앤매너를 선택해주세요</h2>
        <p className="text-gray-600 mb-6">
          원하시는 영상 스타일과 톤앤매너를 참고 자료를 통해 구체적으로 알려주세요.
        </p>
        
        {/* 이전 단계 요약 */}
        {data.scale && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <i className="ri-information-line text-blue-600 mr-2"></i>
              <div>
                <span className="font-medium text-blue-800">선택된 분량: </span>
                <span className="text-blue-700">
                  {data.scale.value === 'custom' ? data.scale.custom : data.scale.value}
                </span>
                <span className="ml-3 font-medium text-blue-800">제작방식: </span>
                <span className="text-blue-700">{data.productionType}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI 추천 레퍼런스 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">🤖 AI 추천 레퍼런스</h3>
          <button
            onClick={generateAIReferences}
            disabled={isLoadingAI}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isLoadingAI
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isLoadingAI ? (
              <>
                <div className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                생성 중...
              </>
            ) : (
              <>
                <i className="ri-refresh-line mr-2"></i>
                새로 생성
              </>
            )}
          </button>
        </div>

        {isLoadingAI ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 rounded-lg h-32 mb-2"></div>
                <div className="bg-gray-300 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 h-3 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiReferences.map((ref) => {
              return (
                <div key={ref.id} className="relative group">
                  <label
                    className={`block border-2 rounded-lg overflow-hidden transition-colors cursor-pointer ${
                      selectedReferences.includes(ref.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedReferences.includes(ref.id)}
                      onChange={(e) => {
                        setSelectedReferences(prev =>
                          e.target.checked
                            ? [...prev, ref.id]
                            : prev.filter(id => id !== ref.id)
                        );
                      }}
                      className="sr-only"
                    />
                    <img
                      src={ref.thumbnail}
                      alt={ref.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-3">
                      <h4 className="font-medium text-sm text-gray-900">
                        {ref.title}
                      </h4>
                      {/* 🚀 링크 주소 표시 */}
                      {ref.url && (
                        <div className="mt-1 text-xs text-blue-600 truncate">
                          <i className="ri-link mr-1"></i>
                          {ref.url}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {ref.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      {ref.analysis && (
                        <div className="mt-2 text-xs text-green-600">
                          <div className="flex items-center">
                            <i className="ri-thumb-up-line mr-1"></i>
                            매칭도 {ref.analysis.similarity}%
                          </div>
                          <p className="mt-1">{ref.analysis.reason}</p>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 커스텀 레퍼런스 추가 */}
      <div>
        <h3 className="font-medium mb-3">직접 레퍼런스 추가</h3>
        <div className="flex gap-3">
          <input
            type="url"
            placeholder="YouTube, Vimeo 등 영상 URL을 입력하세요"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addCustomReference((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).value = '';
              }
            }}
          />
          <button
            onClick={() => {
              const input = document.querySelector('input[type="url"]') as HTMLInputElement;
              if (input?.value) {
                addCustomReference(input.value);
                input.value = '';
              }
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
          >
            <i className="ri-add-line mr-2"></i>
            추가
          </button>
        </div>

        {customReferences.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {customReferences.map((ref) => (
              <div
                key={ref.id}
                className={`border-2 rounded-lg overflow-hidden ${
                  selectedReferences.includes(ref.id)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <label className="block cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedReferences.includes(ref.id)}
                    onChange={(e) => {
                      setSelectedReferences(prev =>
                        e.target.checked
                          ? [...prev, ref.id]
                          : prev.filter(id => id !== ref.id)
                      );
                    }}
                    className="sr-only"
                  />
                  <img
                    src={ref.thumbnail}
                    alt={ref.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3">
                    <h4 className="font-medium text-sm text-gray-900 truncate">
                      {ref.title}
                    </h4>
                    {/* 🚀 링크 주소 표시 */}
                    {ref.url && (
                      <div className="mt-1 text-xs text-blue-600 truncate">
                        <i className="ri-link mr-1"></i>
                        {ref.url}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {ref.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 톤앤매너 선택 */}
      <div>
        <h3 className="font-medium mb-3">원하는 톤앤매너 키워드</h3>
        <p className="text-gray-600 text-sm mb-4">
          영상에서 표현하고 싶은 분위기나 느낌을 선택해주세요. (중복 선택 가능)
        </p>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {toneOptions.map((tone) => {
            return (
              <div key={tone} className="relative group">
                <label
                  className={`flex items-center justify-center p-3 border-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    toneKeywords.includes(tone)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={toneKeywords.includes(tone)}
                    onChange={() => handleToneKeywordToggle(tone)}
                    className="sr-only"
                  />
                  {tone}
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* 특이사항 입력란 */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="font-medium text-orange-800 mb-3">
          <i className="ri-sticky-note-line mr-2"></i>
          특이사항 및 추가 요청사항
        </h3>
        <textarea
          value={specialNotes}
          onChange={(e) => setSpecialNotes(e.target.value)}
          placeholder="예: 특별한 스타일 요청 / 톤앤매너 조합 요청 / 레퍼런스 관련 세부 사항 등"
          className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none bg-white"
          rows={4}
        />
        <p className="text-xs text-orange-700 mt-2">
          💡 레퍼런스나 스타일과 관련된 특별한 요구사항이 있으시면 자유롭게 작성해주세요!
        </p>
      </div>

      {/* 선택 결과 미리보기 */}
      {(selectedReferences.length > 0 || toneKeywords.length > 0) && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-3">✅ 스타일 가이드 완성</h3>
          
          {selectedReferences.length > 0 && (
            <div className="mb-3">
              <div className="text-sm font-medium text-green-700 mb-2">
                선택된 레퍼런스 ({selectedReferences.length}개):
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedReferences.map(refId => {
                  const ref = [...customReferences, ...aiReferences].find(r => r.id === refId);
                  return ref ? (
                    <span key={refId} className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                      {ref.type === 'ai' ? '🤖 ' : '📎 '}{ref.title.length > 20 ? ref.title.substring(0, 20) + '...' : ref.title}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {toneKeywords.length > 0 && (
            <div>
              <div className="text-sm font-medium text-green-700 mb-2">
                선택된 톤앤매너 ({toneKeywords.length}개):
              </div>
              <div className="flex flex-wrap gap-2">
                {toneKeywords.map(keyword => (
                  <span key={keyword} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3 p-3 bg-blue-100 rounded-lg">
            <div className="text-xs text-blue-700">
              <p className="font-medium mb-1">💡 스타일 가이드 효과</p>
              <p>• 선택하신 레퍼런스를 바탕으로 정확한 스타일 구현</p>
              <p>• 톤앤매너에 맞는 편집 방향성 설정</p>
              <p>• 브랜드 일관성을 유지한 영상 제작</p>
            </div>
          </div>
        </div>
      )}

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
