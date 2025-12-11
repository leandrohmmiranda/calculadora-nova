import { Calculator, Zap, Delete, Divide, X, Minus, Plus, Equal, RotateCcw, Brain, History as HistoryIcon, Percent } from 'lucide-react';

export enum CalcMode {
  STANDARD = 'STANDARD',
  AI = 'AI'
}

export const BTN_CLASS_BASE = "active:scale-95 transition-all duration-150 rounded-2xl flex items-center justify-center text-xl font-medium shadow-lg backdrop-blur-md border border-glassBorder select-none";

export const KEYPAD_LAYOUT = [
  { label: 'C', value: 'clear', type: 'action', color: 'text-red-400 bg-glass hover:bg-white/10' },
  { label: '(', value: '(', type: 'operator', color: 'text-cyan-300 bg-glass hover:bg-white/10' },
  { label: ')', value: ')', type: 'operator', color: 'text-cyan-300 bg-glass hover:bg-white/10' },
  { label: '÷', value: '/', type: 'operator', color: 'text-violet-400 bg-glass hover:bg-white/10' },
  
  { label: '7', value: '7', type: 'number', color: 'text-white bg-white/5 hover:bg-white/15' },
  { label: '8', value: '8', type: 'number', color: 'text-white bg-white/5 hover:bg-white/15' },
  { label: '9', value: '9', type: 'number', color: 'text-white bg-white/5 hover:bg-white/15' },
  { label: '×', value: '*', type: 'operator', color: 'text-violet-400 bg-glass hover:bg-white/10' },
  
  { label: '4', value: '4', type: 'number', color: 'text-white bg-white/5 hover:bg-white/15' },
  { label: '5', value: '5', type: 'number', color: 'text-white bg-white/5 hover:bg-white/15' },
  { label: '6', value: '6', type: 'number', color: 'text-white bg-white/5 hover:bg-white/15' },
  { label: '-', value: '-', type: 'operator', color: 'text-violet-400 bg-glass hover:bg-white/10' },
  
  { label: '1', value: '1', type: 'number', color: 'text-white bg-white/5 hover:bg-white/15' },
  { label: '2', value: '2', type: 'number', color: 'text-white bg-white/5 hover:bg-white/15' },
  { label: '3', value: '3', type: 'number', color: 'text-white bg-white/5 hover:bg-white/15' },
  { label: '+', value: '+', type: 'operator', color: 'text-violet-400 bg-glass hover:bg-white/10' },
  
  { label: '%', value: '%', type: 'operator', color: 'text-cyan-300 bg-glass hover:bg-white/10' },
  { label: '0', value: '0', type: 'number', color: 'text-white bg-white/5 hover:bg-white/15' },
  { label: '.', value: '.', type: 'number', color: 'text-white bg-white/5 hover:bg-white/15' },
  { label: '=', value: 'equals', type: 'action', color: 'text-white bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-violet-500/20' },
];

export interface HistoryItem {
  expression: string;
  result: string;
  timestamp: number;
  isAi?: boolean;
}
