import { useState, useEffect, useMemo } from 'react';
import InputPanel from './components/InputPanel';
import ResultsPanel from './components/ResultsPanel';
import MonthlyProjection from './components/MonthlyProjection';
import { calculate } from './logic/calculator';
import { DEFAULT_INPUTS, COUNTRIES } from './logic/constants';
import { translations } from './i18n/translations';

function getInitialLanguage() {
  try {
    const stored = localStorage.getItem('etsy-lang');
    if (stored === 'en' || stored === 'de') return stored;
  } catch {
    /* ignore */
  }
  if (typeof navigator !== 'undefined' && navigator.language?.startsWith('de')) return 'de';
  return 'en';
}

export default function App() {
  const [inputs, setInputs] = useState({ ...DEFAULT_INPUTS });
  const [language, setLanguage] = useState(() => getInitialLanguage());

  useEffect(() => {
    localStorage.setItem('etsy-lang', language);
  }, [language]);

  const t = translations[language];
  const results = useMemo(() => calculate(inputs), [inputs]);

  const currencySymbol = COUNTRIES.find((c) => c.code === inputs.country)?.currency || '€';

  const handleReset = () => setInputs({ ...DEFAULT_INPUTS });

  const countryLabel = (code) => {
    const key = `country_${code}`;
    return t[key] ?? COUNTRIES.find((c) => c.code === code)?.label ?? code;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-bold text-coral-500">{t.header_title}</h1>
            <p className="text-xs text-gray-500">{t.header_subtitle}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-gray-400 hidden sm:inline">{t.header_brand}</span>
            <div className="flex rounded-lg border border-gray-200 overflow-hidden h-11 min-h-[44px]">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`min-w-[44px] px-3 text-sm font-semibold transition-colors ${
                  language === 'en'
                    ? 'bg-coral-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('de')}
                className={`min-w-[44px] px-3 text-sm font-semibold border-l border-gray-200 transition-colors ${
                  language === 'de'
                    ? 'bg-coral-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                DE
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6 max-[480px]:px-3 max-[480px]:py-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
          <div className="md:col-span-5">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 max-[480px]:p-3">
              <InputPanel
                inputs={inputs}
                onChange={setInputs}
                onReset={handleReset}
                currencySymbol={currencySymbol}
                t={t}
                countryLabel={countryLabel}
              />
            </div>
          </div>

          <div className="md:col-span-7 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 max-[480px]:p-3">
              <ResultsPanel
                results={results}
                inputs={inputs}
                currencySymbol={currencySymbol}
                t={t}
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 max-[480px]:p-3">
              <MonthlyProjection
                results={results}
                inputs={inputs}
                currencySymbol={currencySymbol}
                t={t}
              />
            </div>
          </div>
        </div>

        <footer className="mt-6 text-center text-[10px] text-gray-400 space-y-0.5 pb-4 px-1">
          <p>
            {t.processing_fee_note.replace('{symbol}', currencySymbol)} ·{' '}
            {t.transaction_fee_note.replace('{symbol}', currencySymbol)}
          </p>
          <p>{t.footer_estimates_line}</p>
        </footer>
      </main>
    </div>
  );
}
