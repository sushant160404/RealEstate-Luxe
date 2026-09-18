import React from 'react';
import { LogOut, X, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { AdminUser } from '../../types';

interface AdminLogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLogout: () => void;
  user: AdminUser | null;
}

export function AdminLogoutModal({
  isOpen,
  onClose,
  onConfirmLogout,
  user
}: AdminLogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-sm animate-in fade-in duration-200 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">Sign Out of Admin Console</h3>
              <p className="text-[11px] text-neutral-500">Terminate secure session</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-5 space-y-4">
          <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-center gap-3">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border border-neutral-200"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-sm">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-neutral-900 truncate">{user?.name || 'Administrator'}</p>
              <p className="text-xs text-neutral-500 truncate">{user?.email || 'admin@luxeliving.in'}</p>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                {user?.role || 'Superadmin'}
              </span>
            </div>
          </div>

          <p className="text-xs text-neutral-600 leading-relaxed">
            Are you sure you want to end your executive session? All uncommitted edits will be discarded, and you will need to re-authenticate with your security credentials.
          </p>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Session lock will prevent unauthorized updates to listings and client inquiries.</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            Stay Signed In
          </button>
          <button
            id="confirm-logout-btn"
            onClick={onConfirmLogout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
