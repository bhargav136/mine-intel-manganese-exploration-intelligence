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
import { NavigationTab, ExplorationTarget } from './types';

function MainApp() {
  const { user, isLoginModalOpen, openLoginModal, closeLoginModal, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<NavigationTab>('command-center');
  const [targets, setTargets] = useState<ExplorationTarget[]>(TOP_PRIORITY_TARGETS);
  const [verifiedCount, setVerifiedCount] = useState<number>(60);
  const [isAnalyzeModalOpen, setIsAnalyzeModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [apiKeyTab, setApiKeyTab] = useState<'gemini' | 'map'>('gemini');
  const [isPreviousModalOpen, setIsPreviousModalOpen] = useState(false);
  const [isDatabaseModalOpen, setIsDatabaseModalOpen] = useState(false);
  const [inspectingTarget, setInspectingTarget] = useState<ExplorationTarget | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('Balaghat, Madhya Pradesh');

  // If not logged in, render the full Login & Registration page
  if (isLoading) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-400"></div>
          <span className="text-xs text-slate-400 font-medium">Authenticating MINE-INTEL Portal...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage isOpen={true} isFullPage={true} />;
  }

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

  return (
    <div className="flex h-screen w-screen bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onTabChange={setActiveTab}
        onOpenApiKeyModal={handleOpenApiKey}
        onOpenLoginModal={openLoginModal}
        onOpenDatabaseModal={() => setIsDatabaseModalOpen(true)}
      />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Bar */}
        <Header
          onAnalyzeClick={() => setIsAnalyzeModalOpen(true)}
          onViewPreviousClick={() => setIsPreviousModalOpen(true)}
          onOpenApiKeyModal={handleOpenApiKey}
          onOpenLoginModal={openLoginModal}
          onOpenDatabaseModal={() => setIsDatabaseModalOpen(true)}
          selectedRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
        />

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'command-center' && (
            <CommandCenter
              targets={targets}
              clusters={TARGET_CLUSTERS}
              boreholeAssays={BOREHOLE_ASSAYS}
              onOpenFullExplorer={() => setActiveTab('prospectivity-explorer')}
              verifiedCount={verifiedCount}
              onVerifyTarget={handleVerifyTarget}
              onOpenApiKeyModal={handleOpenApiKey}
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

          {activeTab === 'data-health' && <DataHealthView />}
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

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
