import axios from 'axios';
import type { ChatGPTRequest, ChatGPTResponse, Question, ImprovedPrompt, PromptAnalysis, PromptTechnique } from '../types';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_URL = import.meta.env.VITE_OPENAI_API_URL || 'https://api.openai.com/v1';

const chatGPTAPI = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
});

// 기본 ChatGPT API 호출 함수
export const callChatGPT = async (request: ChatGPTRequest): Promise<ChatGPTResponse> => {
  try {
    const response = await chatGPTAPI.post('/chat/completions', request);
    return response.data;
  } catch (error) {
    console.error('ChatGPT API Error:', error);
    throw new Error('ChatGPT API 호출에 실패했습니다.');
  }
};

// 프롬프트 분석 및 질문 생성
export const analyzePromptAndGenerateQuestions = async (userPrompt: string): Promise<PromptAnalysis> => {
  const systemPrompt = `당신은 프롬프트 개선 전문가입니다. 사용자가 입력한 프롬프트를 분석하고, 모호한 부분에 대해 구체적인 질문을 생성해주세요.

다음 기준으로 분석해주세요:
1. 맥락(Context): 프롬프트의 배경이나 상황이 명확한가?
2. 목적(Purpose): 원하는 결과나 목표가 명확한가?
3. 대상(Audience): 타겟 대상이나 사용자가 명확한가?
4. 형식(Format): 원하는 출력 형식이나 구조가 명확한가?
5. 제약사항(Constraints): 제한사항이나 요구사항이 명확한가?

**질문 생성 규칙:**
- 반드시 정확히 10개의 질문을 생성해주세요 (10개 초과 금지)
- 각 카테고리(context, purpose, audience, format, constraints)에서 최소 1개씩은 질문 생성
- 프롬프트가 단순하더라도 개선 여지를 찾아 10개 질문 완성
- 질문의 우선순위를 고려하여 가장 중요한 10개만 선별

**예시 답변 작성 규칙:**
- 각 질문마다 최소 5개 이상의 구체적인 예시 답변 제공
- 예시 답변은 해당 질문에 대한 직접적인 답변이어야 함
- 실제 상황에서 사용자가 입력할 수 있는 구체적이고 상세한 답변 예시
- 다양한 상황과 업계를 포함하여 선택의 폭을 넓힘

**예시 답변 작성 예시:**
질문: "이 프롬프트가 사용될 구체적인 맥락이나 상황은 무엇인가요?"
올바른 예시 답변들:
- "신제품 출시를 위한 마케팅 전략 회의에서 투자자들에게 발표용 자료 준비"
- "중학교 2학년 과학 수업에서 광합성 원리를 설명하는 교육 콘텐츠 제작"
- "회사 내부 직원 대상 새로운 CRM 시스템 사용법 교육 매뉴얼 작성"

응답은 다음 JSON 형식으로 해주세요:
{
  "ambiguousAreas": ["모호한 영역1", "모호한 영역2", "모호한 영역3"],
  "suggestedQuestions": [
    {
      "id": "q1",
      "question": "구체적인 질문 내용",
      "examples": ["해당 질문에 대한 구체적 답변1", "해당 질문에 대한 구체적 답변2", "해당 질문에 대한 구체적 답변3", "해당 질문에 대한 구체적 답변4", "해당 질문에 대한 구체적 답변5", "해당 질문에 대한 구체적 답변6"],
      "category": "context|purpose|audience|format|constraints"
    }
  ],
  "detectedIntent": "감지된 의도",
  "complexity": "simple|medium|complex"
}`;

  const request: ChatGPTRequest = {
    model: 'gpt-5',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `분석할 프롬프트: "${userPrompt}"` }
    ],
    max_completion_tokens: 8000,
  };

  try {
    const response = await callChatGPT(request);
    const content = response.choices[0].message.content;
    
    if (!content || content.trim() === '') {
      console.error('GPT 응답이 비어있습니다:', response);
      throw new Error('GPT 응답이 비어있습니다.');
    }
    
    return JSON.parse(content);
  } catch (error) {
    console.error('프롬프트 분석 실패:', error);
    throw new Error('프롬프트 분석에 실패했습니다.');
  }
};

// 개선된 프롬프트 생성 (로컬 로직)
export const generateImprovedPrompt = async (
  originalPrompt: string,
  questions: Question[],
  answers: { questionId: string; content: string; }[]
): Promise<ImprovedPrompt> => {
  // 프롬프트 구성
  let improved = originalPrompt;

  // 답변이 있는 질문들만 필터링
  const answeredQuestions = answers.filter(answer => answer.content.trim() !== '');

  if (answeredQuestions.length > 0) {
    improved += '\n\n다음 질문과 답변을 참고해주세요:\n';
    
    answeredQuestions.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (question) {
        improved += `\nQ: ${question.question}\nA: ${answer.content}\n`;
      }
    });
  }

  // 고정 마무리 문구 추가
  improved += '\n충분히 관련된 레퍼런스를 최대한 많이 찾아보고 많이 생각하고, 주어진 질문과 답변을 참고하여 처음 입력한 요구사항에 대해서 답변해주세요.';

  // 적용된 개선사항 분석
  const improvements: string[] = [
    '원본 요구사항 명확히 제시',
    '관련 질문과 답변을 구조화하여 포함',
    '충분한 고려를 위한 지시사항 추가'
  ];
  
  const appliedTechniques: PromptTechnique[] = [
    '구체적 요구사항 반영',
    '논리적 구조화'
  ];

  if (answeredQuestions.length > 0) {
    improvements.push(`${answeredQuestions.length}개의 추가 정보 제공`);
    appliedTechniques.push('맥락 정보 통합');
  }

  return {
    id: Date.now().toString(),
    originalPrompt,
    improvedPrompt: improved.trim(),
    improvements,
    appliedTechniques,
    timestamp: new Date(),
  };
};