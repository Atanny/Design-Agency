"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import ConfirmModal from "@/components/ConfirmModal";
import type { Message } from "@/types";

interface EmailSender { id: string; name: string; email: string; is_default: boolean; }

const statusColors: Record<string, string> = {
 new: "bg-blue-500/20 text-blue-400",
 read: "bg-zinc-500/20 text-zinc-400",
 resolved: "bg-emerald-500/20 text-emerald-400",
};

function ReplyModal({
 message,
 senders,
 onClose,
 onSent,
}: {
 message: Message;
 senders: EmailSender[];
 onClose: () => void;
 onSent: () => void;
}) {
 const defaultSender = senders.find((s) => s.is_default) || senders[0];
 const [selectedSender, setSelectedSender] = useState<EmailSender | null>(defaultSender || null);
 const [subject, setSubject] = useState(`Re: Your inquiry to ${defaultSender?.name || "--"}`);
 const [body, setBody] = useState("");
 const [sending, setSending] = useState(false);

 const handleSend = async () => {
 if (!body.trim()) { toast.error("Please write a message."); return; }
 if (!selectedSender) { toast.error("No email sender configured. Add one in Settings."); return; }
 setSending(true);

 const res = await fetch("/api/send-email", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({
 type: "reply",
 fromName: selectedSender.name,
 fromEmail: selectedSender.email,
 toEmail: message.email,
 toName: message.name,
 subject,
 message: body,
 originalMessage: message.message,
 messageId: message.id,
 }),
 });

 const data = await res.json();
 setSending(false);

 if (!res.ok || data.error) {
 toast.error(data.error || "Failed to send email.");
 } else {
 toast.success(`Email sent to ${message.email}!`);
 onSent();
 onClose();
 }
 };

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
 <div className="absolute inset-0 bg-[#080808]/80 backdrop-blur-sm" onClick={onClose} />
 <div className="relative w-full max-w-2xl bg-[#0c0c0c] border border-zinc-800 shadow-2xl z-10">
 <div className="flex items-center justify-between p-5 border-b border-zinc-800/40">
 <h3 className="font-display text-lg font-bold text-white">Reply to {message.name}</h3>
 <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>

 <div className="p-5 space-y-4">
 {/* From dropdown */}
 <div>
 <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2">From</label>
 {senders.length === 0 ? (
 <p className="text-amber-400 text-sm">No senders configured. Go to Settings → Email to add one.</p>
 ) : (
 <select
 value={selectedSender?.id || ""}
 onChange={(e) => {
 const s = senders.find((x) => x.id === e.target.value);
 setSelectedSender(s || null);
 setSubject(`Re: Your inquiry to ${s?.name || ""}`);
 }}
 className="w-full px-3 py-2.5 border border-zinc-800 bg-zinc-800 text-white text-sm focus:outline-none focus:ring-1 focus:border-gold-500/50 focus:ring-0"
 >
 {senders.map((s) => (
 <option key={s.id} value={s.id}>
 {s.name} &lt;{s.email}&gt;{s.is_default ? " (default)" : ""}
 </option>
 ))}
 </select>
 )}
 </div>

 {/* To (read only) */}
 <div>
 <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2">To</label>
 <input
 readOnly
 value={`${message.name} <${message.email}>`}
 className="w-full px-3 py-2.5 border border-zinc-800 bg-zinc-900/50 text-zinc-400 text-sm cursor-not-allowed"
 />
 </div>

 {/* Subject */}
 <div>
 <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2">Subject</label>
 <input
 type="text"
 value={subject}
 onChange={(e) => setSubject(e.target.value)}
 className="w-full px-3 py-2.5 border border-zinc-800 bg-zinc-800 text-white text-sm focus:outline-none focus:ring-1 focus:border-gold-500/50 focus:ring-0"
 />
 </div>

 {/* Original message preview */}
 <div className="p-3 bg-zinc-900/50 border border-zinc-800/60">
 <p className="text-xs text-zinc-500 mb-1">Original message from {message.name}:</p>
 <p className="text-zinc-400 text-sm line-clamp-3">{message.message}</p>
 </div>

 {/* Reply body */}
 <div>
 <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-2">Your Reply *</label>
 <textarea
 value={body}
 onChange={(e) => setBody(e.target.value)}
 placeholder="Type your reply here..."
 rows={7}
 className="w-full px-3 py-2.5 border border-zinc-800 bg-zinc-800 text-white text-sm placeholder-zinc-700 focus:outline-none focus:ring-1 focus:border-gold-500/50 focus:ring-0 resize-none"
 />
 </div>
 </div>

 <div className="flex gap-3 p-5 border-t border-zinc-800/40">
 <button
 onClick={handleSend}
 disabled={sending || senders.length === 0}
 className="flex-1 py-2.5 bg-gold-500 text-white text-sm font-semibold hover:bg-gold-600 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
 >
 {sending ? (
 <>
 <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
 </svg>
 Sending...
 </>
 ) : (
 <>
 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
 </svg>
 Send Email
 </>
 )}
 </button>
 <button
 onClick={onClose}
 className="px-5 py-2.5 border border-zinc-800/60 text-zinc-500 text-sm font-semibold hover:text-white hover:border-zinc-600 transition-all"
 >
 Cancel
 </button>
 </div>
 </div>
 </div>
 );
}

