import React, { useState } from 'react';
import {
  Brain,
  Hash,
  Tag,
  MessageSquare,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Star,
} from 'lucide-react';
import { PatientComment, PrimaryTheme } from '../types';
import { WordCloud } from './WordCloud';

interface NLPAnalysisProps {
  comments: PatientComment[];
  selectedKeyword?: string;
  onSelectKeyword?: (keyword: string) => void;
}

export const NLPAnalysis: React.FC<NLPAnalysisProps> = ({
  comments,
  selectedKeyword,
  onSelectKeyword,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [expandedCommentId, setExpandedCommentId] = useState<string | null>(null);

  const total = comments.length || 1;

  // 1. Theme Aggregation & Distribution
  const themeMap = new Map<
    PrimaryTheme,
    { total: number; positive: number; neutral: number; negative: number }
  >();

  comments.forEach((c) => {
    const cur = themeMap.get(c.primaryTheme) || {
      total: 0,
      positive: 0,
      neutral: 0,
      negative: 0,
    };
    cur.total += 1;
    if (c.sentiment === 'Positive') cur.positive += 1;
    else if (c.sentiment === 'Neutral') cur.neutral += 1;
    else cur.negative += 1;
    themeMap.set(c.primaryTheme, cur);
  });

  const themeList = Array.from(themeMap.entries())
    .map(([theme, stats]) => ({
      theme,
      ...stats,
      pct: ((stats.total / total) * 100).toFixed(1),
      negPct: ((stats.negative / stats.total) * 100).toFixed(0),
    }))
    .sort((a, b) => b.total - a.total);

  // 2. Keyword Frequency & Sentiment Extraction
  const keywordFrequency = new Map<
    string,
    { count: number; positive: number; negative: number; neutral: number }
  >();

  comments.forEach((c) => {
    c.keywords.forEach((kw) => {
      const clean = kw.toLowerCase().trim();
      if (!clean) return;
      const stat = keywordFrequency.get(clean) || {
        count: 0,
        positive: 0,
        negative: 0,
        neutral: 0,
      };
      stat.count += 1;
      if (c.sentiment === 'Positive') stat.positive += 1;
      else if (c.sentiment === 'Negative') stat.negative += 1;
      else stat.neutral += 1;
      keywordFrequency.set(clean, stat);
    });
  });

  const sortedKeywords = Array.from(keywordFrequency.entries())
    .map(([text, stat]) => {
      let sentiment: 'Positive' | 'Neutral' | 'Negative' = 'Neutral';
      if (stat.negative > stat.positive) sentiment = 'Negative';
      else if (stat.positive > stat.negative) sentiment = 'Positive';
      return {
        text,
        count: stat.count,
        sentiment,
      };
    })
    .sort((a, b) => b.count - a.count);

  const maxCount = sortedKeywords[0]?.count || 1;
  const wordCloudData = sortedKeywords.slice(0, 32).map((k) => {
    // scale weight 1-5
    const weight = Math.max(
      1,
      Math.min(5, Math.ceil((k.count / maxCount) * 5))
    );
    return {
      text: k.text,
      weight,
      count: k.count,
      sentiment: k.sentiment,
    };
  });

  // Filtered comments for the inspector
  const filteredComments = comments.filter((c) => {
    if (selectedTheme && c.primaryTheme !== selectedTheme) return false;
    if (
      selectedKeyword &&
      !c.commentText.toLowerCase().includes(selectedKeyword.toLowerCase()) &&
      !c.keywords.some((k) => k.toLowerCase() === selectedKeyword.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <section className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950/60 border border-teal-800/80 px-2.5 py-0.5 rounded-full">
            Section 3
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight">
            NLP Semantic & Theme Analysis
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1 sm:mt-0">
          Unsupervised clustering of patient narrative verbatim quotes & keyword taxonomy
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Top Themes & Distribution (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Themes Breakdown Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-white">
                  Identified Patient Experience Themes ({themeList.length})
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                Click theme to inspect verbatim comments
              </span>
            </div>

            <div className="space-y-3">
              {themeList.map((item) => {
                const isSelected = selectedTheme === item.theme;
                return (
                  <div
                    key={item.theme}
                    onClick={() =>
                      setSelectedTheme(isSelected ? '' : item.theme)
                    }
                    className={`p-3 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-teal-950/40 border-teal-500/70'
                        : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-slate-200">
                          {item.theme}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] bg-teal-500/20 text-teal-300 px-1.5 py-0.2 rounded font-mono">
                            Filtering Comments
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-3 text-slate-400 font-mono text-[11px]">
                        <span>{item.total} mentions ({item.pct}%)</span>
                        <span className="text-rose-400">
                          {item.negPct}% neg
                        </span>
                      </div>
                    </div>

                    {/* Stacked Sentiment Bar */}
                    <div className="w-full bg-slate-800 rounded-full h-2 flex overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full"
                        style={{
                          width: `${(item.positive / item.total) * 100}%`,
                        }}
                        title={`Positive: ${item.positive}`}
                      />
                      <div
                        className="bg-slate-500 h-full"
                        style={{
                          width: `${(item.neutral / item.total) * 100}%`,
                        }}
                        title={`Neutral: ${item.neutral}`}
                      />
                      <div
                        className="bg-rose-500 h-full"
                        style={{
                          width: `${(item.negative / item.total) * 100}%`,
                        }}
                        title={`Negative: ${item.negative}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-end space-x-4 text-[11px] text-slate-400">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span>Positive</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block" />
                <span>Neutral</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                <span>Negative (Grievances)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Word Cloud & Keyword Frequency (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Word Cloud Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-white">
                  Interactive Word Cloud
                </h3>
              </div>
              {selectedKeyword && (
                <button
                  onClick={() => onSelectKeyword?.('')}
                  className="text-[11px] text-rose-400 hover:underline cursor-pointer"
                >
                  Clear Keyword
                </button>
              )}
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Size represents frequency; green = positive satisfaction, red = severe pain point.
            </p>

            <WordCloud
              words={wordCloudData}
              selectedWord={selectedKeyword}
              onSelectWord={onSelectKeyword}
            />
          </div>

          {/* Top 6 High-Frequency Keywords Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Hash className="w-3.5 h-3.5 text-teal-400" />
                <span>Most Frequently Occurring Keywords</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              {sortedKeywords.slice(0, 6).map((k) => (
                <div
                  key={k.text}
                  onClick={() => onSelectKeyword?.(k.text)}
                  className={`p-2 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition ${
                    selectedKeyword === k.text
                      ? 'bg-teal-500/20 border-teal-400 text-white font-bold'
                      : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600 text-slate-300'
                  }`}
                >
                  <span className="truncate mr-1 font-medium">#{k.text}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      k.sentiment === 'Negative'
                        ? 'bg-rose-950/80 text-rose-300'
                        : k.sentiment === 'Positive'
                        ? 'bg-emerald-950/80 text-emerald-300'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {k.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Verbatim Comments Inspector */}
      <div className="mt-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-bold text-white">
              Verbatim Patient Feedback Inspector
            </h3>
            <span className="text-xs text-slate-400">
              ({filteredComments.length} comments match active drill-down)
            </span>
          </div>

          {(selectedTheme || selectedKeyword) && (
            <div className="flex items-center space-x-2">
              {selectedTheme && (
                <span className="text-xs bg-teal-500/20 text-teal-300 px-2.5 py-1 rounded-lg border border-teal-500/30">
                  Theme: {selectedTheme}
                </span>
              )}
              {selectedKeyword && (
                <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-lg border border-indigo-500/30">
                  Keyword: {selectedKeyword}
                </span>
              )}
              <button
                onClick={() => {
                  setSelectedTheme('');
                  onSelectKeyword?.('');
                }}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Reset Inspector
              </button>
            </div>
          )}
        </div>

        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {filteredComments.slice(0, 15).map((c) => {
            const isExpanded = expandedCommentId === c.id;
            return (
              <div
                key={c.id}
                className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-semibold text-teal-400">
                      {c.patientId}
                    </span>
                    <span className="text-xs font-medium text-white px-2 py-0.5 rounded-md bg-slate-700/80">
                      {c.serviceLine}
                    </span>
                    <span className="text-xs text-slate-400">{c.visitType}</span>
                    <span className="text-[11px] text-slate-500 hidden sm:inline">
                      • {c.patientPersona}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-slate-400">Wait: {c.waitTimeMinutes}m</span>
                    <div className="flex items-center text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                      <span>{c.satisfactionScore}/5</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.sentiment === 'Positive'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : c.sentiment === 'Negative'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-slate-600/30 text-slate-300'
                      }`}
                    >
                      {c.sentiment}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  "{c.commentText}"
                </p>

                {/* Tags and Flagged Issues */}
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                    Theme: {c.primaryTheme}
                  </span>
                  {c.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="text-[10px] px-1.5 py-0.2 rounded bg-slate-700/60 text-slate-300 font-mono"
                    >
                      #{kw}
                    </span>
                  ))}
                  {c.issueCategories.map((issue) => (
                    <span
                      key={issue}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950/70 text-rose-300 border border-rose-800/60 font-semibold"
                    >
                      ⚠️ {issue}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
