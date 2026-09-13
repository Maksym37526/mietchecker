'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Shield, Upload, FileText, AlertTriangle, CheckCircle, Scale, ChevronDown, ChevronUp } from 'lucide-react';

const LANGS = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'uk', label: 'Ukrainian', flag: '🇺🇦' },
];

const HERO = {
  en: {
    title: 'Know before you sign.',
    subtitle: 'Upload your German rental contract and get an instant AI analysis of illegal clauses — in seconds, not days.',
    badge: 'Based on BGB & BGH rulings',
    drop: 'Drop your Mietvertrag here',
    button: 'Analyze Contract',
    another: 'Analyze another contract',
    footer: 'Informational tool only · Not legal advice · Consult Mieterschutzbund for complex cases',
  },
  de: {
    title: 'Wissen, bevor Sie unterschreiben.',
    subtitle: 'Laden Sie Ihren Mietvertrag hoch und erhalten Sie sofort eine KI-Analyse auf illegale Klauseln — in Sekunden, nicht Tagen.',
    badge: 'Basierend auf BGB & BGH-Urteilen',
    drop: 'Mietvertrag hier ablegen',
    button: 'Vertrag analysieren',
    another: 'Weiteren Vertrag analysieren',
    footer: 'Nur zu Informationszwecken · Keine Rechtsberatung · Bei komplexen Fällen Mieterschutzbund kontaktieren',
  },
  uk: {
    title: 'Знай до того, як підписати.',
    subtitle: 'Завантаж свій договір оренди і отримай миттєвий AI-аналіз незаконних пунктів — за секунди, а не дні.',
    badge: 'На основі BGB та рішень BGH',
    drop: 'Перетягни договір сюди',
    button: 'Аналізувати договір',
    another: 'Аналізувати інший договір',
    footer: 'Лише інформаційний інструмент · Не юридична консультація · У складних випадках зверніться до Mieterschutzbund',
  },
};

const ACCEPTED_FORMATS = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};

