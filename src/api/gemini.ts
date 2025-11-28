import { GoogleGenAI } from "@google/genai";
import type { Question, ImprovedPrompt, PromptAnalysis } from "../types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI({
  apiKey: API_KEY,
});

// 프롬프트 분석 및 질문 생성 (5개 질문, 각 질문마다 6개 예시 답변)
export const analyzePromptAndGenerateQuestions = async (
  userPrompt: string
): Promise<PromptAnalysis> => {
  const systemPrompt = `당신은 프롬프트 개선 전문가입니다. 사용자가 입력한 프롬프트를 분석하고, 모호한 부분에 대해 구체적인 질문을 생성해주세요.

다음 기준으로 분석해주세요:
1. 맥락(Context): 프롬프트의 배경이나 상황이 명확한가?
2. 목적(Purpose): 원하는 결과나 목표가 명확한가?
3. 대상(Audience): 타겟 대상이나 사용자가 명확한가?
4. 형식(Format): 원하는 출력 형식이나 구조가 명확한가?
5. 제약사항(Constraints): 제한사항이나 요구사항이 명확한가?

**질문 생성 규칙:**
- 반드시 정확히 5개의 질문을 생성해주세요 (5개 초과 금지)
- 각 카테고리(context, purpose, audience, format, constraints)에서 최소 1개씩은 질문 생성
- 프롬프트가 단순하더라도 개선 여지를 찾아 5개 질문 완성
- 질문의 우선순위를 고려하여 가장 중요한 5개만 선별

**예시 답변 작성 규칙:**
- 각 질문마다 정확히 6개의 구체적인 예시 답변 제공
- 예시 답변은 해당 질문에 대한 직접적인 답변이어야 함
- 실제 상황에서 사용자가 입력할 수 있는 구체적이고 상세한 답변 예시
- 다양한 상황과 업계를 포함하여 선택의 폭을 넓힘

**예시 답변 작성 예시:**
질문: "이 프롬프트가 사용될 구체적인 맥락이나 상황은 무엇인가요?"
올바른 예시 답변들:
- "신제품 출시를 위한 마케팅 전략 회의에서 투자자들에게 발표용 자료 준비"
- "중학교 2학년 과학 수업에서 광합성 원리를 설명하는 교육 콘텐츠 제작"
- "회사 내부 직원 대상 새로운 CRM 시스템 사용법 교육 매뉴얼 작성"
- "온라인 쇼핑몰 고객 대상 제품 소개 이메일 마케팅 캠페인 기획"
- "대학생 대상 취업 준비 세미나에서 자기소개서 작성 가이드 제공"
- "소상공인 대상 디지털 마케팅 기초 교육 프로그램 개발"

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

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: `${systemPrompt}\n\n분석할 프롬프트: "${userPrompt}"`,
    });

    const content = response.text;

    if (!content || content.trim() === "") {
      console.error("Gemini 응답이 비어있습니다:", response);
      throw new Error("Gemini 응답이 비어있습니다.");
    }

    // JSON 파싱 시도 (마크다운 코드 블록 제거)
    let jsonContent = content.trim();
    if (jsonContent.startsWith("```")) {
      jsonContent = jsonContent
        .replace(/^```(?:json)?\n?/gm, "")
        .replace(/\n?```$/gm, "");
    }

    return JSON.parse(jsonContent);
  } catch (error) {
    console.error("프롬프트 분석 실패:", error);
    throw new Error("프롬프트 분석에 실패했습니다.");
  }
};

// 질문-답변을 바탕으로 실제 내용 생성 (Gemini API 사용)
export const generateImprovedPrompt = async (
  originalPrompt: string,
  questions: Question[],
  answers: { questionId: string; content: string }[]
): Promise<ImprovedPrompt> => {
  // 답변이 있는 질문들만 필터링
  const answeredQuestions = answers.filter(
    (answer) => answer.content.trim() !== ""
  );

  // 프롬프트 구성
  let promptContext = `사용자의 요청: "${originalPrompt}"\n\n`;

  if (answeredQuestions.length > 0) {
    promptContext += "다음은 사용자가 제공한 추가 정보입니다:\n\n";

    answeredQuestions.forEach((answer) => {
      const question = questions.find((q) => q.id === answer.questionId);
      if (question) {
        promptContext += `Q: ${question.question}\nA: ${answer.content}\n\n`;
      }
    });
  }

  promptContext += `위의 사용자 요청과 제공된 추가 정보를 바탕으로 충분히 관련된 레퍼런스를 최대한 많이 찾아보고 많이 생각한 후, 사용자의 요청에 대해서 자세하고 구체적인 답변을 제공해주세요. 답변은 상세하고 실용적이어야 하며, 제공된 모든 정보를 종합적으로 고려하여 작성해주세요.

**중요 규칙:**
1. 응답은 반드시 마크다운(Markdown) 형식으로 작성해주세요.
   - 제목은 #, ##, ### 등을 사용하여 계층적으로 구성
   - 목록은 - 또는 1. 을 사용
   - 강조는 **굵게**, *기울임* 사용
   - 코드 블록은 \`\`\`언어 형식 사용
   - 링크는 [텍스트](URL) 형식 사용
   - 표는 마크다운 테이블 형식 사용
   - 가독성을 위해 적절한 줄바꿈과 공백 사용

2. **실제 데이터만 사용하세요:**
   - 예시 데이터나 가상의 링크를 절대 생성하지 마세요
   - 실제로 존재하는 웹사이트, 블로그 등의 링크만 제공하세요
   - **유튜브 링크는 절대 제공하지 마세요**
   - 실제로 존재하는 서비스, 도구, 리소스만 추천하세요
   - 링크를 제공할 때는 반드시 실제로 접근 가능한 URL이어야 합니다
   - 채널명, 서비스명, 도구명 등은 실제로 존재하는 것만 사용하세요
   - "(예시)", "(예시 데이터)", "예를 들어" 등의 가상의 예시는 제공하지 마세요
   - 모르는 정보는 추측하지 말고, 실제로 확인된 정보만 제공하세요`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: promptContext,
    });

    const generatedContent = response.text;

    if (!generatedContent || generatedContent.trim() === "") {
      throw new Error("Gemini 응답이 비어있습니다.");
    }

    // 적용된 개선사항 분석
    const improvements: string[] = [
      "원본 요구사항 명확히 제시",
      "관련 질문과 답변을 구조화하여 포함",
      "충분한 고려를 위한 지시사항 추가",
      "Gemini AI를 통한 상세한 응답 생성",
    ];

    const appliedTechniques: Array<
      | "맥락 정보 통합"
      | "구체적 요구사항 반영"
      | "논리적 구조화"
      | "실행 가능한 지시사항"
    > = ["구체적 요구사항 반영", "논리적 구조화"];

    if (answeredQuestions.length > 0) {
      improvements.push(`${answeredQuestions.length}개의 추가 정보 제공`);
      appliedTechniques.push("맥락 정보 통합");
    }

    return {
      id: Date.now().toString(),
      originalPrompt,
      improvedPrompt: generatedContent.trim(),
      improvements,
      appliedTechniques,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("내용 생성 실패:", error);
    throw new Error("내용 생성에 실패했습니다.");
  }
};
