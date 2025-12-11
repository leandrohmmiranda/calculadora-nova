import React, { useState, useEffect, useRef } from 'react';
import { HistoryPanel } from './HistoryPanel';
import { Display } from './Display';
import { KEYPAD_LAYOUT, BTN_CLASS_BASE, HistoryItem, CalcMode } from '../constants';
import { solveWithGemini } from '../services/geminiService';
import { Brain, Calculator as CalculatorIcon, History as HistoryIcon, Loader2, Send } from 'lucide-react';

export const Calculator: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [mode, setMode] = useState<CalcMode>(CalcMode.STANDARD);
  const [isLoading, setIsLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string>('');
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea for AI mode
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input, mode]);

  const handleStandardCalc = () => {
    try {
      // Basic sanitization: only allow valid characters for eval
      // In a real app, use a proper parser. Here we simply check characters.
      if (!/^[0-9+\-*/().%\s]+$/.test(input)) {
        throw new Error("Caracteres inválidos");
      }
      
      // Handle percentage separately or replace % with /100 depending on logic
      // Simple replace for this demo: N% -> N/100
      let evalString = input.replace(/%/g, '/100');
      
      // eslint-disable-next-line no-new-func
      const calcFunc = new Function('return ' + evalString);
      const resVal = calcFunc();
      
      if (!isFinite(resVal) || isNaN(resVal)) {
        throw new Error("Indefinido");
      }

      const resString = String(Math.round(resVal * 100000000) / 100000000); // Prevent float precision errors
      setResult(resString);
      addToHistory(input, resString, false);
    } catch (e) {
      setResult("Erro");
    }
  };

  const handleAiCalc = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setResult('');
    setAiExplanation('Pensando...');
    
    try {
      const { result: aiResult, explanation } = await solveWithGemini(input);
      setResult(aiResult);
      setAiExplanation(explanation);
      addToHistory(input, aiResult, true);
    } catch (e) {
      setResult("Erro");
      setAiExplanation("Falha na conexão.");
    } finally {
      setIsLoading(false);
    }
  };

  const addToHistory = (expr: string, res: string, isAi: boolean) => {
    setHistory(prev => [{ expression: expr, result: res, timestamp: Date.now(), isAi }, ...prev].slice(0, 50));
  };

  const handleBtnClick = (value: string, type: string) => {
    if (type === 'action') {
      if (value === 'clear') {
        setInput('');
        setResult('');
        setAiExplanation('');
      } else if (value === 'equals') {
        if (mode === CalcMode.STANDARD) handleStandardCalc();
        else handleAiCalc();
      }
    } else {
      if (result) {
        // If there's a previous result and user types an operator, continue with result
        // If user types a number, start fresh
        if (['+', '-', '*', '/', '%'].includes(value)) {
           setInput(result + value);
        } else {
           setInput(value);
        }
        setResult('');
        setAiExplanation('');
      } else {
        setInput(prev => prev + value);
      }
    }
  };

  return (
    <div className="relative w-full max-w-sm sm:max-w-md bg-slate-800/50 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col h-[800px] max-h-[90vh]">
      
      {/* Header / Mode Switcher */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex bg-slate-900/50 rounded-full p-1 border border-white/5">
          <button
            onClick={() => { setMode(CalcMode.STANDARD); setInput(''); setResult(''); }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${mode === CalcMode.STANDARD ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            <CalculatorIcon size={14} /> Padrão
          </button>
          <button
            onClick={() => { setMode(CalcMode.AI); setInput(''); setResult(''); }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${mode === CalcMode.AI ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            <Brain size={14} /> IA
          </button>
        </div>
        <button 
          onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          className={`p-2 rounded-full transition-all ${isHistoryOpen ? 'bg-violet-600/20 text-violet-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
        >
          <HistoryIcon size={20} />
        </button>
      </div>

      {/* Screen */}
      <div className="relative z-10 bg-gradient-to-b from-slate-900/0 to-slate-900/30">
        {mode === CalcMode.AI ? (
            <div className="p-6 h-40 flex flex-col justify-end">
              {result && (
                <div className="text-right mb-4">
                  <div className="text-xs text-cyan-400 mb-1">{aiExplanation}</div>
                  <div className="text-3xl font-bold text-white">{result}</div>
                </div>
              )}
               <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      if(result) setResult(''); 
                    }}
                    onKeyDown={(e) => {
                      if(e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAiCalc();
                      }
                    }}
                    placeholder="Digite um problema matemático..."
                    className="w-full bg-transparent text-right text-xl text-white placeholder-slate-600 focus:outline-none resize-none overflow-hidden max-h-32"
                    rows={1}
                    autoFocus
                  />
                  {isLoading && (
                    <div className="absolute left-0 bottom-1">
                      <Loader2 className="animate-spin text-cyan-400" size={20} />
                    </div>
                  )}
               </div>
            </div>
        ) : (
          <Display input={input} result={result} isAiMode={false} />
        )}
      </div>

      {/* Controls */}
      <div className="flex-1 bg-slate-900/40 p-5 sm:p-6 pb-8">
        {mode === CalcMode.STANDARD ? (
          <div className="grid grid-cols-4 gap-3 sm:gap-4 h-full">
            {KEYPAD_LAYOUT.map((btn) => (
              <button
                key={btn.label}
                onClick={() => handleBtnClick(btn.value, btn.type)}
                className={`${BTN_CLASS_BASE} ${btn.color} ${btn.value === 'equals' ? 'col-span-1 row-span-1' : ''}`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col h-full justify-end gap-4">
            <div className="text-center text-slate-500 text-sm p-4 border border-dashed border-white/10 rounded-2xl mb-auto mt-4">
              <Brain size={32} className="mx-auto mb-3 text-cyan-900" />
              <p>O modo IA permite resolver expressões complexas e problemas de texto.</p>
              <p className="mt-2 text-xs opacity-60">Ex: "Quanto é a raiz quadrada de 144 mais 15%?"</p>
            </div>
            
            <button
              onClick={handleAiCalc}
              disabled={isLoading || !input.trim()}
              className={`${BTN_CLASS_BASE} w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? 'Calculando...' : (
                <span className="flex items-center gap-2">Resolver com IA <Send size={18} /></span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* History Slide-over */}
      <HistoryPanel 
        history={history}
        isOpen={isHistoryOpen}
        onClear={() => setHistory([])}
        onSelect={(item) => {
          setInput(item.expression);
          setResult(item.result);
          setMode(item.isAi ? CalcMode.AI : CalcMode.STANDARD);
          setIsHistoryOpen(false);
        }}
        onClose={() => setIsHistoryOpen(false)}
      />

    </div>
  );
};
