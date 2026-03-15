"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import ConfirmModal from "@/components/ConfirmModal";

interface AdminUser {
  id: string; email: string; created_at: string; last_sign_in_at?: string; role?: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ email:"", password:"" });
  const [adding, setAdding] = useState(false);
  const [resetting, setResetting] = useState<string|null>(null);
  const [confirmState, setConfirmState] = useState<{type:"delete"|"reset"; id:string; email:string} | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.admin?.listUsers?.() || {};
    if (error || !data) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUsers([{ id: user.id, email: user.email||"", created_at: user.created_at, last_sign_in_at: user.last_sign_in_at }]);
    } else {
      setUsers((data.users || []).map((u: { id: string; email?: string; created_at: string; last_sign_in_at?: string }) => ({
        id: u.id, email: u.email||"", created_at: u.created_at, last_sign_in_at: u.last_sign_in_at,
      })));
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error("Email and password required."); return; }
    if (form.password.length < 8) { toast.error("Password must be at least 8 characters."); return; }
    setAdding(true);
    const { error } = await supabase.auth.admin?.createUser?.({
      email: form.email, password: form.password, email_confirm: true,
    }) || {};
    setAdding(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Admin user created!");
      setForm({ email:"", password:"" });
      setShowForm(false);
      fetchUsers();
    }
  };

  const sendReset = async (email: string) => {
    setResetting(email);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });
    setResetting(null);
    if (error) { toast.error(error.message); } else {
      toast.success(`Reset email sent to ${email}`);
    }
  };

  const deleteUser = async (id: string, email: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id === id) { toast.error("Cannot delete your own account."); return; }
    const { error } = await supabase.auth.admin?.deleteUser?.(id) || {};
    if (error) { toast.error(error.message); } else {
      toast.success("User deleted.");
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  return (
    <div className="p-8 w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
          <div className="h-px w-8 bg-gold-500" />
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-gold-600">Admin</span>
        </div>
        <h1 className="font-display text-4xl font-black text-white tracking-tight leading-none">Users</h1>
          <p className="text-zinc-600 text-sm mt-2">Manage admin accounts.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gold-500 text-white text-sm font-bold hover:bg-gold-600 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          Add User
        </button>
      </div>

      <div className="p-4 rounded-xl border border-amber-800/30 bg-amber-900/10 mb-6">
        <p className="text-amber-300 text-sm font-semibold mb-1">⚠️ Service Role Key Required</p>
        <p className="text-amber-200/60 text-xs">User management (create/delete) requires <code className="bg-zinc-800 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> set in your environment. If not set, only your current session will be shown.</p>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="mb-6 p-6 rounded-2xl border border-zinc-800 bg-zinc-900">
          <h2 className="text-white font-semibold mb-4">New Admin User</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Email Address</label>
              <input type="email" value={form.email} onChange={(e)=>setForm(f=>({...f,email:e.target.value}))} placeholder="admin@domain.com" required
                className="w-full px-4 py-2.5 border border-zinc-800 bg-zinc-900 text-white text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-gold-500"/>
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Password (min. 8 chars)</label>
              <input type="password" value={form.password} onChange={(e)=>setForm(f=>({...f,password:e.target.value}))} placeholder="••••••••" required minLength={8}
                className="w-full px-4 py-2.5 border border-zinc-800 bg-zinc-900 text-white text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-gold-500"/>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={adding}
              className="px-6 py-2.5 bg-gold-500 text-white text-sm font-bold hover:bg-gold-600 disabled:opacity-50 transition-colors">
              {adding ? "Creating..." : "Create User"}
            </button>
            <button type="button" onClick={()=>setShowForm(false)}
              className="px-6 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm hover:text-white transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_,i)=><div key={i} className="h-16 rounded-xl bg-zinc-800 animate-pulse"/>)}</div>
      ) : users.length === 0 ? (
        <p className="text-center py-16 text-zinc-600">No users found.</p>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-5 rounded-2xl border border-zinc-800 bg-zinc-900 hover:border-zinc-700 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{user.email}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <p className="text-zinc-500 text-xs">Created {new Date(user.created_at).toLocaleDateString()}</p>
                    {user.last_sign_in_at && <p className="text-zinc-600 text-xs">Last login {new Date(user.last_sign_in_at).toLocaleDateString()}</p>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={()=>setConfirmState({type:'reset', id:user.id, email:user.email})} disabled={resetting===user.email}
                  className="px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 text-xs hover:text-white hover:border-zinc-500 transition-colors disabled:opacity-50">
                  {resetting===user.email ? "Sending..." : "Reset Password"}
                </button>
                <button onClick={()=>setConfirmState({type:'delete', id:user.id, email:user.email})}
                  className="px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 text-xs hover:bg-red-500/25 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmModal
        open={!!confirmState}
        title={confirmState?.type === "delete" ? "Delete User" : "Send Password Reset"}
        message={confirmState?.type === "delete"
          ? `This will permanently delete ${confirmState?.email}. This cannot be undone.`
          : `A password reset email will be sent to ${confirmState?.email}.`}
        confirmLabel={confirmState?.type === "delete" ? "Yes, Delete" : "Send Reset Email"}
        variant={confirmState?.type === "delete" ? "danger" : "warning"}
        onConfirm={() => {
          if (!confirmState) return;
          if (confirmState.type === "delete") deleteUser(confirmState.id, confirmState.email);
          else sendReset(confirmState.email);
          setConfirmState(null);
        }}
        onCancel={() => setConfirmState(null)}
      />
    </div>
  );
}
