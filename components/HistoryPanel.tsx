import React, { useEffect } from 'react';
import { HistoryItem } from '../constants';
import { Brain, Calculator, Trash2, X } from 'lucide-react';

interface HistoryPanelProps {
  history: HistoryItem[];
  isOpen: boolean;
  onClear: () => void;
  onSelect: (item: HistoryItem) => void;
  onClose: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, isOpen, onClear, onSelect, onClose }) => {
  
  // Close panel on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div 
      className={`absolute inset-y-0 right-0 w-80 bg-slate-900/95 backdrop-blur-xl border-l border-white/10 transform transition-transform duration-300 ease-in-out z-20 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <h2 className="text-lg font-semibold text-white tracking-tight">Histórico</h2>
        <div className="flex items-center gap-1">
          <button 
            onClick={onClear}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-red-400 transition-colors"
            title="Limpar Histórico"
          >
            <Trash2 size={18} />
          </button>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Fechar"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto h-[calc(100%-4rem)] p-4 space-y-3">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-500">
            <p className="text-sm">Sem cálculos recentes</p>
          </div>
        ) : (
          history.map((item, index) => (
            <div 
              key={index}
              onClick={() => onSelect(item)}
              className="group p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-violet-500/30 cursor-pointer transition-all"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-mono text-slate-400 truncate max-w-[180px]">
                  {item.expression}
                </span>
                {item.isAi && <Brain size={12} className="text-violet-400 mt-1" />}
              </div>
              <div className="text-right text-xl font-medium text-white group-hover:text-cyan-300 transition-colors">
                {item.result}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};