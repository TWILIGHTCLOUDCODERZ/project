import { useState, useEffect, useRef } from 'react';
import { X, Mail, Lock, User as UserIcon, Loader2, AlertCircle, KeyRound, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export default function AuthModal({ onClose, initialMode = 'login' }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [signupCode, setSignupCode] = useState('');
  const SIGNUP_CODE = 'DeepanVampire@Tcc';
  const codeValid = signupCode.trim() === SIGNUP_CODE;
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === 'signup') {
        await signUp(email.trim(), password, displayName.trim() || undefined);
      } else {
        const normalizedEmail = email.trim().toLowerCase();
        await signIn(normalizedEmail, password);
        if (normalizedEmail === 'tyson@gmail.com') {
          sessionStorage.setItem('tcc_seller_session', JSON.stringify({
            name: 'Tyson',
            email: 'Tyson@gmail.com',
            role: 'Executive Seller',
          }));
          window.location.href = '/seller/dashboard/home';
          return;
        }
      }
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed.';
      if (message.includes('email-already-in-use')) {
        setError('This email is already registered. Try logging in instead.');
      } else if (message.includes('wrong-password') || message.includes('invalid-credential')) {
        setError('Incorrect email or password.');
      } else if (message.includes('weak-password')) {
        setError('Password should be at least 6 characters.');
      } else if (message.includes('invalid-email')) {
        setError('Please enter a valid email address.');
      } else if (message.includes('configuration-not-found')) {
        setError('Email/Password sign-in is not enabled in Firebase. Go to Firebase Console → Authentication → Sign-in method and enable Email/Password.');
      } else {
        setError(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError(null);
  };

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-primary-900/70 backdrop-blur-sm p-4"
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative bg-[#001845] px-8 py-7">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-4.5 h-4.5 text-white" />
          </button>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-7 h-7 rounded-full border-[1.5px] border-white/30 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-gold-400" />
            </div>
            <p className="text-[13px] font-bold tracking-tight text-white leading-none">TCC RAPTOR</p>
          </div>
          <h2 className="font-display text-2xl font-bold text-white mt-3">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-sm text-white/50 mt-1">
            {mode === 'login'
              ? 'Sign in to access your virtual try-on history and cart.'
              : 'Join TCC RAPTOR to start your virtual try-on experience.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-7 space-y-4">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-semibold tracking-[0.12em] uppercase text-primary-800 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-primary-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-[0.12em] uppercase text-primary-800 mb-2">
                  Signup Code
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    value={signupCode}
                    onChange={(e) => setSignupCode(e.target.value)}
                    placeholder="Enter your signup code"
                    className={`w-full pl-11 pr-11 py-3.5 bg-neutral-50 border rounded-xl text-sm text-primary-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                      signupCode.length === 0
                        ? 'border-neutral-200 focus:ring-accent-500'
                        : codeValid
                          ? 'border-success-400 focus:ring-success-500'
                          : 'border-error-300 focus:ring-error-500'
                    }`}
                  />
                  {signupCode.length > 0 && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {codeValid ? (
                        <CheckCircle2 className="w-4 h-4 text-success-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-error-400" />
                      )}
                    </div>
                  )}
                </div>
                {!codeValid && (
                  <p className="mt-2 text-xs text-neutral-500 leading-relaxed">
                    A signup code is required to create an account. To request access, contact{' '}
                    <a
                      href="mailto:deepanrey@gmail.com"
                      className="font-semibold text-accent-600 hover:text-accent-700 transition-colors"
                    >
                      deepanrey@gmail.com
                    </a>
                  </p>
                )}
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold tracking-[0.12em] uppercase text-primary-800 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full pl-11 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-primary-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-[0.12em] uppercase text-primary-800 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'At least 6 characters' : 'Enter your password'}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className="w-full pl-11 pr-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-primary-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 bg-error-50 border border-error-200 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-error-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-error-700">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || (mode === 'signup' && !codeValid)}
            className="w-full flex items-center justify-center gap-2 py-4 bg-[#003B7A] text-white text-sm font-bold rounded-xl hover:bg-[#002b5c] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#003B7A]"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {mode === 'login' ? 'Signing in…' : 'Creating account…'}
              </>
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>

          <p className="text-center text-sm text-neutral-500">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={switchMode}
              className="font-semibold text-[#003B7A] hover:text-[#002b5c] transition-colors"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
