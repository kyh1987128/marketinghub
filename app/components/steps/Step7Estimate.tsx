
'use client';

import React, { useState, useEffect } from 'react';

interface Props {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

interface EstimateBreakdown {
  id: string;
  name: string;
  impact: number;
  description: string;
  category: string;
  days: number;
  people: number;
  technologies?: string[];
  resources?: string[];
  isRemovable: boolean;
  reasoning?: string;
}

export default function Step7Estimate({ data, onUpdate, onNext, onPrev }: Props) {
  const [estimate, setEstimate] = useState(data.estimate || { low: 0, mid: 0, high: 0, breakdown: [] });
  const [timeline, setTimeline] = useState(data.timeline || { total: 0, phases: [] });
  const [isCalculating, setIsCalculating] = useState(false);
  const [specialNotes, setSpecialNotes] = useState(data.step7Notes || '');
  const [removedItems, setRemovedItems] = useState<string[]>([]);

  // 🚀 NEW: 자세한 견적 계산 로직
  const calculateDetailedEstimate = async () => {
    setIsCalculating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let baseCost = 500000;
      let timeInDays = 3;
      const breakdown: EstimateBreakdown[] = [];
      
      // 🚀 NEW: 연번과 아이콘, 상세 설명이 포함된 기본 제작 항목들
      breakdown.push({
        id: 'planning',
        name: '01. 기획 및 콘셉트 개발',
        impact: 400000,
        description: '스토리보드, 시나리오 작성, 콘셉트 기획',
        category: '📋 기획',
        days: 3,
        people: 2,
        technologies: ['Adobe Creative Suite', '기획툴'],
        resources: ['기획자', '크리에이티브 디렉터'],
        isRemovable: false,
        reasoning: '모든 영상 제작의 기초가 되는 필수 단계입니다. 업계 표준 기획비용으로 품질 보장을 위해 생략할 수 없습니다.'
      });

      breakdown.push({
        id: 'production',
        name: '02. 촬영 및 현장 제작',
        impact: 800000,
        description: '촬영장비, 인력, 장소 대여',
        category: '🎬 촬영',
        days: 2,
        people: 5,
        technologies: ['4K 카메라', '조명장비', '음향장비'],
        resources: ['감독', '촬영감독', '조명감독', '음향감독', '스태프'],
        isRemovable: true,
        reasoning: '현장 촬영 대신 스톡 영상이나 애니메이션으로 대체 가능하지만, 맞춤형 콘텐츠 품질은 떨어집니다.'
      });

      breakdown.push({
        id: 'editing',
        name: '03. 편집 및 후반작업',
        impact: 600000,
        description: '영상편집, 컬러보정, 사운드믹싱',
        category: '✂️ 편집',
        days: 4,
        people: 3,
        technologies: ['Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve'],
        resources: ['편집자', '컬러리스트', '사운드 엔지니어'],
        isRemovable: false,
        reasoning: '최종 완성도를 결정하는 핵심 단계입니다. 업계에서는 편집비가 전체 제작비의 30-40%를 차지합니다.'
      });

      // 요소별 추가 항목들
      if (data.elements) {
        let itemNumber = 4;
        Object.entries(data.elements).forEach(([elementName, config]: [string, any]) => {
          if (config.enabled) {
            if (elementName === '성우·더빙' && config.selectedOption !== undefined) {
              const costs = [200000, 500000, 1500000];
              const options = ['기본 성우', '전문 성우', '유명 성우'];
              breakdown.push({
                id: `voice-${config.selectedOption}`,
                name: `${itemNumber.toString().padStart(2, '0')}. 성우·더빙 (${options[config.selectedOption]})`,
                impact: costs[config.selectedOption],
                description: `${options[config.selectedOption]} 음성 녹음 및 편집`,
                category: '🎤 음성작업',
                days: 1,
                people: config.selectedOption === 2 ? 3 : 2,
                technologies: ['녹음장비', '사운드 부스', '오디오 편집 S/W'],
                resources: config.selectedOption === 2 ? ['성우', '사운드 엔지니어', '매니저'] : ['성우', '사운드 엔지니어'],
                isRemovable: true,
                reasoning: config.selectedOption === 0 ? 
                  '기본 성우는 업계 최저가 수준이지만 품질 보장이 어렵습니다.' :
                  config.selectedOption === 1 ?
                  '전문 성우는 안정적 품질과 적정 비용의 균형점입니다.' :
                  '유명 성우는 브랜드 가치 상승 효과가 있지만 고비용입니다.'
              });
              itemNumber++;
            }

            if (elementName === '자막·텍스트' && config.selectedOption !== undefined) {
              const costs = [80000, 250000, 500000];
              const options = ['기본 자막', '디자인 자막', '애니메이션 자막'];
              breakdown.push({
                id: `subtitle-${config.selectedOption}`,
                name: `${itemNumber.toString().padStart(2, '0')}. 자막·텍스트 (${options[config.selectedOption]})`,
                impact: costs[config.selectedOption],
                description: `${options[config.selectedOption]} 제작 및 적용`,
                category: '📝 자막작업',
                days: config.selectedOption === 2 ? 2 : 1,
                people: 1,
                technologies: config.selectedOption === 2 ? ['After Effects', '타이포그래피 툴'] : ['Premiere Pro', '자막 편집툴'],
                resources: config.selectedOption === 2 ? ['모션그래퍼', '타이포그래퍼'] : ['편집자'],
                isRemovable: true,
                reasoning: config.selectedOption === 0 ? 
                  '기본 자막은 최소 비용이지만 가독성과 미관이 떨어질 수 있습니다.' :
                  config.selectedOption === 1 ?
                  '디자인 자막은 브랜드 아이덴티티를 반영하여 전문성을 높입니다.' :
                  '애니메이션 자막은 고급스럽지만 제작 시간과 비용이 많이 듭니다.'
              });
              itemNumber++;
            }

            if (elementName === '음악·사운드' && config.selectedOption !== undefined) {
              const costs = [150000, 500000, 2000000];
              const options = ['기본 음향', '맞춤 음향', '오리지널 작곡'];
              breakdown.push({
                id: `music-${config.selectedOption}`,
                name: `${itemNumber.toString().padStart(2, '0')}. 음악·사운드 (${options[config.selectedOption]})`,
                impact: costs[config.selectedOption],
                description: `${options[config.selectedOption]} 제작 및 믹싱`,
                category: '🎵 음향작업',
                days: config.selectedOption === 2 ? 5 : 2,
                people: config.selectedOption === 2 ? 3 : 1,
                technologies: config.selectedOption === 2 ? ['DAW', '악기', '스튜디오'] : ['음향 편집 S/W'],
                resources: config.selectedOption === 2 ? ['작곡가', '편곡자', '믹싱 엔지니어'] : ['사운드 디자이너'],
                isRemovable: true,
                reasoning: config.selectedOption === 0 ? 
                  '저작권 프리 음원은 경제적이지만 브랜드 차별화가 어렵습니다.' :
                  config.selectedOption === 1 ?
                  '맞춤 음향은 브랜드에 최적화되어 효과가 높습니다.' :
                  '오리지널 작곡은 독창성과 저작권 보장하지만 고비용입니다.'
              });
              itemNumber++;
            }
          }
        });
      }

      // 제거된 항목들 필터링
      const filteredBreakdown = breakdown.filter(item => !removedItems.includes(item.id));
      
      // 총 비용 계산
      const totalCost = filteredBreakdown.reduce((sum, item) => sum + item.impact, 0);
      const totalDays = filteredBreakdown.reduce((sum, item) => sum + item.days, 0);

      const finalEstimate = {
        low: Math.floor(totalCost * 0.75),
        mid: Math.floor(totalCost),
        high: Math.floor(totalCost * 1.4),
        breakdown: filteredBreakdown
      };

      // 제작 일정 재계산
      const phases = [
        { 
          name: '기획 및 사전 제작', 
          days: Math.ceil(totalDays * 0.25),
          description: '컨셉 개발, 스토리보드, 사전 준비',
          tasks: ['기획회의', '스토리보드 작성', '촬영 계획', '리소스 준비']
        },
        { 
          name: '촬영 또는 주요 제작', 
          days: Math.ceil(totalDays * 0.35),
          description: '실제 촬영, 소스 제작, 핵심 작업',
          tasks: ['현장 촬영', '음성 녹음', '1차 편집', '중간 검수']
        },
        { 
          name: '편집 및 후반작업', 
          days: Math.ceil(totalDays * 0.3),
          description: '영상 편집, 이펙트, 사운드 작업',
          tasks: ['세부 편집', '컬러보정', '사운드 믹싱', '이펙트 적용']
        },
        { 
          name: '수정 및 최종 완성', 
          days: Math.ceil(totalDays * 0.1),
          description: '피드백 반영, 최종 검수, 납품 준비',
          tasks: ['클라이언트 피드백', '수정 작업', '최종 검수', '포맷 변환']
        }
      ];

      const finalTimeline = {
        total: Math.ceil(totalDays),
        phases: phases
      };

      setEstimate(finalEstimate);
      setTimeline(finalTimeline);
      
    } catch (error) {
      console.error('견적 계산 오류:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  // 항목 제거 기능
  const handleRemoveItem = (itemId: string) => {
    const updatedRemovedItems = [...removedItems, itemId];
    setRemovedItems(updatedRemovedItems);
    calculateDetailedEstimate();
  };

  // 항목 복원 기능
  const handleRestoreItem = (itemId: string) => {
    const updatedRemovedItems = removedItems.filter(id => id !== itemId);
    setRemovedItems(updatedRemovedItems);
    calculateDetailedEstimate();
  };

  // 🚀 NEW: PDF 다운로드 기능 구현
  const handleDownloadPDF = () => {
    // 견적서 내용을 위한 HTML 생성
    const estimateDate = new Date().toLocaleDateString('ko-KR');
    const companyName = '영상제작 전문업체';
    
    let htmlContent = `
      <html>
        <head>
          <title>영상제작 견적서 - ${estimateDate}</title>
          <meta charset="utf-8">
          <style>
            body { 
              font-family: 'Malgun Gothic', '맑은 고딕', Arial, sans-serif; 
              margin: 20px; 
              line-height: 1.6;
              color: #333;
            }
            .header { 
              text-align: center; 
              margin-bottom: 40px; 
              border-bottom: 3px solid #2563eb;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #2563eb;
              font-size: 28px;
              margin-bottom: 10px;
            }
            .header .date {
              color: #666;
              font-size: 14px;
            }
            .company-info {
              margin-bottom: 30px;
              padding: 15px;
              background-color: #f8fafc;
              border-left: 4px solid #2563eb;
            }
            .estimate-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 30px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .estimate-table th { 
              background-color: #2563eb; 
              color: white;
              padding: 12px 8px; 
              text-align: center;
              font-weight: bold;
              font-size: 13px;
            }
            .estimate-table td { 
              border: 1px solid #e5e7eb; 
              padding: 10px 8px; 
              text-align: left;
              font-size: 12px;
            }
            .category-row {
              background-color: #f1f5f9;
              font-weight: bold;
              color: #334155;
            }
            .item-row:hover {
              background-color: #f8fafc;
            }
            .total-row { 
              font-weight: bold; 
              background-color: #eff6ff;
              border-top: 2px solid #2563eb;
            }
            .amount {
              text-align: right;
              font-weight: bold;
              color: #2563eb;
            }
            .summary-section {
              margin-top: 30px;
              padding: 20px;
              background-color: #f8fafc;
              border-radius: 8px;
            }
            .price-range {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
            }
            .price-box {
              text-align: center;
              padding: 15px;
              border-radius: 8px;
              flex: 1;
              margin: 0 10px;
            }
            .price-low { background-color: #ecfdf5; border: 2px solid #10b981; }
            .price-mid { background-color: #eff6ff; border: 2px solid #2563eb; }
            .price-high { background-color: #faf5ff; border: 2px solid #8b5cf6; }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
            }
            .reasoning {
              font-size: 11px;
              color: #6b7280;
              font-style: italic;
              margin-top: 5px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📋 영상제작 견적서</h1>
            <div class="date">견적 발행일: ${estimateDate}</div>
          </div>
          
          <div class="company-info">
            <h3>견적 정보</h3>
            <p><strong>프로젝트 목적:</strong> ${data?.purposes?.join(', ') || '영상 제작'}</p>
            <p><strong>세부 용도:</strong> ${data?.details?.join(', ') || '상세 용도 미지정'}</p>
            <p><strong>예상 일정:</strong> ${timeline.total}일 (작업일 기준)</p>
          </div>
    `;

    // 견적 테이블 생성
    htmlContent += `
      <table class="estimate-table">
        <thead>
          <tr>
            <th width="8%">연번</th>
            <th width="25%">항목명</th>
            <th width="30%">상세 내용</th>
            <th width="8%">일수</th>
            <th width="8%">인력</th>
            <th width="21%">금액</th>
          </tr>
        </thead>
        <tbody>
    `;

    // 카테고리별 그룹화된 항목들 추가
    const groupedBreakdown = estimate.breakdown.reduce((groups, item) => {
      const category = item.category || '기타';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
      return groups;
    }, {} as { [key: string]: EstimateBreakdown[] });

    Object.entries(groupedBreakdown).forEach(([category, items]) => {
      htmlContent += `
        <tr class="category-row">
          <td colspan="6">${category}</td>
        </tr>
      `;
      
      items.forEach((item) => {
        htmlContent += `
          <tr class="item-row">
            <td style="text-align: center;">${item.name.split('.')[0]}</td>
            <td><strong>${item.name.split('. ')[1] || item.name}</strong></td>
            <td>
              ${item.description}
              <div class="reasoning">${item.reasoning || ''}</div>
            </td>
            <td style="text-align: center;">${item.days}일</td>
            <td style="text-align: center;">${item.people}명</td>
            <td class="amount">${item.impact.toLocaleString()}원</td>
          </tr>
        `;
      });
    });

    htmlContent += `
          <tr class="total-row">
            <td colspan="5" style="text-align: center;">총 합계 (표준 견적)</td>
            <td class="amount" style="font-size: 16px;">${estimate.mid.toLocaleString()}원</td>
          </tr>
        </tbody>
      </table>
    `;

    // 가격 범위 섹션
    htmlContent += `
      <div class="summary-section">
        <h3>💰 견적 범위</h3>
        <div class="price-range">
          <div class="price-box price-low">
            <div style="color: #10b981; font-weight: bold;">최소 견적</div>
            <div style="font-size: 18px; font-weight: bold; color: #10b981;">${estimate.low.toLocaleString()}원</div>
            <div style="font-size: 12px; color: #6b7280;">기본 옵션 기준</div>
          </div>
          <div class="price-box price-mid">
            <div style="color: #2563eb; font-weight: bold;">표준 견적 (권장)</div>
            <div style="font-size: 20px; font-weight: bold; color: #2563eb;">${estimate.mid.toLocaleString()}원</div>
            <div style="font-size: 12px; color: #6b7280;">권장 품질 기준</div>
          </div>
          <div class="price-box price-high">
            <div style="color: #8b5cf6; font-weight: bold;">최대 견적</div>
            <div style="font-size: 18px; font-weight: bold; color: #8b5cf6;">${estimate.high.toLocaleString()}원</div>
            <div style="font-size: 12px; color: #6b7280;">최고급 옵션 기준</div>
          </div>
        </div>
        
        <h3>📅 예상 제작 일정</h3>
        <ul>
    `;

    timeline.phases.forEach((phase, index) => {
      htmlContent += `<li><strong>${phase.name}</strong>: ${phase.days}일 - ${phase.description}</li>`;
    });

    htmlContent += `
        </ul>
      </div>
      
      <div class="footer">
        <p>본 견적서는 참고용이며, 최종 견적은 상담 후 확정됩니다.</p>
        <p>견적 유효기간: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR')}까지</p>
        <p>문의: contact@video-production.com | 010-1234-5678</p>
      </div>
    </body>
    </html>
    `;

    // 새 창에서 인쇄 다이얼로그 열기
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // 페이지 로드 완료 후 인쇄 다이얼로그 표시
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 500);
      };
    } else {
      alert('팝업이 차단되었습니다. 팝업 허용 후 다시 시도해주세요.');
    }
  };

