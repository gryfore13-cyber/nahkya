import { useState, useEffect } from 'react';
import { Search, Shield, User as UserIcon, CheckCircle, XCircle, Clock, RotateCcw } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';
import { AdminFilterTabs } from '@/components/admin/AdminFilterTabs';
import type { User as UserType, ApprovalStatus } from '@/types';

type Tab = 'all' | 'pending' | 'approved' | 'rejected';

export default function AdminMembers() {
  const { users, fetchUsers, updateUser } = useUserStore();
  const currentAdmin = useAuthStore((s) => s.user);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [rejectingUser, setRejectingUser] = useState<UserType | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.displayName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'pending' && u.approvalStatus === 'pending') ||
      (activeTab === 'approved' && u.approvalStatus === 'approved') ||
      (activeTab === 'rejected' && u.approvalStatus === 'rejected');
    return matchesSearch && matchesRole && matchesTab;
  });

  const counts = {
    all: users.length,
    pending: users.filter((u) => u.approvalStatus === 'pending').length,
    approved: users.filter((u) => u.approvalStatus === 'approved').length,
    rejected: users.filter((u) => u.approvalStatus === 'rejected').length,
  };

  const roleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return { text: 'Super Admin', icon: Shield, color: 'text-nahkya-highlight' };
      case 'designer':
        return { text: 'Designer', icon: UserIcon, color: 'text-nahkya-success' };
      default:
        return { text: 'Member', icon: UserIcon, color: 'text-nahkya-text-secondary' };
    }
  };

  const statusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case 'pending':
        return {
          text: 'Pending',
          icon: Clock,
          classes: 'bg-nahkya-highlight/10 text-nahkya-highlight border-nahkya-highlight/20',
        };
      case 'approved':
        return {
          text: 'Approved',
          icon: CheckCircle,
          classes: 'bg-nahkya-success/10 text-nahkya-success border-nahkya-success/20',
        };
      case 'rejected':
        return {
          text: 'Rejected',
          icon: XCircle,
          classes: 'bg-nahkya-error/10 text-nahkya-error border-nahkya-error/20',
        };
    }
  };

  const handleApprove = async (user: UserType) => {
    setIsSubmitting(true);
    await updateUser(user.uid, {
      approvalStatus: 'approved',
      approvedAt: new Date().toISOString(),
      approvedBy: currentAdmin?.displayName || currentAdmin?.email || 'Admin',
      rejectionReason: '',
    });
    setIsSubmitting(false);
  };

  const handleReject = async () => {
    if (!rejectingUser) return;
    setIsSubmitting(true);
    await updateUser(rejectingUser.uid, {
      approvalStatus: 'rejected',
      approvedAt: '',
      approvedBy: '',
      rejectionReason: rejectReason.trim() || 'Application declined.',
    });
    setRejectingUser(null);
    setRejectReason('');
    setIsSubmitting(false);
  };

  const handleReapprove = async (user: UserType) => {
    setIsSubmitting(true);
    await updateUser(user.uid, {
      approvalStatus: 'approved',
      approvedAt: new Date().toISOString(),
      approvedBy: currentAdmin?.displayName || currentAdmin?.email || 'Admin',
      rejectionReason: '',
    });
    setIsSubmitting(false);
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'all', label: `All (${counts.all})` },
    { key: 'pending', label: `Pending (${counts.pending})` },
    { key: 'approved', label: `Approved (${counts.approved})` },
    { key: 'rejected', label: `Rejected (${counts.rejected})` },
  ];

  return (
    <div className="p-8 lg:p-12">
      <h1 className="font-display text-display-sm text-nahkya-text font-medium mb-2">Members</h1>
      <p className="text-body-md text-nahkya-text-secondary font-body mb-8">
        Manage registered users, review applications, and control access.
      </p>

      <AdminFilterTabs tabs={tabs} active={activeTab} onChange={(key) => setActiveTab(key as Tab)} className="mb-6" />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-content">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nahkya-text-secondary" strokeWidth={1.5} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members..."
            className="pl-10 pr-4 py-2 bg-nahkya-surface border border-nahkya-border text-nahkya-text text-body-sm rounded-nahkya focus:outline-none focus:border-nahkya-highlight w-full font-body"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 bg-nahkya-surface border border-nahkya-border text-nahkya-text text-body-sm rounded-nahkya focus:outline-none focus:border-nahkya-highlight font-body"
        >
          <option value="all">All Roles</option>
          <option value="member">Member</option>
          <option value="designer">Designer</option>
          <option value="super_admin">Super Admin</option>
        </select>
        <p className="font-mono text-mono-sm text-nahkya-text-secondary uppercase ml-auto">
          {filtered.length} shown
        </p>
      </div>

      {/* Table */}
      <div className="bg-nahkya-surface border border-nahkya-border rounded-nahkya overflow-hidden">
        <div className="hidden lg:grid gap-3 px-5 py-3 border-b-2 border-nahkya-text" style={{ gridTemplateColumns: '1fr 1fr 100px 100px 140px 140px' }}>
          {['Name', 'Email', 'Role', 'Tier', 'Status', 'Actions'].map((h) => (
            <span key={h} className="font-mono text-mono-sm font-medium uppercase text-nahkya-text-secondary">
              {h}
            </span>
          ))}
        </div>
        {filtered.map((u, i) => {
          const rl = roleLabel(u.role);
          const st = statusBadge(u.approvalStatus);
          const StatusIcon = st.icon;
          const RoleIcon = rl.icon;
          return (
            <div
              key={u.uid}
              className={cn(
                'grid gap-3 px-5 py-3.5 items-center',
                i < filtered.length - 1 ? 'border-b border-nahkya-border' : '',
                'hover:bg-nahkya-bg transition-colors'
              )}
              style={{ gridTemplateColumns: '1fr 1fr 100px 100px 140px 140px' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-nahkya-surface-raised border border-nahkya-border flex items-center justify-center">
                  <span className="font-mono text-mono-sm text-nahkya-text">
                    {u.displayName?.split(' ').map((n) => n[0]).join('') || 'U'}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-nahkya-text font-body font-medium block">{u.displayName}</span>
                  <span className="text-xs text-nahkya-text-secondary font-body lg:hidden">{u.email}</span>
                </div>
              </div>
              <span className="text-sm text-nahkya-text font-body hidden lg:block">{u.email}</span>
              <span className="flex items-center gap-1.5">
                <RoleIcon className={cn('w-3.5 h-3.5', rl.color)} strokeWidth={1.5} />
                <span className={cn('font-mono text-mono-sm uppercase', rl.color)}>{rl.text}</span>
              </span>
              <span className="font-mono text-mono-sm text-nahkya-text-secondary uppercase">
                {u.membershipTier}
              </span>
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 px-2 py-1 rounded-nahkya border text-body-3xs font-mono uppercase w-fit',
                  st.classes
                )}
              >
                <StatusIcon className="w-3 h-3" strokeWidth={1.5} />
                {st.text}
              </span>
              <div className="flex items-center gap-2">
                {u.approvalStatus === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(u)}
                      disabled={isSubmitting}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-nahkya-success/10 text-nahkya-success border border-nahkya-success/20 rounded-nahkya text-body-2xs font-body hover:bg-nahkya-success/20 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle className="w-3 h-3" strokeWidth={1.5} />
                      Approve
                    </button>
                    <button
                      onClick={() => { setRejectingUser(u); setRejectReason(''); }}
                      disabled={isSubmitting}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-nahkya-error/10 text-nahkya-error border border-nahkya-error/20 rounded-nahkya text-body-2xs font-body hover:bg-nahkya-error/20 transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-3 h-3" strokeWidth={1.5} />
                      Reject
                    </button>
                  </>
                )}
                {u.approvalStatus === 'rejected' && (
                  <button
                    onClick={() => handleReapprove(u)}
                    disabled={isSubmitting}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-nahkya-highlight/10 text-nahkya-highlight border border-nahkya-highlight/20 rounded-nahkya text-body-2xs font-body hover:bg-nahkya-highlight/20 transition-colors disabled:opacity-50"
                  >
                    <RotateCcw className="w-3 h-3" strokeWidth={1.5} />
                    Re-approve
                  </button>
                )}
                {u.approvalStatus === 'approved' && (
                  <span className="text-body-2xs text-nahkya-text-secondary font-body">
                    {u.approvedAt
                      ? new Date(u.approvedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                      : '—'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center text-nahkya-text-secondary font-body">
            No members found in this category.
          </div>
        )}
      </div>

      {/* Reject Dialog */}
      {rejectingUser && (
        <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setRejectingUser(null)} />
          <div className="relative bg-nahkya-surface border border-nahkya-border rounded-nahkya p-6 w-full max-w-md">
            <h3 className="font-display text-heading-sm text-nahkya-text font-medium mb-2">
              Reject Application
            </h3>
            <p className="text-sm text-nahkya-text-secondary font-body mb-4">
              You are rejecting <strong className="text-nahkya-text">{rejectingUser.displayName}</strong> ({rejectingUser.email}).
            </p>
            <label className="block font-mono text-mono-sm uppercase text-nahkya-text-secondary mb-2">
              Reason (optional)
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Explain why this application is being declined..."
              rows={3}
              className="w-full bg-nahkya-bg border border-nahkya-border text-nahkya-text text-sm rounded-nahkya p-3 focus:outline-none focus:border-nahkya-highlight font-body resize-none mb-4"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setRejectingUser(null)}
                className="px-4 py-2 text-sm text-nahkya-text-secondary font-body hover:text-nahkya-text transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={isSubmitting}
                className="px-4 py-2 bg-nahkya-error text-nahkya-inverse text-sm font-body rounded-nahkya hover:bg-nahkya-error/90 transition-colors disabled:opacity-50"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
