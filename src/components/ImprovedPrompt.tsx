import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ImprovedPrompt as ImprovedPromptType } from "../types";

const ImprovedPrompt: React.FC = () => {
  const navigate = useNavigate();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [improvedPrompt, setImprovedPrompt] = useState<ImprovedPromptType | null>(null);

  useEffect(() => {
    const savedPrompt = localStorage.getItem('improvedPrompt');
    if (savedPrompt) {
      try {
        const parsed = JSON.parse(savedPrompt);
        // Date 객체 복원
        parsed.timestamp = new Date(parsed.timestamp);
        setImprovedPrompt(parsed);
      } catch (error) {
        console.error('Failed to parse improved prompt:', error);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleStartOver = () => {
    localStorage.removeItem('improvedPrompt');
    navigate('/');
  };

  if (!improvedPrompt) {
    return null;
  }

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("복사 실패:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                ✨ AI 응답 생성 완료!
              </h1>
              <p className="text-sm text-gray-600 mt-2">
                다음은 질문-답변을 바탕으로 생성된 상세한 응답입니다.
              </p>
            </div>
            <button
              onClick={() =>
                copyToClipboard(improvedPrompt.improvedPrompt, "improved")
              }
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-all duration-200 font-medium"
            >
              {copiedField === "improved" ? (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  복사됨
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  복사
                </>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* AI 생성 응답 */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 pt-0 shadow-sm">
            <div className="markdown-content prose prose-slate max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node, ...props }) => (
                    <h1
                      className="text-3xl font-bold text-gray-900 mt-8 mb-6 pb-3 border-b border-gray-200 font-sans tracking-tight"
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      className="text-2xl font-bold text-gray-900 mt-7 mb-4 pb-2 border-b border-gray-200 font-sans tracking-tight"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className="text-xl font-semibold text-gray-900 mt-6 mb-3 font-sans tracking-tight"
                      {...props}
                    />
                  ),
                  h4: ({ node, ...props }) => (
                    <h4
                      className="text-lg font-semibold text-gray-900 mt-5 mb-2 font-sans tracking-tight"
                      {...props}
                    />
                  ),
                  p: ({ node, ...props }) => (
                    <p
                      className="text-gray-700 mb-5 leading-relaxed font-sans text-[15px]"
                      {...props}
                    />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul
                      className="list-disc list-outside text-gray-700 mb-5 space-y-2 ml-6 font-sans"
                      {...props}
                    />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      className="list-decimal list-outside text-gray-700 mb-5 space-y-2 ml-6 font-sans"
                      {...props}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li
                      className="text-gray-700 leading-relaxed font-sans text-[15px]"
                      {...props}
                    />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong
                      className="font-semibold text-gray-900"
                      {...props}
                    />
                  ),
                  em: ({ node, ...props }) => (
                    <em className="italic text-gray-700" {...props} />
                  ),
                  code: ({
                    node,
                    inline,
                    className,
                    children,
                    ...props
                  }: any) => {
                    return (
                      <code
                        className="font-bold text-gray-900"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  pre: ({ node, children, ...props }: any) => (
                    <pre
                      className="mb-5"
                      {...props}
                    >
                      {children}
                    </pre>
                  ),
                  a: ({ node, ...props }) => (
                    <a
                      className="text-blue-600 hover:text-blue-700 underline font-medium transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="border-l-4 border-gray-300 pl-5 italic text-gray-600 my-5 bg-gray-50 py-3 rounded-r font-sans"
                      {...props}
                    />
                  ),
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-5 rounded-lg border border-gray-200">
                      <table
                        className="min-w-full border-collapse"
                        {...props}
                      />
                    </div>
                  ),
                  th: ({ node, ...props }) => (
                    <th
                      className="bg-gray-50 text-gray-900 font-semibold px-4 py-3 border-b border-gray-200 text-left text-sm"
                      {...props}
                    />
                  ),
                  td: ({ node, ...props }) => (
                    <td
                      className="px-4 py-3 border-b border-gray-100 text-gray-700 text-sm"
                      {...props}
                    />
                  ),
                  hr: ({ node, ...props }) => (
                    <hr className="my-8 border-gray-200" {...props} />
                  ),
                }}
              >
                {improvedPrompt.improvedPrompt}
              </ReactMarkdown>
            </div>
          </div>

           {/* 액션 버튼 */}
           <div className="flex justify-center pt-6">
             <button
               onClick={handleStartOver}
               className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
             >
               새로운 요청하기
             </button>
           </div>
         </div>
      </div>
    </div>
  );
};

export default ImprovedPrompt;