  const handleDownloadExcel = () => {
    // Excel 다운로드 시뮬레이션
    const csvContent = [
      ['연번', '항목명', '카테고리', '금액', '소요일수', '투입인력', '사용기술', '설명', '비용 산정 근거'],
      ...estimate.breakdown.map(item => [
        item.name.split('.')[0] || '',
        item.name.split('. ')[1] || item.name,
        item.category,
        item.impact.toLocaleString(),
        item.days,
        item.people,
        item.technologies?.join(', ') || '',
        item.description,
        item.reasoning || ''
      ]),
      ['', '', '', '', '', '', '', '', ''],
      ['총계', '최소 견적', '', estimate.low.toLocaleString(), '', '', '', '', '기본 옵션 기준'],
      ['총계', '표준 견적', '', estimate.mid.toLocaleString(), '', '', '', '', '권장 품질 기준'],
      ['총계', '최대 견적', '', estimate.high.toLocaleString(), '', '', '', '', '최고급 옵션 기준']
    ];

    const csvString = csvContent.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');

    const blob = new Blob(['\ufeff' + csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `영상제작_견적서_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  useEffect(() => {
    if (data.elements && Object.keys(data.elements).length > 0) {
      calculateDetailedEstimate();
    }
  }, [removedItems]);

  const handleNext = () => {
    onUpdate({
      estimate,
      timeline,
      step7Notes: specialNotes,
      removedItems
    });
    onNext();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // 카테고리별 그룹화
  const groupedBreakdown = estimate.breakdown.reduce((groups, item) => {
    const category = item.category || '기타';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {} as { [key: string]: EstimateBreakdown[] });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">견적 및 일정을 확인해주세요</h2>
        <p className="text-gray-600 mb-6">
          선택하신 옵션을 바탕으로 예상 견적과 제작 일정을 확인하실 수 있습니다. 불필요한 항목은 제거할 수 있습니다.
        </p>
      </div>

      {/* 견적 계산 섹션 */}
      <div id="estimate-content" className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">💰 상세 견적서</h3>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadPDF}
              className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              <i className="ri-file-pdf-line mr-1"></i>
              PDF 다운로드
            </button>
            <button
              onClick={handleDownloadExcel}
              className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              <i className="ri-file-excel-line mr-1"></i>
              Excel 다운로드
            </button>
            <button
              onClick={calculateDetailedEstimate}
              disabled={isCalculating}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                isCalculating
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isCalculating ? (
                <>
                  <div className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  재계산 중...
                </>
              ) : (
                <>
                  <i className="ri-calculator-line mr-2"></i>
                  재계산
                </>
              )}
            </button>
          </div>
        </div>

        {isCalculating ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 h-6 rounded mb-2"></div>
                <div className="bg-gray-300 h-4 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : estimate.mid > 0 ? (
          <div className="space-y-6">
            {/* 🚀 NEW: 세금계산서 스타일 견적 테이블 */}
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="bg-blue-600 px-4 py-3">
                <h4 className="text-white font-bold text-center">영상 제작 견적서</h4>
                <p className="text-blue-100 text-sm text-center mt-1">
                  {new Date().toLocaleDateString('ko-KR')} 기준
                </p>
              </div>
              
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">연번</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">항목명</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">단가</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">일수</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">인력</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b">금액</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 border-b">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(groupedBreakdown).map(([category, items]) => (
                    <React.Fragment key={category}>
                      <tr className="bg-gray-50">
                        <td colSpan={7} className="px-4 py-2 font-medium text-gray-800 border-b">
                          {category}
                        </td>
                      </tr>
                      {items.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 border-b text-center text-sm font-mono">
                            {item.name.includes('.') ? item.name.split('.')[0] : '•'}
                          </td>
                          <td className="px-4 py-3 border-b">
                            <div className="font-medium text-gray-900">
                              {item.name.includes('.') ? item.name.split('. ')[1] : item.name}
                            </div>
                            <div className="text-sm text-gray-600">{item.description}</div>
                            {item.technologies && (
                              <div className="text-xs text-blue-600 mt-1">
                                🔧 {item.technologies.join(', ')}
                              </div>
                            )}
                            {item.reasoning && (
                              <div className="text-xs text-orange-600 mt-1 italic">
                                💡 {item.reasoning}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 border-b text-sm text-gray-600">
                            {formatCurrency(item.impact / item.days)}
                          </td>
                          <td className="px-4 py-3 border-b text-sm text-gray-600 text-center">
                            {item.days}일
                          </td>
                          <td className="px-4 py-3 border-b text-sm text-gray-600 text-center">
                            {item.people}명
                          </td>
                          <td className="px-4 py-3 border-b text-right font-medium">
                            {formatCurrency(item.impact)}
                          </td>
                          <td className="px-4 py-3 border-b text-center">
                            {item.isRemovable ? (
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 transition-colors whitespace-nowrap cursor-pointer"
                                title="항목 제거"
                              >
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            ) : (
                              <span className="text-xs text-gray-400">필수</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                  
                  <tr className="bg-blue-50 border-t-2 border-blue-200">
                    <td className="px-4 py-4 font-bold text-blue-800" colSpan={5}>
                      총 합계 (표준 견적)
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-blue-800 text-lg">
                      {formatCurrency(estimate.mid)}
                    </td>
                    <td className="px-4 py-4"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 제거된 항목들 복원 */}
            {removedItems.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-3">🗑️ 제거된 항목들</h4>
                <div className="space-y-2">
                  {estimate.breakdown.filter(item => removedItems.includes(item.id)).map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded border">
                      <div>
                        <span className="font-medium text-gray-700">{item.name}</span>
                        <span className="ml-2 text-sm text-gray-500">({formatCurrency(item.impact)})</span>
                      </div>
                      <button
                        onClick={() => handleRestoreItem(item.id)}
                        className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <i className="ri-add-line mr-1"></i>
                        복원
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 견적 범위 표시 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-sm text-green-600 font-medium mb-1">최소 견적</div>
                <div className="text-2xl font-bold text-green-700">{formatCurrency(estimate.low)}</div>
                <div className="text-xs text-green-600 mt-1">기본 옵션 기준</div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
                <div className="text-sm text-blue-600 font-medium mb-1">표준 견적 (권장)</div>
                <div className="text-3xl font-bold text-blue-700">{formatCurrency(estimate.mid)}</div>
                <div className="text-xs text-blue-600 mt-1">권장 품질 기준</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="text-sm text-purple-600 font-medium mb-1">최대 견적</div>
                <div className="text-2xl font-bold text-purple-700">{formatCurrency(estimate.high)}</div>
                <div className="text-xs text-purple-600 mt-1">최고급 옵션 기준</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <i className="ri-calculator-line text-gray-400 text-3xl mb-3"></i>
            <p className="text-gray-600">견적 계산을 위해 위 버튼을 클릭해주세요.</p>
          </div>
        )}
      </div>

      {/* 상세 제작 일정 섹션 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 예상 제작 일정</h3>
        
        {timeline.total > 0 ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-green-800">총 제작 기간</div>
                  <div className="text-sm text-green-600">작업일 기준 (주말 제외)</div>
                </div>
                <div className="text-3xl font-bold text-green-700">
                  {timeline.total}일
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">단계별 세부 일정</h4>
              <div className="space-y-4">
                {timeline.phases.map((phase, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{phase.name}</div>
                          <div className="text-sm text-gray-600">{phase.description}</div>
                        </div>
                      </div>
                      <div className="text-blue-600 font-bold text-lg">
                        {phase.days}일
                      </div>
                    </div>
                    
                    {phase.tasks && (
                      <div className="ml-11">
                        <div className="text-xs text-gray-500 mb-1">세부 작업:</div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {phase.tasks.map((task, taskIndex) => (
                            <div key={taskIndex} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {task}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <i className="ri-calendar-line text-gray-400 text-3xl mb-3"></i>
            <p className="text-gray-600">견적 계산이 완료되면 일정도 함께 표시됩니다.</p>
          </div>
        )}
      </div>

      {/* 특이사항 입력란 */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="font-medium text-orange-800 mb-3">
          <i className="ri-sticky-note-line mr-2"></i>
          견적·일정 관련 특이사항
        </h3>
        <textarea
          value={specialNotes}
          onChange={(e) => setSpecialNotes(e.target.value)}
          placeholder="예: 예산 조정이 필요해요 / 급한 일정이에요 / 분할 결제 희망 / 특별한 요구사항 등"
          className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none bg-white"
          rows={4}
        />
        <p className="text-xs text-orange-700 mt-2">
          💡 예산이나 일정에 대한 특별한 요구사항이 있으시면 자유롭게 작성해주세요!
        </p>
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onPrev}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium whitespace-nowrap cursor-pointer hover:bg-gray-200 transition-colors"
        >
          이전으로
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium whitespace-nowrap cursor-pointer hover:bg-blue-700 transition-colors"
        >
          다음으로 (문의하기)
        </button>
      </div>
    </div>
  );
}
