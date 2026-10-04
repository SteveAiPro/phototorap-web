'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/context/AuthContext';
import {
  Coins,
  History,
  Film,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  CheckCircle2,
  Calendar,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface TransactionItem {
  id: number;
  amount: number;
  type: string;
  description: string | null;
  ref_id: string | null;
  created_at: string;
}

interface VideoItem {
  id: number;
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

export default function AccountPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<'transactions' | 'videos'>('transactions');
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      openAuthModal();
      return;
    }

    if (user && !user.id.startsWith('usr_')) {
      fetchHistory(user.id);
    }
  }, [user, authLoading]);

  const fetchHistory = async (userId: string) => {
    try {
      setLoadingData(true);
      const res = await fetch(`/api/user/transactions?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions || []);
        setVideos(data.videos || []);
      }
    } catch (err) {
      console.error('Failed to load transaction history', err);
    } finally {
      setLoadingData(false);
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

  const getTransactionBadge = (type: string, amount: number) => {
    if (amount > 0) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/20">
          <ArrowDownLeft className="h-3 w-3" />
          +{amount} Credits
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-0.5 text-[11px] font-bold text-red-400 border border-red-500/20">
          <ArrowUpRight className="h-3 w-3" />
          {amount} Credits
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F3F4F6]">
      <Navbar />
      <AuthModal />

      <main className="mx-auto max-w-5xl py-12 px-4 sm:px-6">
        {/* Header Profile Card */}
        <div className="relative overflow-hidden rounded-3xl border border-[#222533] bg-[#12141C] p-6 sm:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 h-48 w-48 bg-[#FF6A00]/10 blur-[90px] rounded-full pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <img
                src={user?.avatar || '/examples/friends.jpg'}
                alt={user?.name || 'User'}
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover border-2 border-[#222533] shadow-md"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-xl sm:text-2xl font-black text-white">
                    {user?.name || 'Rap Creator'}
                  </h1>
                  <span className="rounded-full bg-[#FF6A00]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#FF6A00] border border-[#FF6A00]/30">
                    Active Creator
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1 font-mono">{user?.email}</p>
                <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  Supabase Authenticated & Encrypted
                </p>
              </div>
            </div>

            {/* Credit Balance Card */}
            <div className="flex items-center gap-4 rounded-2xl border border-[#222533] bg-[#0A0C13] p-4 sm:p-5">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold block">
                  Available Balance
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <Coins className="h-6 w-6 text-[#FF6A00]" />
                  <span className="font-display text-3xl font-black text-white">
                    {user?.credits ?? 0}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">Credits</span>
                </div>
              </div>

              <Link
                href="/pricing"
                className="rounded-xl bg-[#FF6A00] px-4 py-2.5 text-xs font-bold text-black shadow-lg shadow-[#FF6A00]/25 hover:bg-[#FF7D1A] transition-transform hover:scale-105 active:scale-95 flex items-center gap-1"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Top Up</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Tab Switcher & Quick Stats */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222533] pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                activeTab === 'transactions'
                  ? 'bg-[#FF6A00] text-black shadow-md'
                  : 'bg-[#12141C] text-gray-400 hover:text-white border border-[#222533]'
              }`}
            >
              <History className="h-4 w-4" />
              <span>Credit Transactions ({transactions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('videos')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                activeTab === 'videos'
                  ? 'bg-[#FF6A00] text-black shadow-md'
                  : 'bg-[#12141C] text-gray-400 hover:text-white border border-[#222533]'
              }`}
            >
              <Film className="h-4 w-4" />
              <span>Generated Rap Videos ({videos.length})</span>
            </button>
          </div>

          <button
            onClick={() => user && fetchHistory(user.id)}
            disabled={loadingData}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors self-end sm:self-auto"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loadingData ? 'animate-spin text-[#FF6A00]' : ''}`} />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Content Section */}
        <div className="mt-6">
          {/* Tab 1: Credit Transactions */}
          {activeTab === 'transactions' && (
            <div className="rounded-2xl border border-[#222533] bg-[#12141C] overflow-hidden">
              {loadingData ? (
                <div className="p-12 text-center text-xs text-gray-400">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto text-[#FF6A00] mb-2" />
                  Loading transactions...
                </div>
              ) : transactions.length === 0 ? (
                <div className="p-12 text-center text-xs text-gray-400">
                  <Coins className="h-8 w-8 mx-auto text-gray-600 mb-3" />
                  <p className="font-bold text-white text-sm">No transaction records found yet</p>
                  <p className="mt-1 text-gray-500">
                    Sign in or make your first rap video to view credit balance updates.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#1D202C]">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 gap-3 hover:bg-[#181B26]/50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                            tx.amount > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                          }`}
                        >
                          {tx.amount > 0 ? (
                            <ArrowDownLeft className="h-4 w-4" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-white">
                            {tx.description || (tx.type === 'signup' ? 'Welcome Bonus' : tx.type)}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                            <span className="font-mono uppercase">{tx.type}</span>
                            <span>•</span>
                            <span>{formatDate(tx.created_at)}</span>
                            {tx.ref_id && (
                              <>
                                <span>•</span>
                                <span className="font-mono text-gray-400 truncate max-w-[120px]">
                                  Ref: {tx.ref_id}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="sm:text-right shrink-0">
                        {getTransactionBadge(tx.type, tx.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Generated Videos */}
          {activeTab === 'videos' && (
            <div className="rounded-2xl border border-[#222533] bg-[#12141C] overflow-hidden">
              {loadingData ? (
                <div className="p-12 text-center text-xs text-gray-400">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto text-[#FF6A00] mb-2" />
                  Loading generated video history...
                </div>
              ) : videos.length === 0 ? (
                <div className="p-12 text-center text-xs text-gray-400">
                  <Film className="h-8 w-8 mx-auto text-gray-600 mb-3" />
                  <p className="font-bold text-white text-sm">No videos generated yet</p>
                  <p className="mt-1 text-gray-500 mb-4">
                    Upload your selfies and create your first Hotel Lobby rap video in 3 minutes!
                  </p>
                  <Link
                    href="/#generator"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF6A00] px-4 py-2 text-xs font-bold text-black"
                  >
                    <span>Create Video Now</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-[#1D202C]">
                  {videos.map((vid) => (
                    <div
                      key={vid.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 gap-4 hover:bg-[#181B26]/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 shrink-0">
                          {/* 渲染后的视频预览 */}
                          <div className="relative aspect-[9/16] w-12 sm:w-14 rounded-lg overflow-hidden bg-black border border-[#222533] shrink-0">
                            {vid.video_url && (
                              <video
                                src={vid.video_url}
                                className="h-full w-full object-cover"
                                muted
                                playsInline
                              />
                            )}
                          </div>

                          {/* 原始上传照片预览 */}
                          {(vid.photo1 || vid.photo2) && (
                            <div className="flex flex-col gap-1 shrink-0">
                              {vid.photo1 && (
                                <a
                                  href={vid.photo1}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="h-6 w-6 rounded border border-[#222533] overflow-hidden hover:border-[#FF6A00]"
                                  title="Original photo 1"
                                >
                                  <img src={vid.photo1} alt="" className="h-full w-full object-cover object-top" />
                                </a>
                              )}
                              {vid.photo2 && (
                                <a
                                  href={vid.photo2}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="h-6 w-6 rounded border border-[#222533] overflow-hidden hover:border-[#FF6A00]"
                                  title="Original photo 2"
                                >
                                  <img src={vid.photo2} alt="" className="h-full w-full object-cover object-top" />
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-white capitalize">
                            Stage: {vid.stage?.replace('-', ' ')}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                            Topic: {vid.lyrics_topic || 'Custom Freestyle'}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                            <span>{formatDate(vid.created_at)}</span>
                            <span>•</span>
                            <span className="text-[#FF6A00] font-mono">-{vid.cost_credits} Cr</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/20">
                          {vid.status}
                        </span>
                        {vid.video_url && (
                          <a
                            href={vid.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-xl border border-[#222533] bg-[#0A0C13] p-2 text-xs text-gray-300 hover:text-white hover:border-[#FF6A00] transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
