import React from 'react';
import {
  Activity,
  Compass,
  Map as MapIcon,
  HardHat,
  TrendingUp,
  FileText,
  Database,
  Wrench,
  Key,
  LogIn,
  User,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { NavigationTab } from '../types';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeTab: NavigationTab;
  onTabChange?: (tab: NavigationTab) => void;
  onSelectTab?: (tab: NavigationTab) => void;
  onOpenApiKeyModal?: (tab?: 'gemini' | 'map') => void;
  onOpenLoginModal?: () => void;
  onOpenDatabaseModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onSelectTab,
  onOpenApiKeyModal,
  onOpenLoginModal,
  onOpenDatabaseModal,
}) => {
  const { user } = useAuth();

  const handleSelect = (tab: NavigationTab) => {
    if (onSelectTab) onSelectTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  const navItems: {
    id: NavigationTab;
    label: string;
    icon: React.ReactNode;
    badge?: string;
    badgeColor?: string;
  }[] = [
    {
      id: 'project-overview',
      label: 'Flow & Architecture',
      icon: <BookOpen className="w-4 h-4" />,
      badge: 'Inputs ➔ Outputs',
      badgeColor: 'bg-blue-100 text-blue-800 font-bold',
    },
    {
      id: 'command-center',
      label: 'Big Reserve Map (GIS)',
      icon: <MapIcon className="w-4 h-4" />,
      badge: 'Leaflet Satellite',
      badgeColor: 'bg-emerald-100 text-emerald-800 font-bold',
    },
    {
      id: 'production-intelligence',
      label: 'Production & Shortfall',
      icon: <TrendingUp className="w-4 h-4" />,
      badge: '-18% Risk Alert',
      badgeColor: 'bg-rose-100 text-rose-800 font-bold',
    },
    {
      id: 'corrective-actions',
      label: 'Recommended Actions',
      icon: <Wrench className="w-4 h-4" />,
      badge: '+980 MT Recovery',
      badgeColor: 'bg-amber-100 text-amber-800 font-bold',
    },
    {
      id: 'prospectivity-explorer',
      label: 'Reserve Estimations',
      icon: <Activity className="w-4 h-4" />,
      badge: '100 Targets',
      badgeColor: 'bg-indigo-100 text-indigo-800',
    },
    {
      id: 'data-health',
      label: '9 System Data Inputs',
      icon: <Database className="w-4 h-4" />,
      badge: 'Active Feeds',
      badgeColor: 'bg-slate-100 text-slate-700 font-bold',
    },
  ];

  return (
    <aside
      id="sidebar-container"
      className="w-64 min-w-[16rem] bg-white border-r border-slate-200 flex flex-col justify-between h-screen shrink-0 select-none"
    >
      <div className="flex-1 overflow-y-auto">
        {/* Logo Header */}
        <div id="sidebar-logo-header" className="px-6 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black tracking-tight text-slate-900 font-sans">
              MINE-INTEL
            </h1>
          </div>
          <p className="text-[10px] tracking-wider text-slate-400 font-semibold uppercase mt-0.5">
            EXPLORE WITH EVIDENCE · MOIL LTD.
          </p>
        </div>

        {/* Navigation Items */}
        <nav id="sidebar-nav" className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 shadow-xs border border-blue-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-blue-600' : 'text-slate-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tight ${
                      item.badgeColor || 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer: User session + Database + Keys */}
      <div className="p-3 border-t border-slate-100 space-y-2">
        {/* User profile card */}
        {user ? (
          <div
            onClick={onOpenLoginModal}
            className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-100/80 transition-colors cursor-pointer flex items-center gap-2.5"
            title="Manage MOIL Credentials"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-300 shrink-0"
            />
            <div className="overflow-hidden flex-1">
              <div className="text-xs font-bold text-slate-900 truncate">{user.name}</div>
              <div className="text-[10px] text-slate-500 truncate">{user.role}</div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenLoginModal}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In to MOIL</span>
          </button>
        )}

        {/* Database & Keys quick action buttons */}
        <div className="grid grid-cols-2 gap-1.5">
          {onOpenDatabaseModal && (
            <button
              id="sidebar-btn-database"
              type="button"
              onClick={onOpenDatabaseModal}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 transition-colors cursor-pointer"
              title="Central Database Connection"
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Geodatabase</span>
            </button>
          )}

          {onOpenApiKeyModal && (
            <button
              id="sidebar-btn-api-key"
              type="button"
              onClick={() => onOpenApiKeyModal('gemini')}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-[11px] font-semibold border border-slate-200 transition-colors cursor-pointer"
              title="Configure Gemini & Map API Keys"
            >
              <Key className="w-3.5 h-3.5 text-blue-600" />
              <span>API Keys</span>
            </button>
          )}
        </div>

        {/* Region Indicator */}
        <div id="sidebar-region-indicator" className="p-2 bg-slate-50 border border-slate-200/80 rounded-lg text-center">
          <div className="text-[11px] font-bold text-slate-800">
            Balaghat, MP (1,000 km²)
          </div>
          <div className="text-[9px] text-slate-500 font-medium">
            Sausar Belt · GSI Stratigraphy
          </div>
        </div>
      </div>
    </aside>
  );
};
