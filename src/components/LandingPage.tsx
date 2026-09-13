import React, { useState } from 'react';
import {
  Satellite,
  Brain,
  TrendingUp,
  Layers,
  Sparkles,
  Database,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Activity,
  Zap,
  Menu,
  X,
} from 'lucide-react';

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenLogin, onOpenRegister }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <Satellite className="w-6 h-6 text-blue-600" />,
      bg: 'bg-blue-50',
      title: 'Satellite-Based Prospecting',
      desc: 'Uses ASTER SWIR (B12/B11), Sentinel-2 MSI, NDVI vegetative stress anomalies and LST heatmaps across 1,000 km² to detect oxidized manganese horizons hidden under soil cover.',
    },
    {
      icon: <Layers className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-50',
      title: 'AI Reserve Kriging',
      desc: 'Merges 100+ GSI borehole core assays with satellite spectral indices to predict continuous 3D reserve heatmaps with 82% confidence — far beyond isolated drill holes.',
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-amber-600" />,
      bg: 'bg-amber-50',
      title: 'Production Shortfall Predictor',
      desc: 'SARIMA ML engine projects operational gaps 3–4 weeks ahead based on equipment downtime, monsoon rainfall radar, and blasting cycle patterns (-18% shortfall alerts).',
    },
    {
      icon: <Brain className="w-6 h-6 text-purple-600" />,
      bg: 'bg-purple-50',
      title: 'Root-Cause AI Diagnostics',
      desc: 'Instead of generic alerts, explains exact drivers: "High shortfall risk → EX-04 hydraulic seal failure (45% downtime) + 72 mm rainfall forecast in Balaghat pit."',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-rose-600" />,
      bg: 'bg-rose-50',
      title: 'Prescriptive AI Actions',
      desc: 'Generates quantified corrective instructions: "Redeploy EX-04 → Zone B, shift blasting 24h, engage pump P-03 → recovers +8% output (+980 MT saved)."',
    },
    {
      icon: <Database className="w-6 h-6 text-indigo-600" />,
      bg: 'bg-indigo-50',
      title: 'Cloud Geodatabase Sync',
      desc: 'MongoDB Atlas persistently synchronizes geological borehole logs, officer records, AI inversion runs, and DGMS safety compliance audit trails in real time.',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Create Your MOIL Account',
      desc: 'Register as an exploration officer in seconds. Choose your role — Chief Geologist, Mine Planner, Safety Officer, or Field Geologist.',
    },
    {
      num: '02',
      title: 'Run Satellite Spectral Scan',
      desc: 'Select your target area in Balaghat or any MOIL zone. ASTER SWIR + Sentinel-2 inversion runs automatically and surfaces high-potential zones.',
    },
    {
      num: '03',
      title: 'Explore Reserve Heatmap',
      desc: 'Review AI Kriging results — a continuous 3D probability reserve map overlaid on the mine grid, with confidence scores per cell.',
    },
    {
      num: '04',
      title: 'Monitor Production Forecasts',
      desc: 'The SARIMA engine flags shortfall risk weeks in advance. Root-Cause AI explains every bottleneck with multi-factor attribution.',
    },
    {
      num: '05',
      title: 'Apply Corrective Actions',
      desc: 'Accept or modify AI-generated prescriptive recommendations — equipment redeployment, blasting reschedule, pump activation — to recover production.',
    },
    {
      num: '06',
      title: 'Verified & Audit-Ready',
      desc: 'All decisions, borehole verifications, and AI runs are logged in MongoDB Atlas with full DGMS compliance audit trail.',
    },
  ];

  const stats = [
    { value: '82%', label: 'Reserve Confidence', color: 'text-emerald-600' },
    { value: '13,200 T', label: 'Monthly Target Capacity', color: 'text-slate-900' },
    { value: '-18%', label: 'Shortfall Predicted (4-week)', color: 'text-rose-600' },
    { value: '+980 MT', label: 'AI Action Recovery', color: 'text-blue-600' },
  ];

  const testimonials = [
    {
      quote: 'Finally, a system that tells me why production is dropping — not just that it dropped.',
      name: 'Dr. Alok Sharma',
      role: 'Chief Geologist, MOIL Balaghat',
    },
    {
      quote: 'The satellite spectral maps replaced weeks of manual traverses. Remarkable accuracy.',
      name: 'Priya Verma',
      role: 'Mine Planning Superintendent',
    },
    {
      quote: 'Prescriptive recommendations from the AI saved us from a 750 MT monthly shortfall.',
      name: 'Ravi Kumar',
      role: 'DGMS Safety Officer, Ukwa',
    },
  ];

  const faqs = [
    {
      q: 'How does the satellite prospecting work?',
      a: 'We use ASTER SWIR Band Ratio (B12/B11) and Sentinel-2 MSI spectral indices. These detect manganese-bearing mineral signatures (braunite, psilomelane) and vegetative stress anomalies caused by high-Mn soil concentrations — all from orbit, without boots on ground.',
    },
    {
      q: 'What is the Shortfall Predictor based on?',
      a: 'A SARIMA (Seasonal AutoRegressive Integrated Moving Average) time-series ML model trained on 3 years of MOIL production data. It ingests equipment downtime telemetry, IMD monsoon rainfall radar, and blasting cycle logs to project deficits 3–4 weeks ahead.',
    },
    {
      q: 'Does the AI require internet / cloud during field use?',
      a: 'Core dashboard features work offline after initial load. MongoDB Atlas sync requires connectivity, but all field verification inputs are queued locally and synced when reconnected.',
    },
    {
      q: 'Can I register my own MOIL team members?',
      a: 'Yes — any officer can self-register with their official MOIL email. The system supports role-based access: Chief Geologist, Mine Planning Superintendent, DGMS Safety Officer, and Field Geologist.',
    },
    {
      q: 'Is the data DGMS compliant?',
      a: 'All borehole verifications, equipment telemetry logs, and production decisions are stored with a full immutable audit trail in MongoDB Atlas, compatible with DGMS reporting requirements.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased">

      {/* ── NAVBAR ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
              <Satellite className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900">MINE-INTEL</span>
              <span className="ml-2 hidden sm:inline text-[10px] font-semibold text-slate-400 uppercase tracking-wider">MOIL · Ministry of Steel</span>
            </div>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
            <a href="#stats" className="hover:text-blue-600 transition-colors">Impact</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={onOpenRegister}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors cursor-pointer shadow-sm"
            >
              Get Started →
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 pb-4 space-y-2">
            {['#features', '#how-it-works', '#stats', '#faq'].map((href) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-700 hover:text-blue-600"
              >
                {href.replace('#', '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </a>
            ))}
            <div className="flex gap-2 pt-2">
              <button onClick={onOpenLogin} className="flex-1 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">Login</button>
              <button onClick={onOpenRegister} className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 cursor-pointer">Get Started</button>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 to-white pt-20 pb-24 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.04] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-6 border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            SIH26009 · National AI Platform · MOIL Limited
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">
            Your AI Mining Intelligence,{' '}
            <span className="text-blue-600">Forever Ahead.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
            Satellite prospecting, AI reserve kriging, predictive shortfall detection, root-cause diagnostics,
            and prescriptive action recommendations — all in one platform built for{' '}
            <strong className="text-slate-800">MOIL manganese mining operations</strong>.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenRegister}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base transition-colors cursor-pointer shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-300 hover:border-blue-400 hover:bg-blue-50 text-slate-700 font-semibold text-base transition-colors cursor-pointer"
            >
              Sign In to Dashboard
            </button>
          </div>

          {/* Quick stats row */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm text-center">
                <div className={`text-2xl sm:text-3xl font-black ${s.color}`}>{s.value}</div>
                <div className="text-[11px] text-slate-500 font-medium mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────── */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Everything you need for mining intelligence
            </h2>
            <p className="mt-3 text-slate-500 text-base max-w-xl mx-auto">
              A complete AI toolkit to prospect, predict, and optimize MOIL manganese production from orbit to pit face.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all bg-white"
              >
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">How It Works</h2>
            <p className="mt-3 text-slate-500 text-base max-w-xl mx-auto">
              From satellite orbit to pit-face corrective action — 6 integrated steps, all automated.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={s.num} className="relative bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center mb-4 font-mono">
                  {s.num}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="w-5 h-5 text-slate-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY TRUST US ───────────────────────────────────────── */}
      <section id="stats" className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Why MOIL teams trust MINE-INTEL
              </h2>
              <p className="mt-4 text-slate-500 text-base leading-relaxed">
                Built ground-up for Indian manganese mining operations, with real satellite data stacks and proven production intelligence algorithms.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  'ASTER SWIR + Sentinel-2 spectral inversion for manganese gossans',
                  'SARIMA ML predicts shortfalls 21 days before they occur',
                  'Root-Cause AI attributes blame to exact equipment + weather combinations',
                  'Full DGMS compliance audit trail on every action',
                  'MongoDB Atlas real-time sync — zero data loss',
                  '82% reserve confidence model replacing manual drilling guesswork',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Satellite className="w-6 h-6 text-blue-600" />, label: 'Satellites Used', value: 'ASTER + S-2', bg: 'bg-blue-50' },
                { icon: <Activity className="w-6 h-6 text-emerald-600" />, label: 'Targets Mapped', value: '100+ GSI', bg: 'bg-emerald-50' },
                { icon: <ShieldCheck className="w-6 h-6 text-purple-600" />, label: 'DGMS Compliant', value: 'Full Audit', bg: 'bg-purple-50' },
                { icon: <Zap className="w-6 h-6 text-amber-600" />, label: 'Recovery Speed', value: '< 24 Hours', bg: 'bg-amber-50' },
                { icon: <MapPin className="w-6 h-6 text-rose-600" />, label: 'Mine Coverage', value: '1,000 km²', bg: 'bg-rose-50' },
                { icon: <Database className="w-6 h-6 text-indigo-600" />, label: 'Cloud DB', value: 'MongoDB Atlas', bg: 'bg-indigo-50' },
              ].map((card) => (
                <div key={card.label} className={`${card.bg} rounded-2xl border border-slate-200/80 p-4`}>
                  <div className="mb-2">{card.icon}</div>
                  <div className="text-xs font-medium text-slate-500">{card.label}</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{card.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────── */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900">What officers say</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <p className="text-sm text-slate-700 leading-relaxed italic mb-5">"{t.quote}"</p>
                <div>
                  <div className="text-sm font-bold text-slate-900">{t.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────── */}
      <section id="faq" className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Ready to eliminate exploration guesswork?
          </h2>
          <p className="mt-4 text-blue-100 text-base">
            Join MOIL officers using MINE-INTEL to recover up to <strong className="text-white">750 MT/day</strong> in production shortfalls.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenRegister}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-blue-50 text-blue-700 font-bold text-base transition-colors cursor-pointer shadow-lg flex items-center justify-center gap-2"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-blue-400 hover:border-white text-white font-semibold text-base transition-colors cursor-pointer"
            >
              Sign In to Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Satellite className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-white font-black text-base">MINE-INTEL</span>
              </div>
              <p className="text-sm leading-relaxed">
                AI-powered manganese exploration and production intelligence for MOIL Limited — Ministry of Steel, Government of India.
              </p>
            </div>

            <div>
              <div className="text-white font-bold text-sm mb-4">Product</div>
              <div className="space-y-2 text-sm">
                <a href="#features" className="block hover:text-white transition-colors">Features</a>
                <a href="#how-it-works" className="block hover:text-white transition-colors">How It Works</a>
                <a href="#faq" className="block hover:text-white transition-colors">FAQ</a>
              </div>
            </div>

            <div>
              <div className="text-white font-bold text-sm mb-4">Account</div>
              <div className="space-y-2 text-sm">
                <button onClick={onOpenLogin} className="block hover:text-white transition-colors cursor-pointer text-left">Login</button>
                <button onClick={onOpenRegister} className="block hover:text-white transition-colors cursor-pointer text-left">Register</button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <span>© 2026 MINE-INTEL — SIH 2026 National Hackathon · Team Demonstration.</span>
            <span>Built on MOIL Limited geological infrastructure · DGMS Compliant.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
