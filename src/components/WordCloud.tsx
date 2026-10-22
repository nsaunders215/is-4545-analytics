import React from 'react';

interface WordItem {
  text: string;
  weight: number; // 1 to 5
  count: number;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
}

interface WordCloudProps {
  words: WordItem[];
  selectedWord?: string;
  onSelectWord?: (word: string) => void;
}

export const WordCloud: React.FC<WordCloudProps> = ({
  words,
  selectedWord,
  onSelectWord,
}) => {
  const getSentimentStyle = (sentiment: string, isSelected: boolean) => {
    if (isSelected) {
      return 'bg-white text-slate-950 ring-2 ring-teal-400 font-extrabold scale-110 shadow-lg';
    }

    switch (sentiment) {
      case 'Negative':
        return 'text-rose-400 hover:text-rose-200 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40';
      case 'Positive':
        return 'text-emerald-400 hover:text-emerald-200 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/40';
      default:
        return 'text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50';
    }
  };

  const getSizeClass = (weight: number) => {
    switch (weight) {
      case 5:
        return 'text-xl sm:text-2xl font-bold py-2 px-3.5';
      case 4:
        return 'text-base sm:text-lg font-semibold py-1.5 px-3';
      case 3:
        return 'text-sm sm:text-base font-medium py-1 px-2.5';
      case 2:
        return 'text-xs sm:text-sm py-1 px-2';
      default:
        return 'text-[11px] sm:text-xs py-0.5 px-1.5';
    }
  };

  return (
    <div className="bg-slate-950/60 border border-slate-800/90 rounded-2xl p-6 min-h-[260px] flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 select-none relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      {words.length === 0 ? (
        <p className="text-xs text-slate-500">No keywords found for active filters.</p>
      ) : (
        words.map((w) => {
          const isSelected = selectedWord === w.text;
          return (
            <button
              key={w.text}
              onClick={() => onSelectWord?.(isSelected ? '' : w.text)}
              className={`rounded-xl transition-all duration-200 cursor-pointer flex items-center space-x-1.5 tracking-tight ${getSizeClass(
                w.weight
              )} ${getSentimentStyle(w.sentiment, isSelected)}`}
              title={`Keyword: "${w.text}" (${w.count} occurrences, ${w.sentiment})`}
            >
              <span>{w.text}</span>
              <span className="text-[10px] opacity-70 font-mono">({w.count})</span>
            </button>
          );
        })
      )}
    </div>
  );
};
