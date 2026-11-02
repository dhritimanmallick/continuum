import React from 'react';
import { 
  Users, 
  ShieldCheck, 
  Building2, 
  Mail, 
  CheckCircle2, 
  UserCheck 
} from 'lucide-react';
import { store } from '../services/store';

export const UsersView: React.FC = () => {
  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Hospital Staff & Role Access</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Role-based access control (RBAC) across clerks, nursing stations, clinical leads and pathology users.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {store.users.map(u => (
          <div key={u.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm">
                  {u.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{u.name}</h3>
                  <span className="text-[11px] text-slate-500">{u.department}</span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded bg-teal-50 border border-teal-200 text-teal-800 font-bold text-[10px]">
                {u.role.replace('_', ' ')}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg space-y-1.5 text-slate-600 text-[11px]">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{u.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>District Hospital Hubballi</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">ID: {u.id}</span>
              {store.currentUser.id === u.id ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Active Session</span>
                </span>
              ) : (
                <button
                  onClick={() => store.setCurrentUser(u)}
                  className="text-teal-700 hover:underline font-semibold cursor-pointer"
                >
                  Switch to this user
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
