import React, { useState } from 'react';
import type { Question } from '../types';

interface QuestionSectionProps {
  questions: Question[];
  onSubmit: (answers: { questionId: string; content: string; }[]) => void;
  onBack: () => void;
  isLoading?: boolean;
}

const QuestionSection: React.FC<QuestionSectionProps> = ({ 
  questions, 
  onSubmit, 
  onBack, 
  isLoading = false 
}) => {
  const [answers, setAnswers] = useState<{ [questionId: string]: string }>({});

  const handleAnswerChange = (questionId: string, content: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: content
    }));
  };

  const handleExampleClick = (questionId: string, example: string) => {
    handleAnswerChange(questionId, example);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const answersArray = Object.entries(answers)
      .filter(([_, content]) => content.trim() !== '')
      .map(([questionId, content]) => ({ questionId, content: content.trim() }));
    
    if (answersArray.length > 0) {
      onSubmit(answersArray);
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      context: '맥락',
      purpose: '목적',
      audience: '대상',
      format: '형식',
      constraints: '제약'
    };
    return labels[category as keyof typeof labels] || '기타';
  };

  const answeredCount = Object.values(answers).filter(answer => answer.trim() !== '').length;

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors"
          disabled={isLoading}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          돌아가기
        </button>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          추가 정보를 알려주세요
        </h2>
        <p className="text-gray-600 mb-6">
          더 정확한 답변을 위해 몇 가지 질문에 답해주세요. 모든 질문에 답할 필요는 없습니다.
        </p>
        
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-medium">진행 상황:</span> {answeredCount}/{questions.length} 질문 답변 완료
            {answeredCount > 0 && <span className="text-gray-500 ml-2">(답변이 있는 질문만으로도 진행 가능합니다)</span>}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((question, index) => (
          <div 
            key={question.id} 
            className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {getCategoryLabel(question.category)}
                  </span>
                  <span className="text-sm text-gray-400">질문 {index + 1}</span>
                </div>
              </div>
              <h3 className="text-base font-semibold text-gray-900 leading-relaxed">
                {question.question}
              </h3>
            </div>

            <textarea
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="답변을 입력해주세요..."
              className="w-full h-24 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 resize-none transition-all text-sm"
              disabled={isLoading}
            />

            {question.examples && question.examples.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-medium text-gray-500 mb-3">예시 답변</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {question.examples.map((example, exampleIndex) => (
                    <button
                      key={exampleIndex}
                      type="button"
                      onClick={() => handleExampleClick(question.id, example)}
                      className="text-left p-3 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-all"
                      disabled={isLoading}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            {answeredCount > 0 
              ? `${answeredCount}개의 답변으로 진행할 수 있습니다.`
              : '최소 1개 이상의 질문에 답변해주세요.'
            }
          </p>
          
          <button
            type="submit"
            disabled={answeredCount === 0 || isLoading}
            className="px-8 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? '응답 생성 중...' : '응답 생성하기'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionSection;