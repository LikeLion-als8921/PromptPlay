import type { Question } from '../types';

// 프롬프팅 가이드라인 및 예시들
export const PROMPTING_GUIDELINES = {
  TCREI: {
    name: 'TCREI 방법론',
    description: 'Task, Context, Role, Examples, Intent를 명확히 정의',
    components: ['Task', 'Context', 'Role', 'Examples', 'Intent']
  },
  techniques: [
    {
      name: 'Few-shot Learning',
      description: '구체적인 예시를 통한 학습',
      example: '예시 1: 입력 -> 출력\n예시 2: 입력 -> 출력'
    },
    {
      name: 'Chain-of-thought',
      description: '단계별 사고 과정 유도',
      example: '문제를 단계별로 해결해보세요:\n1. 먼저...\n2. 그 다음...'
    },
    {
      name: 'Role-playing',
      description: '특정 역할 부여',
      example: '당신은 마케팅 전문가입니다...'
    }
  ]
};

// 기본 질문 템플릿들
export const DEFAULT_QUESTIONS: Question[] = [
  {
    id: 'context-1',
    question: '이 프롬프트가 사용될 구체적인 맥락이나 상황은 무엇인가요?',
    examples: [
      '신제품 출시를 위한 마케팅 전략 회의에서 투자자들에게 발표',
      '중학생 대상 과학 수업에서 복잡한 원리를 쉽게 설명',
      '회사 내부 직원 교육을 위한 온라인 학습 콘텐츠 제작',
      '개인 브랜딩을 위한 LinkedIn 전문가 포스팅 작성',
      '고객 서비스 개선을 위한 내부 프로세스 문서화',
      '스타트업 창업 아이디어를 엔젤 투자자에게 피칭하는 상황'
    ],
    category: 'context'
  },
  {
    id: 'purpose-1',
    question: '최종적으로 달성하고자 하는 목표는 무엇인가요?',
    examples: [
      '잠재 고객의 관심을 끌어 30일 내 50% 이상의 전환율 달성',
      '비전문가도 15분 내에 핵심 개념을 완전히 이해할 수 있도록 설명',
      '브레인스토밍을 통해 기존과 차별화된 혁신적인 솔루션 10가지 도출',
      '프로젝트 이해관계자들이 명확한 실행 계획을 세울 수 있는 로드맵 제공',
      '읽는 사람이 즉시 행동에 옮길 수 있는 구체적이고 실용적인 가이드 제공',
      '복잡한 데이터를 분석하여 경영진이 의사결정에 활용할 수 있는 인사이트 추출'
    ],
    category: 'purpose'
  },
  {
    id: 'audience-1',
    question: '결과물의 대상이 되는 사람들은 누구인가요?',
    examples: [
      '기술 경험이 제한적인 40-60대 중소기업 경영진',
      '마케팅 분야 3-5년 경력의 실무진급 직장인',
      '프로그래밍을 처음 배우는 20대 대학생 및 취업준비생',
      '의사결정 권한을 가진 임원진 및 투자 심사역',
      '해당 분야에 10년 이상 경험을 가진 전문가 및 컨설턴트',
      '바쁜 일정으로 핵심 내용만 빠르게 파악하고 싶은 팀장급 관리자'
    ],
    category: 'audience'
  },
  {
    id: 'format-1',
    question: '원하는 출력 형식이나 구조가 있나요?',
    examples: [
      '각 항목별로 불릿 포인트와 2-3줄 설명이 포함된 체크리스트',
      '1단계부터 5단계까지 순차적인 실행 가이드 (각 단계별 소요시간 명시)',
      '비교 항목별로 정리된 표 형태 (장단점, 비용, 기간 등 포함)',
      '질문-답변 형태의 FAQ 스타일 (총 10-15개 질문)',
      '친근한 대화체로 작성된 블로그 포스팅 형식 (2000자 내외)',
      '프레젠테이션용 슬라이드 구조 (제목, 핵심 포인트, 결론 형태)'
    ],
    category: 'format'
  },
  {
    id: 'constraints-1',
    question: '지켜야 할 제약사항이나 특별한 요구사항이 있나요?',
    examples: [
      '총 1500자 이내로 작성하되 핵심 키워드 5개는 반드시 포함',
      '회사의 브랜드 가이드라인에 맞는 공식적이고 전문적인 톤앤매너',
      '법적 리스크를 피하기 위해 단정적 표현 대신 권고 형태로 작성',
      '특정 경쟁사나 브랜드명 언급 금지, 중립적 관점 유지',
      '초보자도 이해할 수 있도록 전문용어 사용 시 반드시 설명 추가',
      '모바일 환경에서 읽기 편하도록 문단은 3줄 이내로 제한'
    ],
    category: 'constraints'
  }
];

// 프롬프트 복잡도 판단
export const analyzePromptComplexity = (prompt: string): 'simple' | 'medium' | 'complex' => {
  const wordCount = prompt.split(' ').length;
  const hasMultipleRequests = prompt.includes('그리고') || prompt.includes('또한') || prompt.includes(',');
  const hasSpecificRequirements = prompt.includes('형식') || prompt.includes('예시') || prompt.includes('조건');
  
  if (wordCount > 50 || (hasMultipleRequests && hasSpecificRequirements)) {
    return 'complex';
  } else if (wordCount > 20 || hasMultipleRequests || hasSpecificRequirements) {
    return 'medium';
  } else {
    return 'simple';
  }
};

// 모호한 영역 감지
export const detectAmbiguousAreas = (prompt: string): string[] => {
  const ambiguousAreas: string[] = [];
  
  // 일반적인 모호함 패턴들
  const ambiguousPatterns = [
    { pattern: /좋은|나은|최적의|효과적인/, area: '구체적인 품질 기준 부족' },
    { pattern: /적절한|알맞은|괜찮은/, area: '명확한 기준 부족' },
    { pattern: /간단하게|자세히|요약해서/, area: '구체적인 길이나 상세도 부족' },
    { pattern: /도와줘|해줘/, area: '구체적인 요청 내용 부족' },
    { pattern: /분석|검토|평가/, area: '분석 기준이나 관점 부족' },
    { pattern: /만들어|생성해|작성해/, area: '구체적인 요구사항이나 형식 부족' }
  ];
  
  ambiguousPatterns.forEach(({ pattern, area }) => {
    if (pattern.test(prompt)) {
      ambiguousAreas.push(area);
    }
  });
  
  // 맥락 부족 감지
  if (!prompt.includes('위해') && !prompt.includes('목적') && !prompt.includes('상황')) {
    ambiguousAreas.push('사용 맥락이나 목적 부족');
  }
  
  // 대상 불명확
  if (!prompt.includes('고객') && !prompt.includes('사용자') && !prompt.includes('대상')) {
    ambiguousAreas.push('타겟 대상 불명확');
  }
  
  return [...new Set(ambiguousAreas)]; // 중복 제거
};

// 의도 감지
export const detectIntent = (prompt: string): string => {
  const intentPatterns = [
    { pattern: /작성|쓰기|글/, intent: '콘텐츠 작성' },
    { pattern: /분석|검토|평가/, intent: '분석 및 평가' },
    { pattern: /아이디어|브레인스토밍|창의/, intent: '아이디어 생성' },
    { pattern: /설명|가르쳐|알려줘/, intent: '설명 및 교육' },
    { pattern: /계획|전략|방법/, intent: '계획 수립' },
    { pattern: /번역|변환/, intent: '변환 작업' },
    { pattern: /요약|정리/, intent: '요약 및 정리' }
  ];
  
  for (const { pattern, intent } of intentPatterns) {
    if (pattern.test(prompt)) {
      return intent;
    }
  }
  
  return '일반적인 질의응답';
};

// 관련 질문 필터링
export const getRelevantQuestions = (_prompt: string, detectedIntent: string): Question[] => {
  const allQuestions = [...DEFAULT_QUESTIONS];
  
  // 의도에 따른 추가 질문들
  const intentSpecificQuestions: Record<string, Question[]> = {
    '콘텐츠 작성': [
      {
        id: 'content-tone',
        question: '원하는 글의 톤앤매너는 어떤 스타일인가요?',
        examples: [
          '전문적이고 신뢰감 있는 비즈니스 톤 (금융, 의료 분야 적합)',
          '친근하고 접근하기 쉬운 캐주얼 톤 (일상 블로그, SNS 콘텐츠)',
          '긴급함과 설득력을 강조하는 마케팅 톤 (세일즈, 프로모션)',
          '객관적이고 중립적인 학술 톤 (연구 보고서, 뉴스 기사)',
          '따뜻하고 공감적인 톤 (고객 서비스, 상담 분야)',
          '창의적이고 영감을 주는 톤 (브랜딩, 광고 카피)'
        ],
        category: 'format'
      }
    ],
    '분석 및 평가': [
      {
        id: 'analysis-criteria',
        question: '분석할 때 중점적으로 봐야 할 기준은 무엇인가요?',
        examples: [
          '비용 대비 효과 및 ROI 측면에서의 경제성 분석',
          '사용자 경험(UX)과 고객 만족도 측면에서의 품질 평가',
          '기술적 안정성, 확장성, 보안성 등 시스템 관점 분석',
          '시장 경쟁력, 차별화 포인트, 진입 장벽 등 전략적 관점',
          '법적 컴플라이언스, 리스크 관리, 규제 준수 여부',
          '지속가능성, 환경 영향, 사회적 책임 등 ESG 관점'
        ],
        category: 'constraints'
      }
    ],
    '아이디어 생성': [
      {
        id: 'idea-constraints',
        question: '아이디어 생성 시 고려해야 할 제약사항이 있나요?',
        examples: [
          '총 예산 500만원 이내, 개발 기간 3개월 이내의 프로젝트 범위',
          '기존 IT 인프라 활용 필수, 신규 시스템 도입 불가',
          '개인정보보호법, 저작권법 등 관련 법규 완전 준수',
          '글로벌 시장 진출 고려, 다국어 지원 및 현지화 필요',
          '기존 고객층 이탈 방지, 브랜드 이미지 일관성 유지',
          '친환경적 요소 반영, 탄소중립 목표에 부합하는 솔루션'
        ],
        category: 'constraints'
      }
    ]
  };
  
  if (intentSpecificQuestions[detectedIntent]) {
    allQuestions.push(...intentSpecificQuestions[detectedIntent]);
  }
  
  return allQuestions.slice(0, 5); // 최대 5개 질문만 반환
};

// 답변 검증
export const validateAnswers = (answers: { questionId: string; content: string; }[]): boolean => {
  return answers.length > 0 && answers.every(answer => answer.content.trim().length > 0);
};