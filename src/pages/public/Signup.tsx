import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { LuxuryButton } from '@/components/shared/LuxuryButton';
import { AuthBackground } from '@/components/shared/AuthBackground';
import { useAuthStore } from '@/stores/authStore';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const signup = useAuthStore((s) => s.register);
  const googleLogin = useAuthStore((s) => s.googleLogin);
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/pending-approval');
    }
  }, [isLoading, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Please enter your full name.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPw) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      await signup(email, password, name.trim());
      navigate('/pending-approval');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An account with this email already exists.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-5 py-12">
      <AuthBackground />
      <div className="relative z-content w-full max-w-auth-lg">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-nahkya-text-secondary hover:text-nahkya-highlight transition-colors font-body mb-8">
          <ArrowLeft size={15} strokeWidth={1.5} /> Return to site
        </Link>
        <div className="flex justify-center mb-10">
          <Link to="/">
            <Logo variant="light" size="lg" />
          </Link>
        </div>
        <div className="text-center mb-10">
          <p className="font-mono text-mono-sm text-nahkya-highlight tracking-hero uppercase mb-3">Join the Atelier</p>
          <h1 className="font-display text-4xl text-nahkya-text font-medium leading-tight mb-3">Create your account</h1>
          <p className="text-body-md text-nahkya-text-secondary font-body">Begin your journey of intentional creation</p>
        </div>

        <div className="bg-nahkya-text/60 backdrop-blur-xl border border-nahkya-highlight/10 rounded-nahkya p-8 lg:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-mono text-mono-sm uppercase  text-nahkya-text-secondary mb-3">Full Name</label>
              <div className="relative">
                <User className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-nahkya-text-secondary" strokeWidth={1.5} />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-nahkya-highlight/20 text-nahkya-text font-body text-body-md pb-3 pl-7 focus:outline-none focus:border-nahkya-highlight transition-colors placeholder:text-nahkya-text-secondary/40"
                  placeholder="Your full name" required />
              </div>
            </div>
            <div>
              <label className="block font-mono text-mono-sm uppercase  text-nahkya-text-secondary mb-3">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-nahkya-text-secondary" strokeWidth={1.5} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-nahkya-highlight/20 text-nahkya-text font-body text-body-md pb-3 pl-7 focus:outline-none focus:border-nahkya-highlight transition-colors placeholder:text-nahkya-text-secondary/40"
                  placeholder="you@example.com" required />
              </div>
            </div>
            <div>
              <label className="block font-mono text-mono-sm uppercase  text-nahkya-text-secondary mb-3">Password</label>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-nahkya-text-secondary" strokeWidth={1.5} />
                <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-nahkya-highlight/20 text-nahkya-text font-body text-body-md pb-3 pl-7 pr-10 focus:outline-none focus:border-nahkya-highlight transition-colors placeholder:text-nahkya-text-secondary/40"
                  placeholder="Min. 6 characters" required />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-0 bottom-3 text-nahkya-text-secondary hover:text-nahkya-text transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block font-mono text-mono-sm uppercase  text-nahkya-text-secondary mb-3">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-nahkya-text-secondary" strokeWidth={1.5} />
                <input type={showConfirmPw ? 'text' : 'password'} value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-nahkya-highlight/20 text-nahkya-text font-body text-body-md pb-3 pl-7 pr-10 focus:outline-none focus:border-nahkya-highlight transition-colors placeholder:text-nahkya-text-secondary/40"
                  placeholder="Repeat password" required />
                <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-0 bottom-3 text-nahkya-text-secondary hover:text-nahkya-text transition-colors">
                  {showConfirmPw ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
                </button>
              </div>
            </div>
            {error && <p className="text-body-sm text-nahkya-error font-body text-center">{error}</p>}
            <LuxuryButton type="submit" variant="dark-primary" size="md" loading={loading} className="w-full mt-4">
              Create Account <ArrowRight className="w-4 h-4 ml-2" strokeWidth={1.5} />
            </LuxuryButton>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-nahkya-highlight/10" />
            <span className="font-mono text-body-3xs text-nahkya-text-secondary tracking-widest-alt">OR</span>
            <div className="flex-1 h-px bg-nahkya-highlight/10" />
          </div>

          <button
            type="button"
            onClick={async () => {
              setError('');
              setLoading(true);
              try {
                await googleLogin();
                navigate('/pending-approval');
              } catch {
                setError('Google sign-in failed. Please try again.');
              } finally {
                setLoading(false);
              }
            }}
            className="w-full h-button inline-flex items-center justify-center font-body font-medium uppercase tracking-wide text-body-sm text-nahkya-text border border-nahkya-inverse/10 hover:border-nahkya-inverse/30 transition-all rounded-nahkya"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
        </div>

        <p className="text-center text-sm text-nahkya-text-secondary font-body mt-8">
          Already have an account? <Link to="/login" className="text-nahkya-highlight hover:text-nahkya-border transition-colors font-medium">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
