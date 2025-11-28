import React, { useState } from 'react';
import type { ImprovedPrompt as ImprovedPromptType } from '../types';

interface ImprovedPromptProps {
  improvedPrompt: ImprovedPromptType;
  onStartOver: () => void;
}

const ImprovedPrompt: React.FC<ImprovedPromptProps> = ({ improvedPrompt, onStartOver }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  const getTechniqueIcon = (technique: string) => {
    const icons: { [key: string]: string } = {
      '맥락 정보 통합': '🎯',
      '구체적 요구사항 반영': '📝',
      '논리적 구조화': '🧠',
      '실행 가능한 지시사항': '🎭',
      '제약사항 명시': '⚡',
      '출력 형식 지정': '📋'
    };
    return icons[technique] || '✨';
  };

  const getTechniqueColor = (technique: string) => {
    const colors: { [key: string]: string } = {
      '맥락 정보 통합': 'bg-blue-100 text-blue-800',
      '구체적 요구사항 반영': 'bg-green-100 text-green-800',
      '논리적 구조화': 'bg-purple-100 text-purple-800',
      '실행 가능한 지시사항': 'bg-pink-100 text-pink-800',
      '제약사항 명시': 'bg-yellow-100 text-yellow-800',
      '출력 형식 지정': 'bg-indigo-100 text-indigo-800'
    };
    return colors[technique] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-gray-900">
            🎉 프롬프트 개선 완료!
          </h2>
          <button
            onClick={onStartOver}
            className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            새로 시작하기
          </button>
        </div>
        <p className="text-gray-600">
          다음은 분석 결과를 바탕으로 개선된 프롬프트입니다.
        </p>
      </div>

      <div className="space-y-6">
        {/* 원본 프롬프트 */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-gray-900">📝 원본 프롬프트</h3>
            <button
              onClick={() => copyToClipboard(improvedPrompt.originalPrompt, 'original')}
              className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              {copiedField === 'original' ? (
                <>
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  복사됨
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  복사
                </>
              )}
            </button>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">{improvedPrompt.originalPrompt}</p>
        </div>

        {/* 개선된 프롬프트 */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-green-900">✨ 개선된 프롬프트</h3>
            <button
              onClick={() => copyToClipboard(improvedPrompt.improvedPrompt, 'improved')}
              className="flex items-center px-3 py-1 text-sm text-green-700 hover:text-green-900 bg-white border border-green-300 rounded hover:bg-green-50 transition-colors"
            >
              {copiedField === 'improved' ? (
                <>
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  복사됨
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  복사
                </>
              )}
            </button>
          </div>
          <p className="text-green-800 whitespace-pre-wrap font-medium">{improvedPrompt.improvedPrompt}</p>
        </div>

        {/* 개선 사항 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-3">🔧 주요 개선 사항</h3>
          <ul className="space-y-2">
            {improvedPrompt.improvements.map((improvement, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span className="text-blue-800">{improvement}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 적용된 기법 */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-purple-900 mb-3">🛠️ 적용된 개선 기법</h3>
          <div className="flex flex-wrap gap-2">
            {improvedPrompt.appliedTechniques.map((technique, index) => (
              <span
                key={index}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTechniqueColor(technique)}`}
              >
                <span className="mr-1">{getTechniqueIcon(technique)}</span>
                {technique}
              </span>
            ))}
          </div>
        </div>

        {/* 사용 팁 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-yellow-900 mb-3">💡 사용 팁</h3>
          <div className="space-y-2 text-yellow-800">
            <p>• 개선된 프롬프트를 복사하여 ChatGPT, Claude 등에서 사용해보세요.</p>
            <p>• 상황에 따라 일부 내용을 조정하여 사용할 수 있습니다.</p>
            <p>• 결과가 만족스럽지 않다면 더 구체적인 정보를 추가해보세요.</p>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex justify-center pt-4">
          <button
            onClick={onStartOver}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            새로운 프롬프트 개선하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImprovedPrompt;