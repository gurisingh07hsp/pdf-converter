'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';
import { LANGUAGES, type Language } from '@/lib/languages';

interface LanguageSelectProps {
  value: string;
  onChange: (code: string) => void;
  label?: string;
  id?: string;
  allowAuto?: boolean;
}

export function LanguageSelect({ value, onChange, label, id, allowAuto }: LanguageSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const selected = allowAuto && value === 'auto'
    ? { code: 'auto', name: 'Auto-detect', nativeName: '', flag: '🌐' }
    : LANGUAGES.find((l: {code: string}) => l.code === value);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const filtered = query
    ? LANGUAGES.filter(
        (l: {name: string, nativeName: string}) =>
          l.name.toLowerCase().includes(query.toLowerCase()) ||
          l.nativeName.toLowerCase().includes(query.toLowerCase())
      )
    : LANGUAGES;

  return (
    <div className="relative flex-1" ref={ref}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </label>
      )}
      <button
        id={id}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-800 shadow-sm transition-all hover:border-brand-300 hover:shadow-md focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
      >
        <span className="flex items-center gap-2.5 truncate">
          <span className="text-lg leading-none">{selected?.flag ?? '🌐'}</span>
          <span className="truncate">
            {selected?.name ?? 'Select language'}
            {selected && (
              <span className="ml-1.5 text-slate-400 font-normal">{selected.nativeName}</span>
            )}
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full animate-fade-in-fast overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2.5">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search languages..."
              className="w-full bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
            />
          </div>
          <ul className="max-h-64 overflow-y-auto py-1">
            {allowAuto && (
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onChange('auto');
                    setOpen(false);
                    setQuery('');
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-brand-50 ${
                    'auto' === value ? 'bg-brand-50 text-brand-700 font-medium' : 'text-slate-700'
                  }`}
                >
                  <span className="text-lg leading-none">🌐</span>
                  <span className="flex-1 truncate">Auto-detect</span>
                  {'auto' === value && <Check className="h-4 w-4 text-brand-600" />}
                </button>
              </li>
            )}
            {filtered.length === 0 && !allowAuto && (
              <li className="px-4 py-3 text-sm text-slate-400">No languages found</li>
            )}
            {filtered.map((lang: Language) => (
              <li key={lang.code}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(lang.code);
                    setOpen(false);
                    setQuery('');
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-brand-50 ${
                    lang.code === value ? 'bg-brand-50 text-brand-700 font-medium' : 'text-slate-700'
                  }`}
                >
                  <span className="text-lg leading-none">{lang.flag}</span>
                  <span className="flex-1 truncate">
                    {lang.name}
                    <span className="ml-1.5 text-slate-400 font-normal">{lang.nativeName}</span>
                  </span>
                  {lang.code === value && <Check className="h-4 w-4 text-brand-600" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