export default function AdminMessages() {
 const [messages, setMessages] = useState<Message[]>([]);
 const [senders, setSenders] = useState<EmailSender[]>([]);
 const [loading, setLoading] = useState(true);
 const [selected, setSelected] = useState<Message | null>(null);
 const [replyTo, setReplyTo] = useState<Message | null>(null);
 const [filter, setFilter] = useState("all");
 const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

 const fetchAll = async () => {
 const [msgRes, senderRes] = await Promise.all([
 supabase.from("messages").select("*").order("created_at", { ascending: false }),
 supabase.from("email_senders").select("*").order("is_default", { ascending: false }),
 ]);
 setMessages((msgRes.data as Message[]) || []);
 setSenders((senderRes.data as EmailSender[]) || []);
 setLoading(false);
 };

 useEffect(() => { fetchAll(); }, []);

 const updateStatus = async (id: string, status: Message["status"]) => {
 await supabase.from("messages").update({ status }).eq("id", id);
 setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
 if (selected?.id === id) setSelected((s) => s && { ...s, status });
 toast.success(`Marked as ${status}`);
 };

 const deleteMessage = async (id: string) => {
 const { error } = await supabase.from("messages").delete().eq("id", id);
 if (error) { toast.error(error.message); return; }
 setMessages((prev) => prev.filter((m) => m.id !== id));
 if (selected?.id === id) setSelected(null);
 toast.success("Message deleted.");
 };

 const filtered = filter === "all" ? messages : messages.filter((m) => m.status === filter);
 const newCount = messages.filter((m) => m.status === "new").length;

 return (
 <div className="p-8 w-full">
 {replyTo && (
 <ReplyModal
 message={replyTo}
 senders={senders}
 onClose={() => setReplyTo(null)}
 onSent={() => updateStatus(replyTo.id, "read")}
 />
 )}

 <div className="flex items-center justify-between mb-6">
 <div>
 <div className="flex items-center gap-3 mb-2">
 <div className="h-px w-8 bg-gold-500" />
 <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-gold-600">Admin</span>
 </div>
 <h1 className="font-display text-4xl font-black text-white tracking-tight leading-none">Messages</h1>
 <p className="text-zinc-500 mt-0.5">
 {newCount > 0 ? <span className="text-blue-400 font-medium">{newCount} new</span> : "No new messages"}
 </p>
 </div>
 <div className="flex gap-2">
 {["all", "new", "read", "resolved"].map((f) => (
 <button
 key={f}
 onClick={() => setFilter(f)}
 className={`px-3 py-1.5 text-xs font-bold tracking-wide uppercase transition-all ${
 filter === f ? "bg-gold-500 text-white" : "border border-zinc-800/60 text-zinc-500 hover:text-white"
 }`}
 >
 {f}{f === "new" && newCount > 0 && ` (${newCount})`}
 </button>
 ))}
 </div>
 </div>

 {loading ? (
 <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-zinc-800/60 animate-pulse" />)}</div>
 ) : filtered.length === 0 ? (
 <div className="text-center py-20 text-zinc-600">No messages.</div>
 ) : (
 <div className="grid lg:grid-cols-5 gap-6">
 {/* List */}
 <div className="lg:col-span-2 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
 {filtered.map((msg) => (
 <div
 key={msg.id}
 onClick={() => setSelected(msg)}
 className={`p-4 border cursor-pointer transition-all ${
 selected?.id === msg.id
 ? "border-gold-500 bg-zinc-800"
 : "border-zinc-800 bg-[#0c0c0c] hover:border-zinc-800/60"
 }`}
 >
 <div className="flex items-center justify-between gap-2 mb-1">
 <p className="text-white font-medium text-sm truncate">{msg.name}</p>
 <div className="flex items-center gap-1.5 flex-shrink-0">
 <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[msg.status]}`}>
 {msg.status}
 </span>
 <button
 onClick={(e) => { e.stopPropagation(); setConfirmDelete(msg.id); }}
 className="w-5 h-5 flex items-center justify-center text-zinc-600 hover:text-red-400 transition-colors"
 aria-label="Delete"
 >
 <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
 </svg>
 </button>
 </div>
 </div>
 <p className="text-zinc-400 text-xs truncate">{msg.email}</p>
 <p className="text-zinc-600 text-xs mt-0.5 truncate">{msg.message}</p>
 </div>
 ))}
 </div>

 {/* Detail */}
 <div className="lg:col-span-3">
 {selected ? (
 <div className="p-6 border border-zinc-800 bg-[#0c0c0c] sticky top-6">
 <div className="flex items-start justify-between mb-5">
 <div>
 <h3 className="text-white font-bold text-lg">{selected.name}</h3>
 <p className="text-zinc-400 text-sm">{selected.email}</p>
 </div>
 <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[selected.status]}`}>
 {selected.status}
 </span>
 </div>

 <div className="space-y-4 mb-6">
 {selected.service && (
 <div className="flex gap-8">
 <div>
 <p className="text-xs text-zinc-500 mb-0.5">Service</p>
 <p className="text-zinc-200 text-sm">{selected.service}</p>
 </div>
 {selected.budget && (
 <div>
 <p className="text-xs text-zinc-500 mb-0.5">Budget</p>
 <p className="text-zinc-200 text-sm">{selected.budget}</p>
 </div>
 )}
 </div>
 )}
 <div>
 <p className="text-xs text-zinc-500 mb-1">Message</p>
 <div className="p-4 bg-zinc-800 text-zinc-300 text-sm leading-relaxed">
 {selected.message}
 </div>
 </div>
 <p className="text-zinc-600 text-xs">{new Date(selected.created_at).toLocaleString()}</p>
 </div>

 <div className="flex flex-wrap gap-2">
 <button
 onClick={() => setReplyTo(selected)}
 className="flex items-center gap-1.5 px-4 py-2 bg-gold-500 text-white text-sm font-semibold hover:bg-gold-600 transition-colors"
 >
 <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
 </svg>
 Reply via Email
 </button>
 <button
 onClick={() => updateStatus(selected.id, "read")}
 disabled={selected.status === "read"}
 className="px-3 py-2 border border-zinc-800 text-zinc-400 text-sm hover:text-white disabled:opacity-40 transition-colors"
 >
 Mark Read
 </button>
 <button
 onClick={() => updateStatus(selected.id, "resolved")}
 disabled={selected.status === "resolved"}
 className="px-3 py-2 bg-emerald-500/20 text-emerald-400 text-sm hover:bg-emerald-500/30 disabled:opacity-40 transition-colors"
 >
 Resolve
 </button>
 <button
 onClick={() => setConfirmDelete(selected.id)}
 className="flex items-center gap-1.5 px-3 py-2 bg-red-500/15 text-red-400 text-sm hover:bg-red-500/25 transition-colors ml-auto"
 >
 <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
 </svg>
 Delete
 </button>
 </div>
 </div>
 ) : (
 <div className="p-8 border border-dashed border-zinc-800 flex items-center justify-center text-zinc-600 text-sm h-64">
 Select a message to view details
 </div>
 )}
 </div>
 </div>
 )}
 <ConfirmModal
 open={!!confirmDelete}
 title="Delete Message"
 message="This will permanently remove the message and cannot be undone."
 confirmLabel="Yes, Delete"
 variant="danger"
 onConfirm={() => { if (confirmDelete) { deleteMessage(confirmDelete); setConfirmDelete(null); } }}
 onCancel={() => setConfirmDelete(null)}
 />
 </div>
 );
}
