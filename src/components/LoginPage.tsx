import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Building2,
  CheckCircle2,
  X,
  AlertCircle,
  Database,
  ArrowRight,
  Sparkles,
  KeyRound,
  FileCheck,
} from 'lucide-react';
import { useAuth, AuthUser } from '../context/AuthContext';

interface LoginPageProps {
  isOpen?: boolean;
  onClose?: () => void;
  isFullPage?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  isOpen = true,
  onClose,
  isFullPage = false,
}) => {
  const { user, login, register, switchUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('dr.sharma@moil.in');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'Chief Geologist' | 'Mine Planning Superintendent' | 'DGMS Safety Officer' | 'Field Geologist'>('Field Geologist');
  const [department, setDepartment] = useState('Ukwa Exploration Division');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [demoProfiles, setDemoProfiles] = useState<AuthUser[]>([]);
  const [dbStatus, setDbStatus] = useState<any>(null);

  useEffect(() => {
    // Fetch registered users for 1-click login & DB status
    fetch('/api/auth/users')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDemoProfiles(data);
      })
      .catch(() => {});

    fetch('/api/database/status')
      .then((res) => res.json())
      .then((data) => setDbStatus(data))
      .catch(() => {});
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (activeTab === 'signin') {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.error || 'Authentication failed. Verify credentials.');
        } else if (onClose) {
          onClose();
        }
      } else {
        if (!name || !email) {
          setError('Please complete all required fields.');
          setIsSubmitting(false);
          return;
        }
        const res = await register({ name, email, role, department, password });
        if (!res.success) {
          setError(res.error || 'Registration failed.');
        } else if (onClose) {
          onClose();
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = (profile: AuthUser) => {
    setEmail(profile.email);
    setPassword('password123');
    switchUser(profile);
    if (onClose) onClose();
  };

  return (
    <div
      id="login-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="login-dialog-card"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
      >
        {/* Left Side: MOIL / SIH Brand Panel */}
        <div className="md:w-5/12 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle grid watermark */}
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
                MOIL LIMITED · MINISTRY OF STEEL
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              MINE-INTEL
            </h2>
            <p className="text-xs text-blue-200/80 mt-1 font-medium">
              National AI/ML & Satellite Prospectivity Infrastructure
            </p>

            <div className="mt-6 space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Spectral Mineral Inversion:</strong> ASTER SWIR (B12/B11) & Sentinel-2 manganese gossan mapping.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Production Forecaster:</strong> Predictive SARIMA downtime & 750 MT constraint recovery engine.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Persistent Geodatabase:</strong> Live synchronization with central borehole assay records.
                </span>
              </div>
            </div>
          </div>

          {/* Database Health Pill */}
          <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{dbStatus?.status === 'connected' ? 'Geodatabase Online' : 'Database Ready'}</span>
            </div>
            <span className="font-mono text-[10px] text-slate-400">
              {dbStatus?.verifiedTargetsCount || 3} Verified / 100 Targets
            </span>
          </div>
        </div>

        {/* Right Side: Form & Quick Profile Switcher */}
        <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-slate-50/50">
          <div>
            {/* Header & Close */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {activeTab === 'signin' ? 'Sign in to Security Portal' : 'Register Exploration Officer'}
                </h3>
                <p className="text-xs text-slate-500">
                  Access geological prospectivity grids and mine dispatch telemetry
                </p>
              </div>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Quick 1-Click Persona Login */}
            <div className="mb-5 bg-white rounded-xl border border-slate-200 p-3 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                  Quick Login via MOIL Personas
                </span>
                <span className="text-[10px] text-blue-600 font-semibold">1-Click Auth</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {demoProfiles.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleQuickLogin(p)}
                    className="flex items-center gap-2.5 p-2 rounded-lg border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/60 transition-all text-left group cursor-pointer"
                  >
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-300 group-hover:border-blue-400"
                    />
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-700">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">{p.role}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab switch */}
            <div className="flex border-b border-slate-200 mb-4">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signin');
                  setError(null);
                }}
                className={`pb-2 text-xs font-bold transition-colors cursor-pointer mr-4 ${
                  activeTab === 'signin'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In With Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signup');
                  setError(null);
                }}
                className={`pb-2 text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'signup'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Create New MOIL Account
              </button>
            </div>

            {error && (
              <div className="mb-4 p-2.5 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {activeTab === 'signup' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Dr. Rajeshwari Sengupta"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Operational Role
                      </label>
                      <select
                        value={role}
                        onChange={(e: any) => setRole(e.target.value)}
                        className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
                      >
                        <option value="Chief Geologist">Chief Geologist</option>
                        <option value="Mine Planning Superintendent">Mine Planning Supt.</option>
                        <option value="DGMS Safety Officer">DGMS Safety Officer</option>
                        <option value="Field Geologist">Field Geologist</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Department
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
                        <input
                          type="text"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          placeholder="e.g. Balaghat Mines"
                          className="w-full pl-8 pr-2.5 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="officer@moil.in"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Security Passcode
                  </label>
                  <span className="text-[10px] text-slate-400">Demo: password123</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Authenticating with Central DB...</span>
                ) : (
                  <>
                    <span>{activeTab === 'signin' ? 'Verify & Access System' : 'Create & Access Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Active Session Info if logged in */}
          {user && (
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span className="truncate">
                Signed in as <strong className="text-slate-900">{user.name}</strong> ({user.role})
              </span>
              <button
                type="button"
                onClick={onClose}
                className="text-blue-600 font-bold hover:underline ml-2 shrink-0"
              >
                Continue to Dashboard &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
