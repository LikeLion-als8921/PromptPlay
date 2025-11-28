// 프롬프트 관련 타입
export interface UserPrompt {
  id: string;
  content: string;
  timestamp: Date;
}

// 질문 및 답변 타입
export interface Question {
  id: string;
  question: string;
  examples?: string[];
  category: QuestionCategory;
}

export interface Answer {
  questionId: string;
  content: string;
}

export type QuestionCategory = 
  | 'context'
  | 'purpose' 
  | 'audience'
  | 'format'
  | 'constraints'
  | 'examples';

// 개선된 프롬프트 타입
export interface ImprovedPrompt {
  id: string;
  originalPrompt: string;
  improvedPrompt: string;
  improvements: string[];
  appliedTechniques: PromptTechnique[];
  timestamp: Date;
}

export type PromptTechnique =
  | 'TCREI'
  | 'Few-shot'
  | 'Chain-of-thought'
  | 'Role-playing'
  | 'Constraint-setting'
  | 'Format-specification'
  | '맥락 정보 통합'
  | '구체적 요구사항 반영'
  | '논리적 구조화'
  | '실행 가능한 지시사항'
  | '제약사항 명시'
  | '출력 형식 지정';

// API 응답 타입
export interface ChatGPTResponse {
  choices: {
    message: {
      content: string;
      role: 'assistant' | 'user' | 'system';
    };
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ChatGPTRequest {
  model: string;
  messages: {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }[];
  max_tokens?: number;
  max_completion_tokens?: number;
  temperature?: number;
}

// 앱 상태 타입
export interface AppState {
  currentStep: AppStep;
  userPrompt: string;
  questions: Question[];
  answers: Answer[];
  improvedPrompt: ImprovedPrompt | null;
  isLoading: boolean;
  error: string | null;
}

export type AppStep = 
  | 'input'
  | 'questions'
  | 'processing'
  | 'result';

// 프롬프트 분석 결과 타입
export interface PromptAnalysis {
  ambiguousAreas: string[];
  suggestedQuestions: Question[];
  detectedIntent: string;
  complexity: 'simple' | 'medium' | 'complex';
}