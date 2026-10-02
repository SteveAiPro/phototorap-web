'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Locale } from '@/data/translations';
import { Mic2, Globe, Menu, X, ArrowRight, Flame, Coins } from 'lucide-react';

export default function Navbar() {
  const { user, openAuthModal, logout } = useAuth();
  const { locale, setLocale, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const languages: { code: Locale; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'zh', name: '简体中文' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'pt', name: 'Português' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
  ];

  const currentLangObj = languages.find((l) => l.code === locale) || languages[0];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#222533] bg-[#090A0F]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#FF6A00] to-[#FF8A00] text-black shadow-lg shadow-[#FF6A00]/25 group-hover:scale-105 transition-transform">
            <Mic2 className="h-5 w-5 fill-black stroke-black" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-display text-xl font-black tracking-tight text-white">
              PhotoToRap<span className="text-[#FF6A00]">.ai</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links translated */}
        <nav className="hidden items-center gap-7 md:flex text-sm font-medium text-gray-300">
          <Link href="/#generator" className="hover:text-[#FF6A00] transition-colors">
            {t.nav.makeVideo}
          </Link>
          <Link href="/#featured" className="hover:text-[#FF6A00] transition-colors">
            {t.nav.featuredHits}
          </Link>
          <Link href="/hotel-lobby-ai" className="hover:text-[#FF6A00] transition-colors flex items-center gap-1">
            <span>{t.nav.hotelLobby}</span>
            <Flame className="h-3.5 w-3.5 text-[#FF6A00]" />
          </Link>
          <Link href="/guides" className="hover:text-[#FF6A00] transition-colors text-white font-semibold">
            {t.nav.guides}
          </Link>
          <Link href="/pricing" className="hover:text-[#FF6A00] transition-colors">
            {t.nav.pricing}
          </Link>
          <Link href="/#faq" className="hover:text-[#FF6A00] transition-colors">
            {t.nav.faq}
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="hidden items-center gap-3.5 md:flex">
          {/* Functional Real Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-[#222533] bg-[#12141C] px-2.5 py-1.5 text-xs font-medium text-gray-300 hover:border-gray-500 transition-colors"
            >
              <Globe className="h-3.5 w-3.5 text-[#FF6A00]" />
              <span>{currentLangObj.name}</span>
            </button>
            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-36 rounded-xl border border-[#222533] bg-[#12141C] p-1.5 shadow-2xl backdrop-blur-lg z-50">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLocale(l.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-colors ${
                      locale === l.code
                        ? 'bg-[#FF6A00] text-black font-bold'
                        : 'text-gray-300 hover:bg-[#FF6A00]/20 hover:text-[#FF6A00]'
                    }`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Credits & Profile */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/pricing"
                className="flex items-center gap-1.5 rounded-lg border border-[#FF6A00]/40 bg-[#FF6A00]/10 px-3 py-1.5 text-xs font-bold text-[#FF6A00] hover:bg-[#FF6A00]/20 transition-colors"
              >
                <Coins className="h-3.5 w-3.5" />
                <span>{user.credits} {t.nav.credits}</span>
              </Link>

              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 rounded-lg border border-[#222533] bg-[#12141C] p-1.5 hover:border-gray-500"
                >
                  <img src={user.avatar} alt="Avatar" className="h-6 w-6 rounded-md object-cover" />
                </button>
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[#222533] bg-[#12141C] p-2 shadow-2xl z-50 text-xs">
                    <div className="px-2 py-1.5 text-gray-400 border-b border-[#222533] mb-1">
                      <p className="font-bold text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link href="/account" onClick={() => setUserDropdownOpen(false)} className="block px-2 py-1.5 rounded-lg text-gray-300 hover:bg-[#181B26] hover:text-[#FF6A00] font-medium">
                      Credits & Account
                    </Link>
                    <Link href="/pricing" onClick={() => setUserDropdownOpen(false)} className="block px-2 py-1.5 rounded-lg text-gray-300 hover:bg-[#181B26] hover:text-[#FF6A00]">
                      Top Up Credits
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-red-400 hover:bg-red-500/10"
                    >
                      {t.nav.signOut}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="rounded-lg border border-[#222533] bg-[#12141C] px-3.5 py-1.5 text-xs font-bold text-gray-200 hover:border-[#FF6A00] transition-colors"
            >
              {t.nav.signIn}
            </button>
          )}

          {/* CTA */}
          <Link
            href="/#generator"
            className="flex items-center gap-1.5 rounded-xl bg-[#FF6A00] px-4 py-2 text-sm font-bold text-black shadow-lg shadow-[#FF6A00]/30 hover:bg-[#FF7D1A] transition-all hover:scale-105 active:scale-95"
          >
            <span>{t.nav.makeVideo}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-gray-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-[#222533] bg-[#090A0F] px-4 py-5 md:hidden">
          <nav className="flex flex-col gap-4 text-base font-medium text-gray-300">
            <Link href="/#generator" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#FF6A00]">
              {t.nav.makeVideo}
            </Link>
            <Link href="/#featured" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#FF6A00]">
              {t.nav.featuredHits}
            </Link>
            <Link href="/hotel-lobby-ai" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#FF6A00]">
              {t.nav.hotelLobby}
            </Link>
            <Link href="/guides" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#FF6A00]">
              {t.nav.guides}
            </Link>
            <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#FF6A00]">
              {t.nav.pricing}
            </Link>
            {user ? (
              <div className="flex items-center justify-between border-t border-[#222533] pt-3 text-xs">
                <span className="text-[#FF6A00] font-bold">{user.credits} {t.nav.credits}</span>
                <button onClick={logout} className="text-red-400">{t.nav.signOut}</button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal();
                }}
                className="rounded-xl border border-[#222533] py-2.5 text-center text-xs font-bold text-white"
              >
                {t.nav.signIn}
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
