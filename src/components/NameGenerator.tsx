'use client';

import React, { useState } from 'react';
import { RefreshCw, Copy, Check } from 'lucide-react';

const FIRST = [
  'Midnight', 'Golden', 'Static', 'Velvet', 'Concrete', 'Neon', 'Paper', 'Iron',
  'Honey', 'Thunder', 'Silent', 'Crimson', 'Electric', 'Royal', 'Savage', 'Cosmic',
  'Liquid', 'Marble', 'Phantom', 'Solar',
];
const SECOND = [
  'Lobby', 'Cypher', 'Static', 'Empire', 'Syndicate', 'Cartel', 'Dynasty', 'Circuit',
  'Protocol', 'Avenue', 'Syndrome', 'Collective', 'Frequency', 'Monopoly', 'Archive', 'Unit',
];
const STYLES: { label: string; make: () => string }[] = [
  {
    label: 'Classic duo',
    make: () =>
      `${pick(FIRST)} ${pick(SECOND)}`,
  },
  {
    label: 'X & Y',
    make: () =>
      `${pick(FIRST)} & ${pick(['Smoke', 'Mirrors', 'Static', 'Gold', 'Thunder', 'Velvet', 'Chaos', 'Order'])}`,
  },
  {
    label: 'The ... Boys/Girls',
    make: () =>
      `The ${pick(FIRST)} ${pick(['Boys', 'Girls', 'Kids', 'Twins', 'Brothers', 'Sisters'])}`,
  },
  {
    label: 'Number crew',
    make: () =>
      `${pick(FIRST)} ${pick(['2', 'Two', 'II', '47', '808', '3000'])}`,
  },
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function NameGenerator() {
  const [names, setNames] = useState<{ style: string; name: string }[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const generate = () => {
    setNames(STYLES.map((s) => ({ style: s.label, name: s.make() })));
    setCopied(null);
  };

  const copy = async (name: string) => {
    try {
      await navigator.clipboard.writeText(name);
      setCopied(name);
    } catch {
      setCopied(null);
    }
  };

  return (
    <div className="rounded-2xl border border-[#222533] bg-[#12141C] p-6">
      <button
        onClick={generate}
        className="inline-flex items-center gap-2 rounded-xl bg-[#FF6A00] px-5 py-3 font-display text-sm font-black text-black hover:bg-[#FF8A00]"
      >
        <RefreshCw className="h-4 w-4" />
        Generate duo names
      </button>
      {names.length === 0 && (
        <p className="mt-4 text-sm text-gray-400">
          Tap the button and get four duo name styles at once. Keep tapping until one sounds like a poster.
        </p>
      )}
      <div className="mt-6 flex flex-col gap-3">
        {names.map((n) => (
          <div
            key={n.style}
            className="flex items-center justify-between gap-3 rounded-xl border border-[#222533] bg-[#090A0F] px-4 py-3"
          >
            <div>
              <div className="text-[11px] uppercase tracking-wider text-gray-500">{n.style}</div>
              <div className="font-display text-lg font-black text-white">{n.name}</div>
            </div>
            <button
              onClick={() => copy(n.name)}
              className="inline-flex items-center gap-1 rounded-lg border border-[#222533] px-3 py-2 text-xs text-gray-300 hover:border-[#FF6A00] hover:text-white"
            >
              {copied === n.name ? <Check className="h-3.5 w-3.5 text-[#FF6A00]" /> : <Copy className="h-3.5 w-3.5" />}
              {copied === n.name ? 'Copied' : 'Copy'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
