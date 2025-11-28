import React, { useState } from 'react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ onSubmit, isLoading = false }) => {
  const [prompt, setPrompt] = useState('');

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

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          PromptPlay
        </h1>
        <p className="text-lg text-gray-600">
          모호한 프롬프트를 더 나은 프롬프트로 개선해보세요
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            개선하고 싶은 프롬프트를 입력해주세요
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="예: 좋은 마케팅 전략을 만들어줘"
            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '분석 중...' : '프롬프트 분석하기'}
          </button>
        </div>
      </form>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">💡 예시 프롬프트:</h3>
        <div className="space-y-2">
          {[
            '일본 오사카 3박 4일 여행 계획 짜줘',
            '몸이 좋아지고 싶어. 헬스 루틴 짜줘',
            '취업 준비 어떻게 해야되나요',
            '사업해서 돈 많이 벌고싶어요. 사업 아이디어좀 주세요',
            '좋아하는 사람이 생겼어요. 어떻게 하면 더 가까워질 수 있을까요?',
            '군적금을 효율적으로 굴리고 싶은데, 코인이나 미국주식에 투자하고 싶어요. 투자 방법에 대한 조언이 필요해요'
          ].map((example, index) => (
            <button
              key={index}
              onClick={() => setPrompt(example)}
              className="block w-full text-left p-2 text-sm text-gray-600 hover:bg-white hover:text-gray-900 rounded transition-colors"
              disabled={isLoading}
            >
              "{example}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromptInput;