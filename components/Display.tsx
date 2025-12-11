import React from 'react';

interface DisplayProps {
  input: string;
  result: string;
  isAiMode: boolean;
  aiExplanation?: string;
}

export const Display: React.FC<DisplayProps> = ({ input, result, isAiMode, aiExplanation }) => {
  return (
    <div className="flex flex-col items-end justify-end h-40 p-6 w-full text-right transition-all">
      <div className="flex-1 w-full overflow-hidden flex flex-col justify-end">
        {isAiMode && aiExplanation && (
          <div className="mb-2 text-xs text-violet-300 font-medium animate-pulse">
            {aiExplanation}
          </div>
        )}
        <div className={`break-words transition-all duration-200 ${result ? 'text-slate-400 text-lg mb-1' : 'text-white text-4xl font-light'}`}>
           {input || (isAiMode ? "Pergunte à IA..." : "0")}
        </div>
        {result && (
          <div className="text-4xl sm:text-5xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {result}
          </div>
        )}
      </div>
    </div>
  );
};
