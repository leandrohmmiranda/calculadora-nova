import React from 'react';
import { Calculator } from './components/Calculator';

export default function App() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none" />
      
      <main className="relative z-10 w-full flex flex-col items-center gap-6">
        <Calculator />
        
        <footer className="text-slate-500 text-xs font-medium tracking-wide opacity-60">
          Powered by Gemini 2.5 Flash
        </footer>
      </main>
    </div>
  );
}