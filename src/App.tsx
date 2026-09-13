import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CommandCenter } from './components/CommandCenter';
import { AnalyzeAreaView } from './components/AnalyzeAreaView';
import { ProspectivityExplorerView } from './components/ProspectivityExplorerView';
import { FieldVerificationView } from './components/FieldVerificationView';
import { ProductionIntelligenceView } from './components/ProductionIntelligenceView';
import { CorrectiveActionsView } from './components/CorrectiveActionsView';
import { ReportsImpactView } from './components/ReportsImpactView';
import { DataHealthView } from './components/DataHealthView';
import { AnalyzeAreaModal } from './components/AnalyzeAreaModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { TargetDetailModal } from './components/TargetDetailModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { PreviousAnalysesModal } from './components/PreviousAnalysesModal';
import { LoginPage } from './components/LoginPage';
import { LandingPage } from './components/LandingPage';
import { DatabaseModal } from './components/DatabaseModal';
import { AuthProvider, useAuth } from './context/AuthContext';

import {
  TOP_PRIORITY_TARGETS,
  TARGET_CLUSTERS,
  MOIL_MINE_SITES,
  CURRENT_CONSTRAINTS,
  CORRECTIVE_ACTIONS,
  BOREHOLE_ASSAYS,
} from './data/mockData';
import { ProjectOverviewView } from './components/ProjectOverviewView';
import { SourceCodeView } from './components/SourceCodeView';
import { NavigationTab, ExplorationTarget } from './types';

function DashboardView({ onOpenShowcase }: { onOpenShowcase?: () => void }) {
  const { user, isLoginModalOpen, openLoginModal, closeLoginModal } = useAuth();
  const [activeTab, setActiveTab] = useState<NavigationTab>('project-overview');
  const [targets, setTargets] = useState<ExplorationTarget[]>(TOP_PRIORITY_TARGETS);
  const [verifiedCount, setVerifiedCount] = useState<number>(60);
  const [isAnalyzeModalOpen, setIsAnalyzeModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [apiKeyTab, setApiKeyTab] = useState<'gemini' | 'map'>('gemini');
  const [isPreviousModalOpen, setIsPreviousModalOpen] = useState(false);
  const [isDatabaseModalOpen, setIsDatabaseModalOpen] = useState(false);
  const [inspectingTarget, setInspectingTarget] = useState<ExplorationTarget | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('Balaghat, Madhya Pradesh');

  // Sync with central database on mount
  useEffect(() => {
    fetch('/api/targets/verified')
      .then((res) => res.json())
      .then((dbVerified) => {
        if (Array.isArray(dbVerified) && dbVerified.length > 0) {
          const verifiedIds = new Set(dbVerified.map((v: any) => v.targetId));
          setTargets((prev) =>
            prev.map((t) => (verifiedIds.has(t.id) ? { ...t, fieldStatus: 'Verified' } : t))
          );
        }
      })
      .catch(() => {});
  }, []);

  const handleVerifyTarget = async (targetId: string) => {
    setTargets((prev) =>
      prev.map((t) => {
        if (t.id === targetId) {
          return { ...t, fieldStatus: 'Verified' };
        }
        return t;
      })
    );
    setVerifiedCount((prev) => Math.min(100, prev + 1));

    // Persist to central geodatabase
    try {
      await fetch('/api/targets/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetId,
          verifiedBy: user?.name || 'Dr. Alok Sharma',
          notes: `Borehole core logged & verified in Sausar Formation with ${user?.role || 'Senior Geologist'}.`,
          assayGradeMn: 43.2,
          depthMeters: 31.5,
        }),
      });
    } catch (e) {
      console.error('Failed to persist target verification:', e);
    }
  };

  const handleCompleteScan = () => {
    setTargets((prev) =>
      prev.map((t) => ({
        ...t,
        confidence: Math.min(0.98, t.confidence + 0.02),
        estimatedReserveMT: Math.round(t.estimatedReserveMT * 1.05),
      }))
    );
  };

  const handleRestoreAnalysis = (analysisId: string) => {
    setTargets(TOP_PRIORITY_TARGETS);
  };

  const handleOpenApiKey = (tab?: 'gemini' | 'map') => {
    setApiKeyTab(tab || 'gemini');
    setIsApiKeyModalOpen(true);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-screen bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans antialiased">
      {/* Collapsible Sidebar Navigation */}
      {isSidebarOpen && (
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onTabChange={setActiveTab}
          selectedRegion={selectedRegion}
        />
      )}

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Bar */}
        <Header
          onAnalyzeClick={() => setIsAnalyzeModalOpen(true)}
          onViewPreviousClick={() => setIsPreviousModalOpen(true)}
          selectedRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'project-overview' && (
            <ProjectOverviewView onNavigateTab={setActiveTab} />
          )}

          {activeTab === 'command-center' && (
            <CommandCenter
              targets={targets}
              clusters={TARGET_CLUSTERS}
              boreholeAssays={BOREHOLE_ASSAYS}
              onOpenFullExplorer={() => setActiveTab('prospectivity-explorer')}
              verifiedCount={verifiedCount}
              onVerifyTarget={handleVerifyTarget}
              onNavigateToProduction={() => setActiveTab('production-intelligence')}
              selectedRegion={selectedRegion}
            />
          )}

          {activeTab === 'analyze-area' && (
            <AnalyzeAreaView onRunScan={() => setIsAnalyzeModalOpen(true)} />
          )}

          {activeTab === 'prospectivity-explorer' && (
            <ProspectivityExplorerView
              targets={targets}
              onSelectTarget={(t) => setInspectingTarget(t)}
            />
          )}

          {activeTab === 'field-verification' && (
            <FieldVerificationView
              targets={targets}
              boreholeAssays={BOREHOLE_ASSAYS}
              onVerifyTarget={handleVerifyTarget}
              verifiedCount={verifiedCount}
            />
          )}

          {activeTab === 'production-intelligence' && (
            <ProductionIntelligenceView
              mineSites={MOIL_MINE_SITES}
              constraints={CURRENT_CONSTRAINTS}
              onNavigateToCorrectiveActions={() => setActiveTab('corrective-actions')}
            />
          )}

          {activeTab === 'corrective-actions' && (
            <CorrectiveActionsView initialActions={CORRECTIVE_ACTIONS} />
          )}

          {activeTab === 'reports-impact' && <ReportsImpactView />}
        </main>
      </div>

      {/* Area Analysis Modal */}
      <AnalyzeAreaModal
        isOpen={isAnalyzeModalOpen}
        onClose={() => setIsAnalyzeModalOpen(false)}
        onCompleteScan={handleCompleteScan}
      />

      {/* Inversion History Modal */}
      <PreviousAnalysesModal
        isOpen={isPreviousModalOpen}
        onClose={() => setIsPreviousModalOpen(false)}
        onRestoreAnalysis={handleRestoreAnalysis}
      />

      {/* API Key Modal for Gemini & Satellite Map */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        initialTab={apiKeyTab}
      />

      {/* Central Database Management Modal */}
      <DatabaseModal
        isOpen={isDatabaseModalOpen}
        onClose={() => setIsDatabaseModalOpen(false)}
      />

      {/* Authentication / Login Modal */}
      <LoginPage
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
      />

      {/* Target Inspector Modal if opened from table */}
      {inspectingTarget && (
        <TargetDetailModal
          target={inspectingTarget}
          onClose={() => setInspectingTarget(null)}
          boreholeAssay={BOREHOLE_ASSAYS.find(
            (b) => b.targetId === inspectingTarget.id
          )}
          onVerifyTarget={handleVerifyTarget}
        />
      )}

      {/* Floating Gemini AI Assistant with Direct Key Trigger */}
      <AiAssistantModal onOpenApiKeyModal={() => handleOpenApiKey('gemini')} />
    </div>
  );
}

