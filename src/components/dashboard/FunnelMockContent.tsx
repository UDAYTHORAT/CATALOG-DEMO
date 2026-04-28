'use client';
import { MessageCircle, Star, ChevronDown, Check, HelpCircle, Shield, ArrowRight } from 'lucide-react';

export function FunnelMockContent({ template, isMobile }: { template: any; isMobile: boolean }) {
  const isDark = template.theme === 'onyx' || template.theme === 'dark';
  const accent = template.accentColor || '#4f46e5';
  const px = isMobile ? 'px-5' : 'px-14';
  const py = isMobile ? 'py-6' : 'py-10';
  const bgMain = isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900';
  const bgAlt = isDark ? 'bg-slate-900/80' : 'bg-slate-50';
  const muted = isDark ? 'text-slate-400' : 'text-slate-500';
  const border = isDark ? 'border-slate-800' : 'border-slate-100';
  const cardBg = isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200';
  const hero = template.hero || { headline: '', subheadline: '', ctaLabel: 'Start' };
  const trust = template.trust || {};
  const questions = template.questions || [];
  const resultDefault = template.resultDefault || {};
  const faq = template.faq || [];

  return (
    <div className={`min-h-full ${bgMain}`}>
      {/* ── NAV BAR ── */}
      <div className={`flex items-center justify-between ${px} py-2.5 border-b ${border}`}>
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{template.icon}</span>
          <span className={`text-[10px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {template.name}
          </span>
        </div>
        <div
          className="text-[8px] px-2.5 py-1 rounded-full font-bold text-white shadow-sm"
          style={{ backgroundColor: accent }}
        >
          {hero.ctaLabel?.split(' ').slice(0, 2).join(' ')}
        </div>
      </div>

      {/* ── 1. HERO SECTION ── */}
      <div className={`${px} ${isMobile ? 'pt-8 pb-6' : 'pt-14 pb-10'} text-center relative overflow-hidden`}>
        {/* Decorative gradient orbs */}
        <div
          className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] opacity-20 pointer-events-none"
          style={{ backgroundColor: accent }}
        />
        <div
          className="absolute bottom-0 left-0 w-28 h-28 rounded-full blur-[60px] opacity-10 pointer-events-none"
          style={{ backgroundColor: accent }}
        />

        <div className="text-3xl mb-3">{template.icon}</div>
        <h1
          className={`${isMobile ? 'text-lg' : 'text-2xl'} font-extrabold tracking-tight mb-2 leading-tight`}
        >
          {hero.headline}
        </h1>
        <p className={`${isMobile ? 'text-[11px]' : 'text-sm'} max-w-sm mx-auto ${muted} leading-relaxed`}>
          {hero.subheadline}
        </p>

        {/* Single prominent CTA */}
        <button
          className={`mt-4 ${isMobile ? 'px-5 py-2 text-[10px]' : 'px-6 py-2.5 text-xs'} rounded-lg font-bold text-white inline-flex items-center gap-1.5 shadow-md`}
          style={{ backgroundColor: accent }}
        >
          {hero.ctaLabel} <ArrowRight size={isMobile ? 10 : 12} />
        </button>

        <ChevronDown size={14} className={`mx-auto mt-4 animate-bounce opacity-20`} />
      </div>

      {/* ── 2. TRUST BAR ── */}
      <div className={`${px} ${isMobile ? 'py-4' : 'py-7'} ${bgAlt}`}>
        <p
          className="text-[8px] font-bold uppercase tracking-[0.2em] text-center mb-3"
          style={{ color: accent }}
        >
          {trust.title}
        </p>
        <div className={`grid grid-cols-2 gap-1.5 ${isMobile ? '' : 'max-w-md mx-auto'}`}>
          {(trust.items || []).map((item: string, i: number) => (
            <div
              key={i}
              className={`flex items-center gap-1.5 ${isMobile ? 'p-1.5' : 'p-2.5'} rounded-lg border ${cardBg}`}
            >
              <div
               className="w-3.5 h-3.5 rounded flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: accent + '18' }}
              >
                <Check size={8} strokeWidth={3} style={{ color: accent }} />
              </div>
              <span
                className={`${isMobile ? 'text-[7px]' : 'text-[10px]'} font-medium ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. QUESTION FLOW ── */}
      <div className={`${px} ${py}`}>
        <div className="text-center mb-4">
          <p
            className="text-[8px] font-bold uppercase tracking-[0.2em] mb-1"
            style={{ color: accent }}
          >
            Quick Quiz · Under 30 Seconds
          </p>
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-bold`}>
            Let&apos;s find the right match for you
          </p>
        </div>

        <div className="space-y-4 max-w-sm mx-auto">
          {questions.slice(0, isMobile ? 2 : 3).map((q: any, qi: number) => (
            <div key={qi}>
              <p
                className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-semibold mb-1.5 flex items-center gap-1.5 ${
                  isDark ? 'text-slate-200' : 'text-slate-700'
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full text-[8px] font-bold text-white flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: accent }}
                >
                  {qi + 1}
                </span>
                {q.question}
              </p>
              <div className="space-y-1">
                {(q.options || ['Option A', 'Option B', 'Option C'])
                  .slice(0, isMobile ? 3 : 4)
                  .map((opt: string, oi: number) => (
                    <div
                      key={oi}
                      className={`${isMobile ? 'px-2.5 py-1.5 text-[8px]' : 'px-3 py-2 text-[10px]'} rounded-lg border font-medium cursor-pointer transition-all ${
                        isDark ? 'border-slate-700 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'
                      }`}
                      style={
                        oi === 0
                          ? {
                              borderColor: accent,
                              backgroundColor: accent + '08',
                              borderWidth: '1.5px',
                            }
                          : {}
                      }
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full border-[1.5px] flex items-center justify-center flex-shrink-0"
                          style={
                            oi === 0
                              ? { borderColor: accent }
                              : { borderColor: isDark ? '#475569' : '#cbd5e1' }
                          }
                        >
                          {oi === 0 && (
                            <div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: accent }}
                            />
                          )}
                        </div>
                        {opt}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. RESULT / RECOMMENDATION ── */}
      <div className={`${px} ${isMobile ? 'py-5' : 'py-8'} ${bgAlt}`}>
        <div className="text-center max-w-sm mx-auto">
          <p
            className="text-[8px] font-bold uppercase tracking-[0.2em] mb-2"
            style={{ color: accent }}
          >
            Your Personalized Result
          </p>
          <div
            className={`${isMobile ? 'p-3' : 'p-5'} rounded-xl border-2 mb-3 relative overflow-hidden`}
            style={{ borderColor: accent, backgroundColor: accent + '06' }}
          >
            <div
              className="absolute top-0 right-0 w-16 h-16 rounded-full blur-[30px] opacity-15"
              style={{ backgroundColor: accent }}
            />
            <h3 className={`${isMobile ? 'text-xs' : 'text-sm'} font-bold relative mb-1`}>
              {resultDefault.title}
            </h3>
            <p className={`${isMobile ? 'text-[9px]' : 'text-[11px]'} font-medium relative opacity-80`}>
              {resultDefault.description}
            </p>
          </div>
          <button
            className={`w-full ${isMobile ? 'py-2.5 text-[10px]' : 'py-3 text-xs'} rounded-lg font-bold text-white flex items-center justify-center gap-1.5 shadow-md transition-all`}
            style={{ backgroundColor: accent }}
          >
            {resultDefault.ctaLabel} <ArrowRight size={isMobile ? 10 : 12} />
          </button>
        </div>
      </div>

      {/* ── 5. TESTIMONIAL ── */}
      {template.testimonial && (
        <div className={`${px} ${isMobile ? 'py-4' : 'py-7'}`}>
          <div
            className={`${isMobile ? 'p-3' : 'p-5'} rounded-xl border ${
              isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-slate-50'
            } text-center max-w-sm mx-auto relative overflow-hidden`}
          >
            <div className="flex items-center justify-center gap-0.5 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={9} fill={accent} stroke={accent} />
              ))}
            </div>
            <p
              className={`${isMobile ? 'text-[9px]' : 'text-xs'} italic ${muted} leading-relaxed`}
            >
              "{template.testimonial.text}"
            </p>
            <p className="text-[8px] font-bold mt-2" style={{ color: accent }}>
              — {template.testimonial.author}
            </p>
          </div>
        </div>
      )}

      {/* ── 6. FAQ ── */}
      {faq.length > 0 && (
        <div className={`${px} ${isMobile ? 'py-4' : 'py-7'}`}>
          <p
            className="text-[8px] font-bold uppercase tracking-[0.2em] text-center mb-3"
            style={{ color: accent }}
          >
            Common Questions
          </p>
          <div className="space-y-1.5 max-w-sm mx-auto">
            {faq.map((item: any, i: number) => (
              <div
                key={i}
                className={`${isMobile ? 'p-2' : 'p-3'} rounded-lg border ${
                  isDark ? 'border-slate-800' : 'border-slate-100'
                }`}
              >
                <div className="flex items-start gap-2">
                  <HelpCircle
                    size={10}
                    className="mt-0.5 flex-shrink-0"
                    style={{ color: accent }}
                  />
                  <div>
                    <p
                      className={`${isMobile ? 'text-[8px]' : 'text-[10px]'} font-bold ${
                        isDark ? 'text-slate-200' : 'text-slate-700'
                      }`}
                    >
                      {item.q}
                    </p>
                    <p className={`${isMobile ? 'text-[7px]' : 'text-[9px]'} mt-0.5 ${muted}`}>
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <div className={`${px} py-3 text-center border-t ${border}`}>
        <p className={`text-[7px] ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>
          Powered by FunnelLink
        </p>
      </div>
    </div>
  );
}
