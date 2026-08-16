import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, User, Heart, CheckCircle2, LogOut, LayoutDashboard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AboutModal from './AboutModal';
import AuthModal from './AuthModal';
import AISearchModal from './AISearchModal';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { user, logOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#001845] shadow-[0_1px_0_rgba(255,255,255,0.08),0_4px_24px_rgba(0,0,0,0.25)]'
          : 'bg-[#001845]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-[70px] lg:h-[78px]">

          {/* Left — desktop nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {[
              { to: '/', label: 'Home' },
              { to: '/women', label: 'Women' },
              { to: '/men', label: 'Men' },
            ].map(({ to, label }) => {
              const active = to === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative text-[13px] font-medium tracking-[0.04em] pb-0.5 transition-colors duration-200 group ${
                    active ? 'text-white' : 'text-white/70 hover:text-white'
                  }`}
                >
                  {label}
                  <span
                    className={`absolute left-0 bottom-0 h-[1.5px] bg-gold-400 rounded-full transition-all duration-300 ${
                      active ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 -ml-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Center — TCC RAPTOR brand with glow border */}
          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 select-none group"
          >
            <div className="relative flex items-center gap-2.5 px-5 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm transition-all duration-400 group-hover:border-gold-400/70 group-hover:bg-white/10 group-hover:shadow-[0_0_18px_3px_rgba(212,175,55,0.22),0_0_6px_1px_rgba(212,175,55,0.14)] shadow-[0_0_10px_1px_rgba(212,175,55,0.10)]">
              {/* Animated inner glow ring */}
              <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none ring-1 ring-gold-400/30" />
              <span className="font-display text-[1.1rem] lg:text-[1.25rem] font-extrabold tracking-[0.04em] text-white leading-none group-hover:text-gold-100 transition-colors duration-300">
                TCC RAPTOR
              </span>
              <span className="w-px h-4 bg-white/25 group-hover:bg-gold-400/40 transition-colors duration-300" />
              <span className="font-display text-[0.85rem] lg:text-[0.95rem] font-light tracking-[0.1em] uppercase text-white/65 leading-none group-hover:text-gold-300/80 transition-colors duration-300">
                Try On Store
              </span>
            </div>
          </Link>

          {/* Right — action icons */}
          <div className="flex items-center gap-1">

            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Search"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>
            <button className="hidden sm:flex p-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors" aria-label="Wishlist">
              <Heart className="w-[18px] h-[18px]" />
            </button>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 p-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Account"
                >
                  <div className="w-6 h-6 rounded-full bg-gold-400/20 border border-gold-400/40 flex items-center justify-center text-[10px] font-bold text-gold-300">
                    {(user.displayName || user.email || '?').charAt(0).toUpperCase()}
                  </div>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-neutral-100 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-neutral-100">
                      <p className="text-sm font-semibold text-primary-900 truncate">
                        {user.displayName || 'Member'}
                      </p>
                      <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                    </div>
                    {user.email?.toLowerCase() === 'tyson@gmail.com' && (
                      <button
                        onClick={() => {
                          sessionStorage.setItem('tcc_seller_session', JSON.stringify({
                            name: 'Tyson',
                            email: 'Tyson@gmail.com',
                            role: 'Executive Seller',
                          }));
                          navigate('/seller/dashboard/home');
                        }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-accent-700 hover:bg-accent-50 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Seller Dashboard
                      </button>
                    )}
                    <button
                      onClick={() => { sessionStorage.removeItem('tcc_seller_session'); logOut(); }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => { setAuthMode('login'); setAuthOpen(true); }}
                className="hidden sm:flex p-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Sign in"
              >
                <User className="w-[18px] h-[18px]" />
              </button>
            )}
            <button className="p-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors relative" aria-label="Shopping bag">
              <ShoppingBag className="w-[18px] h-[18px]" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-[14px] h-[14px] bg-gold-400 text-[#001845] text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* About this project */}
            <button
              onClick={() => setAboutOpen(true)}
              className="p-2 rounded-md text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 transition-colors"
              aria-label="About this project"
              title="About This Project"
            >
              <CheckCircle2 className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom border line */}
      <div className="h-px bg-white/10" />

      {/* AI search modal */}
      {searchOpen && <AISearchModal onClose={() => setSearchOpen(false)} />}

      {/* About modal */}
      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} />}

      {/* Auth modal */}
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} initialMode={authMode} />}

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#001845] border-t border-white/10">
          <nav className="flex flex-col">
            {[
              { to: '/', label: 'Home' },
              { to: '/women', label: 'Women' },
              { to: '/men', label: 'Men' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="px-6 py-4 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 border-b border-white/5 transition-colors"
              >
                {label}
              </Link>
            ))}
            <div className="px-6 py-4 flex flex-col gap-4">
              <button className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
                <Heart className="w-4 h-4" /> Wishlist
              </button>
              {user?.email?.toLowerCase() === 'tyson@gmail.com' && (
                <button
                  onClick={() => {
                    sessionStorage.setItem('tcc_seller_session', JSON.stringify({
                      name: 'Tyson',
                      email: 'Tyson@gmail.com',
                      role: 'Executive Seller',
                    }));
                    window.location.href = '/seller/dashboard/home';
                  }}
                  className="flex items-center gap-2 text-sm text-gold-300 hover:text-gold-200 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" /> Seller Dashboard
                </button>
              )}
              {user ? (
                <button
                  onClick={() => logOut()}
                  className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              ) : (
                <button
                  onClick={() => { setAuthMode('login'); setAuthOpen(true); }}
                  className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <User className="w-4 h-4" /> Sign In
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