function MainApp() {
  const { user, isLoading } = useAuth();
  // Starts directly on the public showcase as requested:
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'register' | 'dashboard'>('home');

  // When user logs out, return to login page as requested
  useEffect(() => {
    const handleLogout = () => setCurrentView('login');
    window.addEventListener('mine_intel_logout', handleLogout);
    return () => window.removeEventListener('mine_intel_logout', handleLogout);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-[#f5f8fd] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          <span className="text-xs text-slate-500 font-medium">Loading MOIL MINE-INTEL...</span>
        </div>
      </div>
    );
  }

  // Once authenticated and in dashboard view, render full Dashboard with all components
  if (currentView === 'dashboard' && user) {
    return <DashboardView onOpenShowcase={() => setCurrentView('home')} />;
  }

  // If user navigated to Login page
  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-[#f5f8fd] flex flex-col">
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-50">
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm">
              M
            </div>
            <span className="font-bold text-slate-900 text-base">MINE-INTEL</span>
          </button>
          <button
            onClick={() => setCurrentView('home')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            &larr; Back to Showcase
          </button>
        </header>
        <main className="flex-1 flex items-center justify-center p-4">
          <LoginPage
            isOpen={true}
            isFullPage={true}
            initialTab="signin"
            onSuccess={() => setCurrentView('dashboard')}
            onClose={() => setCurrentView('home')}
            onViewLanding={() => setCurrentView('home')}
          />
        </main>
      </div>
    );
  }

  // If user navigated to Register page
  if (currentView === 'register') {
    return (
      <div className="min-h-screen bg-[#f5f8fd] flex flex-col">
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-50">
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm">
              M
            </div>
            <span className="font-bold text-slate-900 text-base">MINE-INTEL</span>
          </button>
          <button
            onClick={() => setCurrentView('home')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            &larr; Back to Showcase
          </button>
        </header>
        <main className="flex-1 flex items-center justify-center p-4">
          <LoginPage
            isOpen={true}
            isFullPage={true}
            initialTab="signup"
            onSuccess={() => setCurrentView('dashboard')}
            onClose={() => setCurrentView('home')}
            onViewLanding={() => setCurrentView('home')}
          />
        </main>
      </div>
    );
  }

  // Default: Starts directly from Public Showcase!
  return (
    <LandingPage
      onOpenLogin={() => {
        if (user) {
          setCurrentView('dashboard');
        } else {
          setCurrentView('login');
        }
      }}
      onOpenRegister={() => {
        // "when we click on get started it goes to the login page after that all components will open"
        if (user) {
          setCurrentView('dashboard');
        } else {
          setCurrentView('login');
        }
      }}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
