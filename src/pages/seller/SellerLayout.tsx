import { useState, type ReactNode } from 'react';
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, BarChart3, TrendingUp, DollarSign, Bot, CheckSquare,
  LogOut, Menu, X, TrendingUp as Logo,
} from 'lucide-react';
import { useSellerAuth } from '../../context/SellerAuthContext';

const navItems = [
  { path: '/seller/dashboard/home', label: 'Seller Home', icon: LayoutDashboard },
  { path: '/seller/dashboard/performance', label: 'Sales Performance', icon: BarChart3 },
  { path: '/seller/dashboard/forecast', label: 'AI Forecast', icon: TrendingUp },
  { path: '/seller/dashboard/pricing', label: 'Dynamic Pricing', icon: DollarSign },
  { path: '/seller/dashboard/copilot', label: 'AI Copilot', icon: Bot },
  { path: '/seller/dashboard/actions', label: 'Actions', icon: CheckSquare },
];

export default function SellerLayout({ children }: { children?: ReactNode }) {
  const { seller, logOut } = useSellerAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!seller) return <Navigate to="/" replace />;

  const handleLogOut = () => {
    logOut();
    navigate('/');
  };

  const activeIndex = navItems.findIndex((item) => location.pathname === item.path);

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex w-64 bg-[#001845] flex-col fixed inset-y-0 left-0 z-40">
        <SidebarContent activeIndex={activeIndex} onNavigate={(p) => { navigate(p); setSidebarOpen(false); }} seller={seller} onLogOut={handleLogOut} />
      </aside>

      {/* Sidebar — mobile drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 inset-y-0 w-64 bg-[#001845] flex flex-col">
            <SidebarContent activeIndex={activeIndex} onNavigate={(p) => { navigate(p); setSidebarOpen(false); }} seller={seller} onLogOut={handleLogOut} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-neutral-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display text-lg font-bold text-primary-900">
                {activeIndex >= 0 ? navItems[activeIndex].label : 'Seller Dashboard'}
              </h1>
              <p className="text-xs text-neutral-400">AI-Powered Seller Command Center</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-primary-900">{seller.name}</p>
              <p className="text-xs text-neutral-400">{seller.role}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gold-400/20 border border-gold-400/40 flex items-center justify-center text-sm font-bold text-gold-600">
              {seller.name.charAt(0)}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  activeIndex, onNavigate, seller, onLogOut,
}: {
  activeIndex: number;
  onNavigate: (path: string) => void;
  seller: { name: string; email: string; role: string };
  onLogOut: () => void;
}) {
  return (
    <>
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gold-400/20 border border-gold-400/40 flex items-center justify-center">
            <Logo className="w-4 h-4 text-gold-400" />
          </div>
          <div>
            <p className="font-display text-sm font-bold text-white leading-none">TCC RAPTOR</p>
            <p className="text-[10px] text-white/50 mt-0.5">Seller Command Center</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const active = idx === activeIndex;
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'bg-accent-600 text-white shadow-lg shadow-accent-600/20'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-4.5 h-4.5 flex-shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <div className="px-3 py-2 mb-2">
          <p className="text-xs font-semibold text-white/80 truncate">{seller.email}</p>
        </div>
        <button
          onClick={onLogOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-error-500/20 transition-all"
        >
          <LogOut className="w-4.5 h-4.5" />
          Sign Out
        </button>
      </div>
    </>
  );
}
