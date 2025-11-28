import React, { useState } from 'react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
}

const categoryExamples = {
  '💼 취업/진로': [
    'IT 개발자로 취업하고 싶어요. 포트폴리오 준비 방법과 면접 준비 팁이 필요해요',
    '대기업 마케팅 직무 면접을 준비하고 있어요. 예상 질문과 답변 전략을 알려주세요',
    '커리어 전환을 고민 중이에요. 현재 직장을 그만두고 새로운 분야로 이직하는 게 좋을까요?',
    '공기업 취업을 준비하고 있어요. 서류전형과 면접 준비 방법을 구체적으로 알려주세요',
  ],
  '💰 투자/재테크': [
    '군적금 2000만원을 효율적으로 굴리고 싶어요. 코인과 미국주식 투자 비중을 어떻게 나눠야 할까요?',
    '30대 직장인입니다. 월급의 20%를 투자하고 싶은데, 초보자도 할 수 있는 투자 방법을 추천해주세요',
    '부동산 투자를 시작하려고 해요. 아파트와 오피스텔 중 어떤 게 더 나을까요?',
    '은퇴 자금을 마련하기 위한 장기 투자 전략을 세우고 싶어요',
  ],
  '✈️ 여행/라이프': [
    '일본 오사카 3박 4일 여행 계획을 짜고 싶어요. 맛집과 관광지 추천 부탁드려요',
    '유럽 배낭여행을 계획 중이에요. 예산 200만원으로 2주일 여행 가능한 국가와 일정을 알려주세요',
    '제주도 혼자 여행 가려고 해요. 렌터카 없이 대중교통으로 다닐 수 있는 코스를 추천해주세요',
    '태국 방콕 여행을 준비하고 있어요. 현지인들이 가는 숨은 맛집과 볼거리를 알려주세요',
  ],
  '💪 건강/운동': [
    '몸이 좋아지고 싶어요. 직장인도 할 수 있는 헬스 루틴과 식단 조절 방법을 알려주세요',
    '다이어트를 시작하려고 해요. 운동 초보자도 꾸준히 할 수 있는 방법이 필요해요',
    '허리 디스크가 있어서 운동이 제한적이에요. 안전하게 할 수 있는 운동을 추천해주세요',
    '근육량을 늘리고 싶어요. 홈트레이닝으로 가능한 운동 루틴과 식단을 알려주세요',
  ],
  '💡 창업/사업': [
    '사업을 시작하고 싶어요. 초기 자본 500만원으로 시작할 수 있는 사업 아이디어를 추천해주세요',
    '온라인 쇼핑몰을 운영하려고 해요. 처음 시작하는 사람을 위한 단계별 가이드가 필요해요',
    '프랜차이즈 창업을 고민 중이에요. 어떤 브랜드를 선택하는 게 좋을까요?',
    '부업으로 시작할 수 있는 온라인 사업 아이디어를 찾고 있어요',
  ],
  '🎓 학습/스킬': [
    '프로그래밍을 처음 배우려고 해요. 어떤 언어부터 시작하는 게 좋을까요?',
    '영어 회화 실력을 늘리고 싶어요. 하루 1시간으로 가능한 학습 방법을 알려주세요',
    '디자인을 배우고 싶어요. UI/UX 디자이너가 되기 위한 로드맵을 만들어주세요',
    '데이터 분석가가 되고 싶어요. 필요한 스킬과 공부 순서를 알려주세요',
  ],
  '❤️ 연애/인간관계': [
    '좋아하는 사람이 생겼어요. 어떻게 하면 더 가까워질 수 있을까요?',
    '이별 후 우울감이 심해요. 마음을 추스르는 방법이 필요해요',
    '소개팅을 준비하고 있어요. 첫 만남에서 좋은 인상을 주는 방법을 알려주세요',
    '동료와의 관계가 어색해요. 직장에서 원만한 인간관계를 유지하는 방법이 필요해요',
  ],
};

const PromptInput: React.FC<PromptInputProps> = ({ onSubmit, isLoading = false }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
    setSelectedCategory(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          PromptPlay
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          질문에 답하고 더 나은 답변을 받아보세요
        </p>
        <p className="text-sm text-gray-500">
          AI가 당신의 질문을 분석하고, 더 구체적인 정보를 요청한 후 상세한 답변을 제공합니다
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            궁금한 것을 자유롭게 물어보세요
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="예: IT 개발자로 취업하고 싶어요. 포트폴리오 준비 방법이 필요해요"
            className="w-full h-32 p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
            disabled={isLoading}
          />
          <p className="text-sm text-gray-500 mt-2">
            Ctrl+Enter 또는 Cmd+Enter로 빠르게 제출할 수 있습니다
          </p>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="px-10 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {isLoading ? '분석 중...' : '질문 시작하기'}
          </button>
        </div>
      </form>

      <div className="mt-10">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          💡 분야별 예시 질문
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
          {Object.keys(categoryExamples).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                selectedCategory === category
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
              }`}
              disabled={isLoading}
            >
              {category}
            </button>
          ))}
        </div>

        {selectedCategory && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <h4 className="text-md font-semibold text-gray-900 mb-4">
              {selectedCategory} 예시 질문
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categoryExamples[selectedCategory as keyof typeof categoryExamples].map(
                (example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(example)}
                    className="text-left p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all text-sm text-gray-700 hover:text-gray-900"
                    disabled={isLoading}
                  >
                    {example}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptInput;