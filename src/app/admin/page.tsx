'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/context/AuthContext';
import {
  Users,
  Coins,
  Film,
  Activity,
  History,
  ShieldCheck,
  Search,
  PlusCircle,
  MinusCircle,
  ExternalLink,
  RefreshCw,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';

interface UserRow {
  id: string;
  email: string;
  name: string;
  avatar: string;
  credits: number;
  created_at: string;
  updated_at: string;
}

interface TransactionRow {
  id: number;
  user_id: string;
  amount: number;
  type: string;
  description: string | null;
  ref_id: string | null;
  created_at: string;
}

interface VideoRow {
  id: number;
  user_id: string;
  stage: string;
  audio_beat: string;
  lyrics_topic: string | null;
  photo1?: string | null;
  photo2?: string | null;
  status: string;
  video_url: string | null;
  cost_credits: number;
  created_at: string;
}

interface AdminData {
  stats: {
    totalUsers: number;
    totalCreditsInCirculation: number;
    totalPurchasedCredits: number;
    totalGeneratedVideos: number;
  };
  users: UserRow[];
  transactions: TransactionRow[];
  videos: VideoRow[];
}

export default function AdminPage() {
  const { user, openAuthModal } = useAuth();
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'transactions' | 'videos'>('users');
  const [searchQuery, setSearchQuery] = useState('');

  // 积分调整弹窗状态
  const [adjustTargetUser, setAdjustTargetUser] = useState<UserRow | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<string>('');
  const [adjustReason, setAdjustReason] = useState<string>('');
  const [adjusting, setAdjusting] = useState(false);
  const [actionMsg, setActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/overview');
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustCredits = async () => {
    if (!adjustTargetUser) return;
    const amountNum = parseInt(adjustAmount, 10);
    if (isNaN(amountNum) || amountNum === 0) {
      setActionMsg({ type: 'error', text: 'Please enter a valid non-zero amount.' });
      return;
    }

    setAdjusting(true);
    setActionMsg(null);
    try {
      const res = await fetch('/api/admin/adjust-credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: adjustTargetUser.id,
          amount: amountNum,
          reason: adjustReason || 'Admin Manual Credit Adjustment',
        }),
      });
      const json = await res.json();
      if (json.success) {
        setActionMsg({
          type: 'success',
          text: `Successfully updated credits for ${adjustTargetUser.name || adjustTargetUser.email}! New balance: ${json.user.credits}`,
        });
        setAdjustAmount('');
        setAdjustReason('');
        loadOverview();
        setTimeout(() => setAdjustTargetUser(null), 1500);
      } else {
        setActionMsg({ type: 'error', text: json.error || 'Failed to adjust credits' });
      }
    } catch (e: any) {
      setActionMsg({ type: 'error', text: e.message || 'Network error' });
    } finally {
      setAdjusting(false);
    }
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  const filteredUsers = (data?.users || []).filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.email?.toLowerCase().includes(q) ||
      u.name?.toLowerCase().includes(q) ||
      u.id?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F3F4F6]">
      <Navbar />
      <AuthModal />

      <main className="mx-auto max-w-7xl py-10 px-4 sm:px-6">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222533] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-[#FF6A00] p-1.5 text-black">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-black text-white">
                PhotoToRap Master Admin
              </h1>
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Full control over registered users, credits circulation, Stripe purchases & video jobs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadOverview}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-xl border border-[#222533] bg-[#12141C] px-3.5 py-2 text-xs font-bold text-gray-300 hover:text-white hover:border-[#FF6A00] transition-colors"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-[#FF6A00]' : ''}`} />
              <span>Refresh</span>
            </button>
            <Link
              href="/account"
              className="rounded-xl bg-[#FF6A00] px-4 py-2 text-xs font-bold text-black shadow-lg shadow-[#FF6A00]/25 hover:bg-[#FF7D1A] transition-colors"
            >
              My Creator Account
            </Link>
          </div>
        </div>

        {/* 4 Core Stat Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-2xl border border-[#222533] bg-[#12141C] p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Users</span>
              <Users className="h-4 w-4 text-[#FF6A00]" />
            </div>
            <p className="font-display text-3xl font-black text-white mt-3">
              {loading ? '...' : data?.stats.totalUsers || 0}
            </p>
            <p className="text-[11px] text-gray-500 mt-1">Google OAuth registered creators</p>
          </div>

          <div className="rounded-2xl border border-[#222533] bg-[#12141C] p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Credits In Circulation</span>
              <Coins className="h-4 w-4 text-amber-400" />
            </div>
            <p className="font-display text-3xl font-black text-white mt-3">
              {loading ? '...' : data?.stats.totalCreditsInCirculation || 0}
            </p>
            <p className="text-[11px] text-gray-500 mt-1">Total active balance across all users</p>
          </div>

          <div className="rounded-2xl border border-[#222533] bg-[#12141C] p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Purchased Credits</span>
              <Activity className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="font-display text-3xl font-black text-white mt-3">
              {loading ? '...' : data?.stats.totalPurchasedCredits || 0}
            </p>
            <p className="text-[11px] text-gray-500 mt-1">Credits granted via Stripe checkout</p>
          </div>

          <div className="rounded-2xl border border-[#222533] bg-[#12141C] p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Generated Videos</span>
              <Film className="h-4 w-4 text-purple-400" />
            </div>
            <p className="font-display text-3xl font-black text-white mt-3">
              {loading ? '...' : data?.stats.totalGeneratedVideos || 0}
            </p>
            <p className="text-[11px] text-gray-500 mt-1">Total rap videos rendered</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-10 flex items-center justify-between border-b border-[#222533] pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('users')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-colors ${
                activeTab === 'users'
                  ? 'bg-[#FF6A00] text-black shadow-md'
                  : 'bg-[#12141C] text-gray-400 hover:text-white border border-[#222533]'
              }`}
            >
              Users & Balances ({data?.users.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-colors ${
                activeTab === 'transactions'
                  ? 'bg-[#FF6A00] text-black shadow-md'
                  : 'bg-[#12141C] text-gray-400 hover:text-white border border-[#222533]'
              }`}
            >
              All Transactions ({data?.transactions.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-colors ${
                activeTab === 'videos'
                  ? 'bg-[#FF6A00] text-black shadow-md'
                  : 'bg-[#12141C] text-gray-400 hover:text-white border border-[#222533]'
              }`}
            >
              Video Tasks ({data?.videos.length || 0})
            </button>
          </div>

          {activeTab === 'users' && (
            <div className="relative w-64 hidden sm:block">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search user name/email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-[#222533] bg-[#12141C] py-1.5 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:border-[#FF6A00] focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Tab 1: Users Table */}
        {activeTab === 'users' && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-[#222533] bg-[#12141C]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#222533] bg-[#0E1017] text-gray-400 font-bold">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">User ID</th>
                    <th className="p-4">Credits Balance</th>
                    <th className="p-4">Registered At</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1D202C]">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-[#181B26]/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar || '/examples/friends.jpg'}
                            alt=""
                            className="h-9 w-9 rounded-xl object-cover border border-[#222533]"
                          />
                          <div>
                            <p className="font-bold text-white text-sm">{u.name || 'Anonymous'}</p>
                            <p className="text-gray-400 text-[11px]">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-[11px] text-gray-500 truncate max-w-[140px]">
                        {u.id}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FF6A00]/15 px-3 py-1 font-mono font-bold text-[#FF6A00] text-xs border border-[#FF6A00]/30">
                          <Coins className="h-3 w-3" />
                          {u.credits} Cr
                        </span>
                      </td>
                      <td className="p-4 text-gray-400 text-[11px]">
                        {formatDate(u.created_at)}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setAdjustTargetUser(u);
                            setActionMsg(null);
                          }}
                          className="rounded-lg border border-[#222533] bg-[#0E1017] px-3 py-1.5 text-xs font-bold text-gray-200 hover:border-[#FF6A00] hover:text-[#FF6A00] transition-colors"
                        >
                          Adjust Credits
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Transactions Table */}
        {activeTab === 'transactions' && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-[#222533] bg-[#12141C]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#222533] bg-[#0E1017] text-gray-400 font-bold">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">User ID</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1D202C]">
                  {(data?.transactions || []).map((t) => (
                    <tr key={t.id} className="hover:bg-[#181B26]/50 transition-colors">
                      <td className="p-4 font-mono text-gray-500">#{t.id}</td>
                      <td className="p-4 font-mono text-gray-400 truncate max-w-[140px]">
                        {t.user_id}
                      </td>
                      <td className="p-4">
                        <span className="font-mono uppercase text-[10px] rounded bg-[#0A0C13] px-2 py-0.5 border border-[#222533] text-gray-300">
                          {t.type}
                        </span>
                      </td>
                      <td className="p-4 text-gray-300 max-w-xs truncate">
                        {t.description || '-'}
                      </td>
                      <td className="p-4">
                        {t.amount > 0 ? (
                          <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
                            <ArrowDownLeft className="h-3.5 w-3.5" />
                            +{t.amount} Cr
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-bold text-red-400">
                            <ArrowUpRight className="h-3.5 w-3.5" />
                            {t.amount} Cr
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-gray-400 text-[11px]">
                        {formatDate(t.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Video Generations Table */}
        {activeTab === 'videos' && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-[#222533] bg-[#12141C]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#222533] bg-[#0E1017] text-gray-400 font-bold">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">User ID</th>
                    <th className="p-4">Uploaded Photos</th>
                    <th className="p-4">Stage</th>
                    <th className="p-4">Topic</th>
                    <th className="p-4">Cost</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Video</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1D202C]">
                  {(data?.videos || []).map((v) => (
                    <tr key={v.id} className="hover:bg-[#181B26]/50 transition-colors">
                      <td className="p-4 font-mono text-gray-500">#{v.id}</td>
                      <td className="p-4 font-mono text-gray-400 truncate max-w-[140px]">
                        {v.user_id}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          {v.photo1 ? (
                            <a
                              href={v.photo1}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-[#222533] bg-black hover:border-[#FF6A00] transition-colors"
                              title="Click to view full photo 1"
                            >
                              <img
                                src={v.photo1}
                                alt="Input 1"
                                className="h-full w-full object-cover object-top transition-transform group-hover:scale-110"
                              />
                              <span className="absolute bottom-0 right-0 rounded-tl bg-black/80 px-1 text-[9px] font-bold text-white">
                                1
                              </span>
                            </a>
                          ) : (
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#222533] bg-[#0E1017] text-gray-600">
                              <ImageIcon className="h-4 w-4" />
                            </span>
                          )}

                          {v.photo2 ? (
                            <a
                              href={v.photo2}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-[#222533] bg-black hover:border-[#FF6A00] transition-colors"
                              title="Click to view full photo 2"
                            >
                              <img
                                src={v.photo2}
                                alt="Input 2"
                                className="h-full w-full object-cover object-top transition-transform group-hover:scale-110"
                              />
                              <span className="absolute bottom-0 right-0 rounded-tl bg-black/80 px-1 text-[9px] font-bold text-white">
                                2
                              </span>
                            </a>
                          ) : null}
                        </div>
                      </td>
                      <td className="p-4 capitalize text-white font-medium">
                        {v.stage?.replace('-', ' ')}
                      </td>
                      <td className="p-4 text-gray-300 max-w-xs truncate">
                        {v.lyrics_topic || 'Custom Freestyle'}
                      </td>
                      <td className="p-4 font-mono text-[#FF6A00] font-bold">
                        -{v.cost_credits} Cr
                      </td>
                      <td className="p-4">
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                          {v.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400 text-[11px]">
                        {formatDate(v.created_at)}
                      </td>
                      <td className="p-4 text-right">
                        {v.video_url && (
                          <a
                            href={v.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg border border-[#222533] bg-[#0A0C13] px-2.5 py-1 text-xs font-bold text-[#FF6A00] hover:border-[#FF6A00] transition-colors"
                          >
                            <span>Watch</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Adjust Credits Modal */}
      {adjustTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-[#222533] bg-[#12141C] p-6 shadow-2xl">
            <h3 className="font-display text-lg font-bold text-white">Adjust User Credits</h3>
            <p className="mt-1 text-xs text-gray-400">
              User: <span className="text-white font-bold">{adjustTargetUser.name}</span> ({adjustTargetUser.email})
            </p>
            <p className="mt-0.5 text-xs text-gray-400">
              Current balance: <span className="text-[#FF6A00] font-bold">{adjustTargetUser.credits} Credits</span>
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  Amount (+ to add, - to deduct)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 50 or -10"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="w-full rounded-xl border border-[#222533] bg-[#0A0C13] p-3 text-sm text-white placeholder-gray-600 focus:border-[#FF6A00] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  Reason / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. VIP test gift / refund / manual compensation"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full rounded-xl border border-[#222533] bg-[#0A0C13] p-3 text-sm text-white placeholder-gray-600 focus:border-[#FF6A00] focus:outline-none"
                />
              </div>

              {actionMsg && (
                <div
                  className={`flex items-center gap-2 rounded-xl p-3 text-xs ${
                    actionMsg.type === 'success'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  {actionMsg.type === 'success' ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0" />
                  )}
                  <span>{actionMsg.text}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustTargetUser(null)}
                  className="rounded-xl border border-[#222533] bg-[#0A0C13] px-4 py-2 text-xs font-bold text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAdjustCredits}
                  disabled={adjusting}
                  className="rounded-xl bg-[#FF6A00] px-5 py-2 text-xs font-bold text-black shadow-lg shadow-[#FF6A00]/25 hover:bg-[#FF7D1A] disabled:opacity-50"
                >
                  {adjusting ? 'Saving...' : 'Confirm Update'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
