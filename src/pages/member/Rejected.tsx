import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { XCircle, LogOut, Mail, MessageCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Logo } from '@/components/shared/Logo';

export default function Rejected() {
  const { user, isAuthenticated, approvalStatus, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    if (approvalStatus === 'approved') {
      navigate('/member/home');
    }
    if (approvalStatus === 'pending') {
      navigate('/pending-approval');
    }
  }, [isAuthenticated, approvalStatus, navigate]);

  if (!user) return null;

  const initials = user.displayName?.split(' ').map((n) => n[0]).join('') || 'U';
  const registeredDate = user.registeredAt
    ? new Date(user.registeredAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '—';

  // Rejection reason would come from the user doc if we had it loaded here
  // For now we show a generic message since authStore doesn't load rejectionReason
  const rejectionReason = 'Your application did not meet our membership criteria at this time.';

  return (
    <div className="min-h-screen bg-workspace-bg flex flex-col">
      {/* Top bar */}
      <div className="h-nav border-b border-workspace-border flex items-center justify-between px-6 lg:px-8">
        <Link to="/">
          <Logo variant="light" size="sm" />
        </Link>
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="flex items-center gap-2 text-sm text-nahkya-text-muted hover:text-nahkya-text transition-colors font-body"
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-nahkya-error/10 border border-nahkya-error/20 rounded-nahkya">
              <XCircle className="w-4 h-4 text-nahkya-error" strokeWidth={1.5} />
              <span className="font-mono text-mono-sm text-nahkya-error uppercase tracking-wider">
                Access Declined
              </span>
            </div>
          </div>

          {/* User card */}
          <div className="bg-workspace-panel border border-workspace-border rounded-nahkya p-6 lg:p-8 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-nahkya-charcoal border border-workspace-border flex items-center justify-center">
                <span className="font-display text-xl text-nahkya-text">{initials}</span>
              </div>
              <div>
                <h2 className="font-display text-heading-sm text-nahkya-text font-medium">
                  {user.displayName}
                </h2>
                <div className="flex items-center gap-1.5 text-nahkya-text-muted">
                  <Mail className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span className="text-sm font-body">{user.email}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-workspace-border">
                <span className="text-sm text-nahkya-text-muted font-body">Registered on</span>
                <span className="text-sm text-nahkya-text font-body">{registeredDate}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-nahkya-text-muted font-body">Status</span>
                <span className="text-sm text-nahkya-error font-body">Declined</span>
              </div>
            </div>
          </div>

          {/* Rejection reason */}
          <div className="bg-workspace-panel border border-nahkya-error/20 rounded-nahkya p-5 mb-8">
            <p className="font-mono text-mono-sm text-nahkya-error uppercase mb-2">
              Reason
            </p>
            <p className="text-sm text-nahkya-text font-body leading-relaxed">
              {rejectionReason}
            </p>
          </div>

          {/* Message */}
          <div className="text-center mb-8">
            <p className="text-body-md text-nahkya-text font-body mb-2">
              We regret to inform you that your application has been declined.
            </p>
            <p className="text-sm text-nahkya-text-muted font-body leading-relaxed">
              If you believe this is an error or would like to appeal, please reach out to our team.
            </p>
          </div>

          {/* Contact */}
          <Link
            to="/contact"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-workspace-panel border border-workspace-border rounded-nahkya text-nahkya-text hover:border-nahkya-gold/30 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-nahkya-gold" strokeWidth={1.5} />
            <span className="text-sm font-body">Contact Us</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
