
'use client';

import { useState } from 'react';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  onPrev: () => void;
  onGoToFirst: () => void;
}

export default function Step8Inquiry({ data, onUpdate, onPrev, onGoToFirst }: Props) {
  const [contactInfo, setContactInfo] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    preferredContact: 'email',
    urgency: 'normal',
    message: '',
    agreeToTerms: false,
    agreeToMarketing: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [specialNotes, setSpecialNotes] = useState(data.step8Notes || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactInfo.agreeToTerms) {
      alert('개인정보 처리방침에 동의해주세요.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onUpdate({
        contactInfo,
        step8Notes: specialNotes,
        submittedAt: new Date().toISOString()
      });
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('견적 요청 전송 실패:', error);
      alert('전송 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatEstimate = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // 🚀 NEW: 업계 분석 및 위험 요소 정보 - 완전히 복원
  const getIndustryAnalysis = () => {
    const midPrice = data.estimate?.mid || 0;
    let analysis = {
      level: 'standard',
      comparison: '',
      risks: [],
      recommendations: [],
      freelancerRisks: [],
      companyBenefits: [],
      priceAnalysis: {
        low: { range: '', risks: [], note: '' },
        mid: { range: '', benefits: [], note: '' },
        high: { range: '', benefits: [], note: '' }
      }
    };

    // 🚀 NEW: 가격대별 상세 분석
    if (midPrice < 1000000) {
      analysis = {
        level: 'budget',
        comparison: '업계 평균 대비 30-40% 저렴한 초저가 수준',
        risks: [
          '품질 저하 가능성 매우 높음',
          '수정 횟수 1-2회로 제한',
          '납기 지연 위험 높음',
          '프리랜서 의존도 100%',
          '포트폴리오 검증 필수',
          '계약서 상세 조건 확인 중요'
        ],
        recommendations: [
          '계약서에 수정 범위 명확히 명시',
          '포트폴리오 및 레퍼런스 철저히 검증',
          '단계별 검수 프로세스 필수 확립',
          '최종 결과물 품질 기대치 조정 필요'
        ],
        freelancerRisks: [
          '개인 작업자의 실력 편차가 매우 큼',
          '갑작스런 작업 중단 위험',
          '수정 요청 시 추가 비용 발생 가능',
          'A/S 및 지속적 지원 어려움'
        ],
        companyBenefits: [
          '체계적 프로젝트 관리',
          '품질 보증 시스템',
          '팀워크를 통한 안정적 결과',
          '사후 지원 및 A/S 보장'
        ],
        priceAnalysis: {
          low: { 
            range: '50만원 - 80만원', 
            risks: ['최소한의 품질만 보장', '수정 불가능한 경우 많음', '단순 편집 수준'], 
            note: '⚠️ 매우 위험한 가격대 - 품질 보장 어려움' 
          },
          mid: { 
            range: '80만원 - 120만원', 
            benefits: ['기본적인 품질 확보', '1-2회 수정 가능', '프리랜서 중급 수준'], 
            note: '💡 저예산에서 최선의 선택' 
          },
          high: { 
            range: '120만원 - 200만원', 
            benefits: ['준수한 품질 기대', '전문 프리랜서 또는 소규모 팀', '복수 수정 가능'], 
            note: '✅ 합리적인 품질 대비 가격' 
          }
        }
      };
    } else if (midPrice < 3000000) {
      analysis = {
        level: 'standard',
        comparison: '업계 표준 가격 수준 - 가장 일반적인 범위',
        risks: [
          '제작사별 품질 편차 존재',
          '일정 지연 가능성',
          '커뮤니케이션 미스매치 위험',
          '추가 요구사항 시 비용 증가'
        ],
        recommendations: [
          '제작사 포트폴리오 및 레퍼런스 확인',
          '중간 검수 일정 사전 협의',
          '수정 범위 및 횟수 명확히 합의',
          '제작 단계별 소통 체계 구축'
        ],
        freelancerRisks: [
          '개인 역량에 따른 품질 차이',
          '복잡한 프로젝트 처리 한계',
          '일정 관리 능력 부족',
          '다양한 분야 전문성 부족'
        ],
        companyBenefits: [
          '전문 분야별 팀원 구성',
          '체계적 품질 관리 시스템',
          '안정적 일정 관리',
          '종합적 서비스 제공'
        ],
        priceAnalysis: {
          low: { 
            range: '150만원 - 200만원', 
            risks: ['기본 수준의 제작', '제한적 수정', '단순한 연출'], 
            note: '💰 경제적이지만 기본 수준' 
          },
          mid: { 
            range: '200만원 - 400만원', 
            benefits: ['전문적 품질', '충분한 수정 횟수', '다양한 연출 기법'], 
            note: '🎯 가장 합리적인 선택' 
          },
          high: { 
            range: '400만원 - 600만원', 
            benefits: ['고품질 제작', '프리미엄 서비스', '세밀한 후반작업'], 
            note: '✨ 고품질 보장' 
          }
        }
      };
    } else if (midPrice < 6000000) {
      analysis = {
        level: 'premium',
        comparison: '업계 평균 대비 20-30% 높은 프리미엄 수준',
        risks: [
          '예산 초과 가능성',
          '과도한 스펙 적용 위험',
          '제작 기간 연장 가능성',
          '높은 기대치와 실제 결과물 간 차이'
        ],
        recommendations: [
          '상세 견적 내역 철저히 검토',
          '필수/선택 항목 명확히 구분',
          '단계별 비용 분할 협의',
          '최종 결과물 샘플 사전 확인'
        ],
        freelancerRisks: [
          '고급 작업에 대한 경험 부족',
          '복잡한 요구사항 처리 한계',
          '다양한 전문 분야 통합 어려움',
          '클라이언트 기대치 충족 어려움'
        ],
        companyBenefits: [
          '전문 제작팀의 체계적 접근',
          '고급 장비 및 기술 보유',
          '다양한 전문가 협업',
          '높은 완성도 보장'
        ],
        priceAnalysis: {
          low: { 
            range: '300만원 - 450만원', 
            benefits: ['프리미엄 기본 수준', '전문 제작팀', '고급 후반작업'], 
            note: '🔥 프리미엄 품질 시작점' 
          },
          mid: { 
            range: '450만원 - 700만원', 
            benefits: ['최고급 품질', '완벽한 후반작업', '브랜드 가치 상승'], 
            note: '👑 최고급 제작 서비스' 
          },
          high: { 
            range: '700만원 이상', 
            benefits: ['방송급 품질', '유명 제작진', '완벽한 마케팅 효과'], 
            note: '🚀 최상급 프리미엄 서비스' 
          }
        }
      };
    } else {
      analysis = {
        level: 'ultra-premium',
        comparison: '업계 최고가 수준 - 방송/광고급 제작',
        risks: [
          '매우 높은 비용 대비 효과',
          '과도한 스펙으로 인한 비효율',
          '긴 제작 기간',
          '복잡한 제작 프로세스'
        ],
        recommendations: [
          '투자 대비 효과 신중히 검토',
          '명확한 목표 및 KPI 설정',
          '장기적 활용 방안 수립',
          '전문 컨설팅 필수'
        ],
        freelancerRisks: [
          '개인 작업자로는 처리 불가능',
          '대규모 프로젝트 관리 경험 부족',
          '방송급 품질 구현 어려움',
          '전문 장비 및 인력 부족'
        ],
        companyBenefits: [
          '방송급 전문 제작진',
          '최고급 장비 및 시설',
          '체계적 프로젝트 관리',
          '완벽한 품질 보장'
        ],
        priceAnalysis: {
          low: { 
            range: '600만원 - 1000만원', 
            benefits: ['방송급 기본 수준', '전문 제작진', '최고급 장비'], 
            note: '📺 방송급 품질 보장' 
          },
          mid: { 
            range: '1000만원 - 2000만원', 
            benefits: ['CF급 최고 품질', '유명 감독', '완벽한 마케팅'], 
            note: '🎬 CF/방송 수준의 완성도' 
          },
          high: { 
            range: '2000만원 이상', 
            benefits: ['국제 수준 품질', '세계적 제작진', '글로벌 마케팅'], 
            note: '🌟 국제적 수준의 최고급 제작' 
          }
        }
      };
    }

    return analysis;
  };

  // 제출 완료 화면
  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-check-line text-green-600 text-3xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">견적 요청이 완료되었습니다!</h2>
          <p className="text-gray-600">
            영업일 기준 24시간 내에 담당자가 연락드리겠습니다.
          </p>
        </div>

        {/* 요청 내용 요약 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
          <h3 className="font-semibold text-blue-800 mb-4">📋 요청 내용 요약</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium text-blue-800 mb-1">기본 정보</div>
              <div className="text-blue-700 space-y-1">
                <p>• 목적: {data.purposes?.join(', ')}</p>
                <p>• 분량: {data.scale?.timeScale?.value} / {data.scale?.contentScale?.value}</p>
              </div>
            </div>
            
            <div>
              <div className="font-medium text-blue-800 mb-1">예상 견적</div>
              <div className="text-blue-700 space-y-1">
                <p>• 최소: {formatEstimate(data.estimate?.low || 0)}</p>
                <p>• 표준: <strong>{formatEstimate(data.estimate?.mid || 0)}</strong></p>
                <p>• 최대: {formatEstimate(data.estimate?.high || 0)}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-blue-200">
            <div className="font-medium text-blue-800 mb-1">연락처 정보</div>
            <div className="text-blue-700 text-sm">
              <p>{contactInfo.name} / {contactInfo.company || '개인'}</p>
              <p>{contactInfo.email} / {contactInfo.phone}</p>
            </div>
          </div>
        </div>

        {/* 다음 단계 안내 */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-green-800 mb-3">🎯 다음 진행 과정</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600 font-bold">1</span>
              </div>
              <div className="font-medium text-green-800">담당자 연락</div>
              <div className="text-green-600 text-xs mt-1">24시간 내</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <div className="font-medium text-green-800">상세 상담</div>
              <div className="text-green-600 text-xs mt-1">요구사항 조율</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600 font-bold">3</span>
              </div>
              <div className="font-medium text-green-800">견적서 발송</div>
              <div className="text-green-600 text-xs mt-1">정확한 견적 확정</div>
            </div>
          </div>
        </div>

        {/* 추가 안내 */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
          <div className="text-sm text-gray-700">
            <p className="font-medium mb-2">📞 긴급 문의</p>
            <p>급한 일정이나 추가 문의사항이 있으시면 직접 연락주세요.</p>
            <p className="text-blue-600 font-medium mt-1">
              📧 contact@video-production.com | 📱 010-1234-5678
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onGoToFirst}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            새로운 견적 요청하기
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer"
          >
            요약 정보 인쇄하기
          </button>
        </div>
      </div>
    );
  }

  const industryAnalysis = getIndustryAnalysis();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">연락처 정보를 입력해주세요</h2>
        <p className="text-gray-600 mb-6">
          정확한 견적과 상담을 위해 연락처 정보를 입력해주세요. 영업일 기준 24시간 내에 연락드리겠습니다.
        </p>
      </div>

      {/* 🚀 NEW: 업계 분석 및 AI 견적 요약 - 완전 복원 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-800 mb-4 flex items-center">
          <i className="ri-ai-generate mr-2"></i>
          💰 AI 견적 분석 요약
        </h3>
        
        {/* 🚀 NEW: 3단계 가격 비교 - 완전 복원 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-sm text-red-600 mb-1">업계 최저가</div>
            <div className="text-lg font-bold text-red-600">
              {formatEstimate((data.estimate?.mid || 0) * 0.6)}
            </div>
            <div className="text-xs text-red-500 mt-1">{industryAnalysis.priceAnalysis.low.note}</div>
            <div className="text-xs text-red-600 mt-2">
              범위: {industryAnalysis.priceAnalysis.low.range}
            </div>
          </div>
          
          <div className="text-center p-4 bg-blue-100 border-2 border-blue-300 rounded-lg">
            <div className="text-sm text-blue-600 mb-1">AI 권장가 ({industryAnalysis.level})</div>
            <div className="text-xl font-bold text-blue-700">
              {formatEstimate(data.estimate?.mid || 0)}
            </div>
            <div className="text-xs text-blue-600 mt-1">{industryAnalysis.priceAnalysis.mid.note}</div>
            <div className="text-xs text-blue-600 mt-2">
              범위: {industryAnalysis.priceAnalysis.mid.range}
            </div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="text-sm text-purple-600 mb-1">업계 최고가</div>
            <div className="text-lg font-bold text-purple-600">
              {formatEstimate((data.estimate?.mid || 0) * 1.6)}
            </div>
            <div className="text-xs text-purple-500 mt-1">{industryAnalysis.priceAnalysis.high.note}</div>
            <div className="text-xs text-purple-600 mt-2">
              범위: {industryAnalysis.priceAnalysis.high.range}
            </div>
          </div>
        </div>

        {/* 🚀 NEW: 위험 요소 및 주의사항 - 완전 복원 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-800 mb-2 flex items-center">
              <i className="ri-error-warning-line mr-2"></i>
              ⚠️ 주요 위험요소
            </h4>
            <ul className="text-sm text-red-700 space-y-1">
              {industryAnalysis.risks.map((risk, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-500 mr-1 mt-1">•</span>
                  {risk}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-2 flex items-center">
              <i className="ri-lightbulb-line mr-2"></i>
              💡 AI 추천사항
            </h4>
            <ul className="text-sm text-green-700 space-y-1">
              {industryAnalysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-1 mt-1">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 🚀 NEW: 프리랜서 vs 제작사 위험도 비교 - 완전 복원 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800 mb-3">🎯 제작 방식별 위험도 분석</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="font-medium text-orange-800 mb-2 flex items-center">
                <i className="ri-user-line mr-2"></i>
                개인 프리랜서 의뢰 시
              </div>
              <div className="text-orange-700 space-y-1 mb-3">
                <p>• 💰 비용: 30-50% 저렴</p>
                <p>• ⚠️ 위험도: <span className="font-bold text-red-600">높음</span></p>
              </div>
              <div className="text-xs text-orange-600">
                <p><strong>주요 위험:</strong></p>
                <ul className="ml-3 mt-1 space-y-1">
                  {industryAnalysis.freelancerRisks.map((risk, index) => (
                    <li key={index}>• {risk}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="font-medium text-blue-800 mb-2 flex items-center">
                <i className="ri-building-line mr-2"></i>
                전문 제작사 의뢰 시
              </div>
              <div className="text-blue-700 space-y-1 mb-3">
                <p>• 💰 비용: 표준-프리미엄</p>
                <p>• ✅ 안정성: <span className="font-bold text-green-600">높음</span></p>
              </div>
              <div className="text-xs text-blue-600">
                <p><strong>주요 장점:</strong></p>
                <ul className="ml-3 mt-1 space-y-1">
                  {industryAnalysis.companyBenefits.map((benefit, index) => (
                    <li key={index}>• {benefit}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 🚀 NEW: 등급별 상세 분석 */}
          <div className="mt-4 p-3 bg-white border border-yellow-300 rounded-lg">
            <h5 className="font-medium text-yellow-800 mb-2">📊 현재 견적 등급 분석</h5>
            <div className="text-sm text-yellow-700">
              <p><strong>등급:</strong> {
                industryAnalysis.level === 'budget' ? '🔴 초저가 (위험)' :
                industryAnalysis.level === 'standard' ? '🟡 표준 (안정)' :
                industryAnalysis.level === 'premium' ? '🟢 프리미엄 (고품질)' :
                '🔵 최고급 (방송급)'
              }</p>
              <p><strong>업계 비교:</strong> {industryAnalysis.comparison}</p>
              <p className="mt-2"><strong>💡 종합 판단:</strong></p>
              <p className="text-xs mt-1 italic">
                {industryAnalysis.level === 'budget' ? 
                  '매우 저렴하지만 품질과 안정성에 위험이 있습니다. 신중한 업체 선택이 필요합니다.' :
                  industryAnalysis.level === 'standard' ?
                  '가장 합리적인 가격대입니다. 안정적인 품질을 기대할 수 있습니다.' :
                  industryAnalysis.level === 'premium' ?
                  '고품질을 보장하는 프리미엄 서비스입니다. ROI를 신중히 검토하세요.' :
                  '최고급 서비스로 방송급 품질을 기대할 수 있습니다.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 연락처 입력 폼 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 기본 정보 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-medium text-gray-900 mb-4">기본 정보</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={contactInfo.name}
                onChange={(e) => setContactInfo(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="홍길동"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                회사명 <span className="text-sm text-gray-500">(선택사항)</span>
              </label>
              <input
                type="text"
                value={contactInfo.company}
                onChange={(e) => setContactInfo(prev => ({ ...prev, company: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="(주)영상제작"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={contactInfo.email}
                onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="example@company.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                연락처 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={contactInfo.phone}
                onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="010-1234-5678"
              />
            </div>
          </div>
        </div>

        {/* 연락 옵션 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-medium text-gray-900 mb-4">연락 옵션</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                선호하는 연락 방법
              </label>
              <select
                value={contactInfo.preferredContact}
                onChange={(e) => setContactInfo(prev => ({ ...prev, preferredContact: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
              >
                <option value="email">이메일</option>
                <option value="phone">전화</option>
                <option value="both">이메일 + 전화</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                진행 urgency
              </label>
              <select
                value={contactInfo.urgency}
                onChange={(e) => setContactInfo(prev => ({ ...prev, urgency: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
              >
                <option value="normal">일반 (1-2주)</option>
                <option value="urgent">급함 (1주 이내)</option>
                <option value="emergency">매우 급함 (3일 이내)</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              메시지 <span className="text-sm text-gray-500">(선택사항)</span>
            </label>
            <textarea
              value={contactInfo.message}
              onChange={(e) => setContactInfo(prev => ({ ...prev, message: e.target.value }))}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="궁금한 점이나 특별한 요구사항이 있으시면 자유롭게 작성해주세요..."
            />
          </div>
        </div>

        {/* 최종 특이사항 입력란 */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="font-medium text-orange-800 mb-3">
            <i className="ri-sticky-note-line mr-2"></i>
            최종 특이사항 및 요청사항
          </h3>
          <textarea
            value={specialNotes}
            onChange={(e) => setSpecialNotes(e.target.value)}
            placeholder="예: 마지막으로 놓친 부분이나 강조하고 싶은 요구사항이 있으시면 작성해주세요"
            className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none bg-white"
            rows={4}
          />
          <p className="text-xs text-orange-700 mt-2">
            💡 마지막 단계입니다! 놓친 부분이 있으시면 자유롭게 작성해주세요.
          </p>
        </div>

        {/* 동의 항목 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-medium text-gray-900 mb-4">개인정보 처리 동의</h3>
          
          <div className="space-y-3">
            <label className="flex items-start">
              <input
                type="checkbox"
                checked={contactInfo.agreeToTerms}
                onChange={(e) => setContactInfo(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm text-gray-700">
                <span className="text-red-500">*</span> 
                <strong>개인정보 수집 및 이용에 동의</strong>합니다. 
                <br />
                <span className="text-xs text-gray-500">
                  수집항목: 이름, 연락처, 이메일, 회사명 / 이용목적: 견적 상담 및 서비스 제공 / 보유기간: 상담 완료 후 1년
                </span>
              </span>
            </label>
            
            <label className="flex items-start">
              <input
                type="checkbox"
                checked={contactInfo.agreeToMarketing}
                onChange={(e) => setContactInfo(prev => ({ ...prev, agreeToMarketing: e.target.checked }))}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm text-gray-700">
                마케팅 정보 수신에 동의합니다. (선택사항)
                <br />
                <span className="text-xs text-gray-500">
                  영상 제작 관련 유용한 정보와 할인 혜택을 받아보실 수 있습니다.
                </span>
              </span>
            </label>
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onPrev}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium whitespace-nowrap cursor-pointer hover:bg-gray-200 transition-colors"
          >
            이전으로
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting || !contactInfo.agreeToTerms}
            className={`px-8 py-3 rounded-lg text-lg font-bold whitespace-nowrap cursor-pointer transition-colors ${
              isSubmitting || !contactInfo.agreeToTerms
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="inline-block animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                견적 요청 전송 중...
              </>
            ) : (
              <>
                <i className="ri-send-plane-line mr-2"></i>
                견적 요청하기
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
