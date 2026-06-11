import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, LogOut, Mail, Home, BookOpen, User } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Logo } from '@/components/shared/Logo';
import { cn } from '@/lib/utils';

export default function PendingApproval() {
  const { user, isAuthenticated, isApproved, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    if (isApproved) {
      navigate('/member/home');
    }
  }, [isAuthenticated, isApproved, navigate]);

  if (!user) return null;

  const initials = user.displayName?.split(' ').map((n) => n[0]).join('') || 'U';
  const registeredDate = user.registeredAt
    ? new Date(user.registeredAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '—';

  return (
    <div className="min-h-screen bg-nahkya-bg flex flex-col">
      {/* Top bar */}
      <div className="h-nav border-b border-nahkya-border flex items-center justify-between px-6 lg:px-8">
        <Link to="/">
          <Logo variant="light" size="sm" />
        </Link>
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="flex items-center gap-2 text-sm text-nahkya-text-secondary hover:text-nahkya-text transition-colors font-body"
        >
          <LogOut className="w-4 h-4" strokeWidth={1.5} />
          Sign Out
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Status badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-nahkya-highlight/10 border border-nahkya-highlight/20 rounded-nahkya">
              <Clock className="w-4 h-4 text-nahkya-highlight" strokeWidth={1.5} />
              <span className="font-mono text-mono-sm text-nahkya-highlight uppercase tracking-wider">
                Pending Approval
              </span>
            </div>
          </div>

          {/* User card */}
          <div className="bg-nahkya-surface border border-nahkya-border rounded-nahkya p-6 lg:p-8 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-nahkya-text border border-nahkya-border flex items-center justify-center">
                <span className="font-display text-xl text-nahkya-text">{initials}</span>
              </div>
              <div>
                <h2 className="font-display text-heading-sm text-nahkya-text font-medium">
                  {user.displayName}
                </h2>
                <div className="flex items-center gap-1.5 text-nahkya-text-secondary">
                  <Mail className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span className="text-sm font-body">{user.email}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-nahkya-border">
                <span className="text-sm text-nahkya-text-secondary font-body">Registered on</span>
                <span className="text-sm text-nahkya-text font-body">{registeredDate}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-nahkya-border">
                <span className="text-sm text-nahkya-text-secondary font-body">Account type</span>
                <span className="text-sm text-nahkya-text font-body capitalize">{user.role}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-nahkya-text-secondary font-body">Status</span>
                <span className="text-sm text-nahkya-highlight font-body">Under review</span>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="text-center mb-8">
            <p className="text-body-md text-nahkya-text font-body mb-2">
              Thank you for joining Haus of Nahkya.
            </p>
            <p className="text-sm text-nahkya-text-secondary font-body leading-relaxed">
              Your account is being reviewed by our team. You will receive access to the Atelier once approved.
            </p>
          </div>

          {/* Browse links */}
          <div className="space-y-2">
            <p className="font-mono text-mono-sm text-nahkya-text-secondary uppercase text-center mb-3">
              While you wait
            </p>
            <Link
              to="/"
              className={cn(
                'flex items-center gap-3 px-4 py-3 bg-nahkya-surface border border-nahkya-border',
                'rounded-nahkya text-nahkya-text hover:border-nahkya-highlight/30 transition-colors'
              )}
            >
              <Home className="w-4 h-4 text-nahkya-highlight" strokeWidth={1.5} />
              <span className="text-sm font-body">Explore the homepage</span>
            </Link>
            <Link
              to="/by-nahkya"
              className={cn(
                'flex items-center gap-3 px-4 py-3 bg-nahkya-surface border border-nahkya-border',
                'rounded-nahkya text-nahkya-text hover:border-nahkya-highlight/30 transition-colors'
              )}
            >
              <BookOpen className="w-4 h-4 text-nahkya-highlight" strokeWidth={1.5} />
              <span className="text-sm font-body">Read the journal</span>
            </Link>
            <Link
              to="/membership"
              className={cn(
                'flex items-center gap-3 px-4 py-3 bg-nahkya-surface border border-nahkya-border',
                'rounded-nahkya text-nahkya-text hover:border-nahkya-highlight/30 transition-colors'
              )}
            >
              <User className="w-4 h-4 text-nahkya-highlight" strokeWidth={1.5} />
              <span className="text-sm font-body">Learn about membership</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
