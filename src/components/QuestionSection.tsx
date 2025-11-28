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

  const getCategoryIcon = (category: string) => {
    const icons = {
      context: '🌍',
      purpose: '🎯',
      audience: '👥',
      format: '📋',
      constraints: '⚠️'
    };
    return icons[category as keyof typeof icons] || '❓';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      context: 'bg-blue-50 border-blue-200',
      purpose: 'bg-green-50 border-green-200',
      audience: 'bg-purple-50 border-purple-200',
      format: 'bg-yellow-50 border-yellow-200',
      constraints: 'bg-red-50 border-red-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-50 border-gray-200';
  };

  const answeredCount = Object.values(answers).filter(answer => answer.trim() !== '').length;

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          disabled={isLoading}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          돌아가기
        </button>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          프롬프트 개선을 위한 질문
        </h2>
        <p className="text-gray-600 mb-4">
          더 나은 프롬프트를 만들기 위해 몇 가지 질문에 답해주세요. 
          모든 질문에 답할 필요는 없습니다.
        </p>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>진행 상황:</strong> {answeredCount}/{questions.length} 질문 답변 완료
            {answeredCount > 0 && ' (답변이 있는 질문만으로도 개선 가능합니다)'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((question, index) => (
          <div 
            key={question.id} 
            className={`p-6 border rounded-lg ${getCategoryColor(question.category)}`}
          >
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                <span className="text-xl mr-2">{getCategoryIcon(question.category)}</span>
                질문 {index + 1}
              </h3>
              <p className="text-gray-700">{question.question}</p>
            </div>

            <textarea
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="답변을 입력해주세요..."
              className="w-full h-20 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={isLoading}
            />

            {question.examples && question.examples.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">💡 예시 답변:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {question.examples.map((example, exampleIndex) => (
                    <button
                      key={exampleIndex}
                      type="button"
                      onClick={() => handleExampleClick(question.id, example)}
                      className="text-left p-2 text-sm text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50 hover:text-gray-900 transition-colors"
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

        <div className="flex justify-between items-center pt-6">
          <p className="text-sm text-gray-500">
            {answeredCount > 0 
              ? `${answeredCount}개의 답변으로 프롬프트를 개선할 수 있습니다.`
              : '최소 1개 이상의 질문에 답변해주세요.'
            }
          </p>
          
          <button
            type="submit"
            disabled={answeredCount === 0 || isLoading}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '응답 생성 중...' : '응답 생성하기'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionSection;