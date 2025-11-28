import { useState } from 'react';
import type { AppState, ImprovedPrompt as ImprovedPromptType } from './types';
import { analyzePromptAndGenerateQuestions, generateImprovedPrompt } from './api/gemini';
import { 
  detectIntent, 
  getRelevantQuestions
} from './utils/promptAnalysis';

import PromptInput from './components/PromptInput';
import QuestionSection from './components/QuestionSection';
import ImprovedPrompt from './components/ImprovedPrompt';
import { PromptAnalysisLoading, PromptImprovementLoading } from './components/LoadingSpinner';

function App() {
  const [appState, setAppState] = useState<AppState>({
    currentStep: 'input',
    userPrompt: '',
    questions: [],
    answers: [],
    improvedPrompt: null,
    isLoading: false,
    error: null
  });

  // 프롬프트 제출 및 분석
  const handlePromptSubmit = async (prompt: string) => {
    setAppState(prev => ({
      ...prev,
      userPrompt: prompt,
      currentStep: 'processing',
      isLoading: true,
      error: null
    }));

    try {
      let questions;
      
      try {
        // API를 사용한 분석 시도
        const analysis = await analyzePromptAndGenerateQuestions(prompt);
        questions = analysis.suggestedQuestions;
      } catch (apiError) {
        console.warn('API 분석 실패, 로컬 분석으로 대체:', apiError);
        
        // API 실패 시 로컬 분석 사용
        const detectedIntent = detectIntent(prompt);
        questions = getRelevantQuestions(prompt, detectedIntent);
      }

      setAppState(prev => ({
        ...prev,
        questions,
        currentStep: 'questions',
        isLoading: false
      }));
    } catch (error) {
      console.error('프롬프트 분석 실패:', error);
      setAppState(prev => ({
        ...prev,
        error: '프롬프트 분석에 실패했습니다. 다시 시도해주세요.',
        isLoading: false,
        currentStep: 'input'
      }));
    }
  };

  // 질문 답변 제출 및 프롬프트 개선
  const handleAnswersSubmit = async (answers: { questionId: string; content: string; }[]) => {
    setAppState(prev => ({
      ...prev,
      answers,
      currentStep: 'processing',
      isLoading: true,
      error: null
    }));

    const improvedPrompt = await generateImprovedPrompt(
      appState.userPrompt,
      appState.questions,
      answers
    );

    setAppState(prev => ({
      ...prev,
      improvedPrompt,
      currentStep: 'result',
      isLoading: false
    }));
  };


  // 처음부터 다시 시작
  const handleStartOver = () => {
    setAppState({
      currentStep: 'input',
      userPrompt: '',
      questions: [],
      answers: [],
      improvedPrompt: null,
      isLoading: false,
      error: null
    });
  };

  // 이전 단계로 돌아가기
  const handleBack = () => {
    setAppState(prev => ({
      ...prev,
      currentStep: 'input',
      isLoading: false,
      error: null
    }));
  };

  // 에러 표시 컴포넌트
  const ErrorDisplay = ({ error }: { error: string }) => (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold text-red-900 mb-2">오류가 발생했습니다</h2>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={handleStartOver}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          다시 시도하기
        </button>
      </div>
    </div>
  );

  // 렌더링
  return (
    <div className="min-h-screen bg-gray-50">
      {appState.error && <ErrorDisplay error={appState.error} />}
      
      {!appState.error && (
        <>
          {appState.currentStep === 'input' && (
            <PromptInput 
              onSubmit={handlePromptSubmit}
              isLoading={appState.isLoading}
            />
          )}

          {appState.currentStep === 'processing' && appState.userPrompt && !appState.improvedPrompt && appState.answers.length === 0 && (
            <PromptAnalysisLoading />
          )}

          {appState.currentStep === 'questions' && (
            <QuestionSection
              questions={appState.questions}
              onSubmit={handleAnswersSubmit}
              onBack={handleBack}
              isLoading={appState.isLoading}
            />
          )}

          {appState.currentStep === 'processing' && appState.answers.length > 0 && (
            <PromptImprovementLoading />
          )}

          {appState.currentStep === 'result' && appState.improvedPrompt && (
            <ImprovedPrompt
              improvedPrompt={appState.improvedPrompt}
              onStartOver={handleStartOver}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