function RiskCard({ item, type }: { item: any; type: 'critical' | 'moderate' }) {
  const [open, setOpen] = useState(false);
  const colors = type === 'critical'
    ? { border: 'border-red-500/30', bg: 'bg-red-500/5', dot: 'bg-red-500', text: 'text-red-400' }
    : { border: 'border-amber-500/30', bg: 'bg-amber-500/5', dot: 'bg-amber-400', text: 'text-amber-400' };

  return (
    <div className={`border ${colors.border} ${colors.bg} rounded-2xl overflow-hidden transition-all`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-start gap-3 text-left"
      >
        <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${colors.dot}`} />
        <span className="text-gray-200 text-sm font-medium flex-1 italic">"{item.clause}"</span>
        {open ? <ChevronUp size={16} className="text-gray-500 mt-1 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-500 mt-1 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-4 space-y-2 border-t border-white/5 pt-3">
          <p className={`text-sm ${colors.text}`}>⚠️ {item.problem}</p>
          {item.law && <p className="text-xs text-gray-500 font-mono">📖 {item.law}</p>}
          <p className="text-sm text-emerald-400">💡 {item.advice}</p>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [lang, setLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState('');
  const [loadingText, setLoadingText] = useState('');

  const onDrop = useCallback((accepted: File[], rejected: any[]) => {
    if (rejected.length > 0) {
      setError('Unsupported format. Please use PDF, JPG, PNG, or WEBP.');
      return;
    }
    if (accepted[0]) {
      setFile(accepted[0]);
      setError('');
      setReport(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FORMATS,
    maxFiles: 1,
  });

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setReport(null);

    const steps = [
      'Reading document...',
      'Validating contract...',
      'Analyzing clauses with AI...',
      'Checking BGB compliance...',
    ];
    let i = 0;
    setLoadingText(steps[0]);
    const interval = setInterval(() => {
      i = (i + 1) % steps.length;
      setLoadingText(steps[i]);
    }, 2500);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`/api/analyze?lang=${lang}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Analysis failed');
      setReport(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      clearInterval(interval);
      setLoading(false);
      setLoadingText('');
    }
  };

  const totalIssues = (report?.critical_risks?.length || 0) + (report?.moderate_risks?.length || 0);
  const t = HERO[lang as keyof typeof HERO];

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white font-sans">
      {/* Subtle background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_#1a1a3e_0%,_transparent_60%)] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <Shield size={16} className="text-blue-400" />
            </div>
            <span className="font-semibold text-white tracking-tight">MietChecker</span>
            <span className="hidden sm:block text-gray-600 text-sm">/ Rental Contract Analyzer</span>
          </div>
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  lang === l.code
                    ? 'bg-white/10 text-white'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {l.flag} {l.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-blue-400 text-xs font-medium mb-6">
            <Scale size={12} />
            {t.badge}
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-4 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            {t.title}
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Stats */}
        {!report && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">70%</p>
              <p className="text-xs text-gray-500 mt-1">
                {lang === 'de' ? 'der Verträge haben illegale Klauseln' :
                 lang === 'uk' ? 'договорів мають незаконні пункти' :
                 'of contracts have illegal clauses'}
              </p>
            </div>
            <div className="text-center border-x border-white/5">
              <p className="text-2xl font-bold text-white">30s</p>
              <p className="text-xs text-gray-500 mt-1">
                {lang === 'de' ? 'Analyse-Zeit' :
                 lang === 'uk' ? 'час аналізу' :
                 'analysis time'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">0€</p>
              <p className="text-xs text-gray-500 mt-1">
                {lang === 'de' ? 'Kostenlos' :
                 lang === 'uk' ? 'Безкоштовно' :
                 'Free to use'}
              </p>
            </div>
          </div>
        )}
        {/* Upload */}
        {!report && (
          <div
            {...getRootProps()}
            className={`relative border rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
              isDragActive
                ? 'border-blue-500/50 bg-blue-500/5'
                : file
                ? 'border-emerald-500/40 bg-emerald-500/5'
                : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
            }`}
          >
            <input {...getInputProps()} />
            {file ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <FileText className="text-emerald-400" size={22} />
                </div>
                <div>
                  <p className="text-emerald-400 font-medium">{file.name}</p>
                  <p className="text-gray-600 text-sm mt-1">{(file.size / 1024).toFixed(0)} KB · Click to change</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Upload className="text-gray-500" size={22} />
                </div>
                <div>
                  <p className="text-gray-300 font-medium">
                    {isDragActive ? 'Drop your file here' : t.drop}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">PDF, JPG, PNG, WEBP · Max 10MB</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 bg-red-500/5 border border-red-500/20 rounded-xl flex items-start gap-3">
            <AlertTriangle className="text-red-400 mt-0.5 flex-shrink-0" size={16} />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Button */}
        {!report && (
          <button
            onClick={analyze}
            disabled={!file || loading}
            className="w-full mt-4 py-3.5 rounded-xl font-medium text-sm transition-all bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {loadingText}
              </>
            ) : (
              <> <Scale size={16} /> {t.button} </>
            )}
          </button>
        )}

        {/* Report */}
        {report && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 text-center">
                <p className="text-2xl font-bold text-red-400">{report.critical_risks?.length || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Critical</p>
              </div>
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 text-center">
                <p className="text-2xl font-bold text-amber-400">{report.moderate_risks?.length || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Moderate</p>
              </div>
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 text-center">
                <p className="text-2xl font-bold text-emerald-400">{report.all_good?.length || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Compliant</p>
              </div>
            </div>

            {/* Critical */}
            {report.critical_risks?.length > 0 && (
              <div>
                <h3 className="text-red-400 font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Critical Risks
                </h3>
                <div className="space-y-2">
                  {report.critical_risks.map((r: any, i: number) => (
                    <RiskCard key={i} item={r} type="critical" />
                  ))}
                </div>
              </div>
            )}

            {/* Moderate */}
            {report.moderate_risks?.length > 0 && (
              <div>
                <h3 className="text-amber-400 font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Moderate Risks
                </h3>
                <div className="space-y-2">
                  {report.moderate_risks.map((r: any, i: number) => (
                    <RiskCard key={i} item={r} type="moderate" />
                  ))}
                </div>
              </div>
            )}

            {/* All Good */}
            {report.all_good?.length > 0 && (
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5">
                <h3 className="text-emerald-400 font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CheckCircle size={14} />
                  All Good
                </h3>
                <div className="space-y-1.5">
                  {report.all_good.map((item: string, i: number) => (
                    <p key={i} className="text-gray-400 text-sm flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">✓</span> {item}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Conclusion */}
            {report.conclusion && (
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">⚖️ Overall Assessment</p>
                <p className="text-gray-300 text-sm leading-relaxed">{report.conclusion}</p>
              </div>
            )}

            {/* Analyze another */}
            <button
              onClick={() => { setReport(null); setFile(null); }}
              className="w-full py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 text-sm transition-all"
            >
              {t.another}
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-10 space-y-2">
          <p className="text-gray-700 text-xs">{t.footer}</p>
          <div className="flex justify-center gap-4 text-xs">
            <a href="/impressum" className="text-gray-600 hover:text-gray-400 transition-colors">
              Impressum
            </a>
            <span className="text-gray-700">·</span>
            <a href="/datenschutz" className="text-gray-600 hover:text-gray-400 transition-colors">
              Datenschutz
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}