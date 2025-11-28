import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = '처리 중입니다...', 
  size = 'medium' 
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const containerClasses = {
    small: 'p-4',
    medium: 'p-8',
    large: 'p-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${containerClasses[size]}`}>
      <div className={`${sizeClasses[size]} mb-4`}>
        <div className="relative">
          {/* 외부 링 */}
          <div className={`${sizeClasses[size]} border-4 border-gray-200 rounded-full`}></div>
          {/* 회전하는 링 */}
          <div className={`absolute top-0 left-0 ${sizeClasses[size]} border-4 border-blue-600 border-t-transparent rounded-full animate-spin`}></div>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-gray-600 font-medium mb-2">{message}</p>
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

// 전체 화면 로딩 컴포넌트
export const FullScreenLoading: React.FC<LoadingSpinnerProps> = ({ message, size = 'large' }) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <LoadingSpinner message={message} size={size} />
      </div>
    </div>
  );
};

// 프롬프트 분석용 특별 로딩 컴포넌트
export const PromptAnalysisLoading: React.FC = () => {
  const steps = [
    '프롬프트 분석 중...',
    '모호한 부분 감지 중...',
    '질문 생성 중...',
    '거의 완료되었습니다...'
  ];

  const [currentStep, setCurrentStep] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto mb-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute top-2 left-2 w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin animate-reverse" style={{ animationDuration: '1.5s' }}></div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">프롬프트 분석 중</h2>
          <p className="text-lg text-gray-600 mb-6">{steps[currentStep]}</p>
          
          {/* 진행 바 */}
          <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="font-medium text-blue-900 mb-2">🔍 분석 과정</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• 프롬프트의 모호한 부분 감지</p>
            <p>• 맥락과 의도 파악</p>
            <p>• 맞춤형 질문 생성</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 프롬프트 개선용 로딩 컴포넌트
export const PromptImprovementLoading: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto mb-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">프롬프트 개선 중</h2>
          <p className="text-lg text-gray-600 mb-6">
            답변을 바탕으로 더 나은 프롬프트를 생성하고 있습니다...
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="font-medium text-green-900 mb-2">⚡ 개선 중인 요소들</h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-green-800">
            <div className="flex items-center">
              <span className="mr-2">🎯</span>
              맥락 정보 통합
            </div>
            <div className="flex items-center">
              <span className="mr-2">📝</span>
              구체적 요구사항 반영
            </div>
            <div className="flex items-center">
              <span className="mr-2">🧠</span>
              논리적 구조화
            </div>
            <div className="flex items-center">
              <span className="mr-2">🎭</span>
              실행 가능한 지시사항
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;