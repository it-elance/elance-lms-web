'use client';

import { Check, ChevronDown, Search } from 'lucide-react';
import { getCountries, getCountryCallingCode } from 'libphonenumber-js/mobile';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { CountryCode } from 'libphonenumber-js';
import type { KeyboardEvent, ReactNode } from 'react';

interface Country {
  code: CountryCode;
  name: string;
  dialCode: string;
}

interface CountryCodeSelectProps {
  value: CountryCode;
  onChange: (country: CountryCode) => void;
  icon?: ReactNode;
}

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

const COUNTRIES: Country[] = getCountries()
  .map((code) => ({
    code,
    name: regionNames.of(code) ?? code,
    dialCode: `+${getCountryCallingCode(code)}`,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

// matches by country name, ISO code ("ae") or dial code ("971" or "+971")
const matchesQuery = (country: Country, query: string) => {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const digits = q.replace(/^\+/, '');

  return (
    country.name.toLowerCase().includes(q) ||
    country.code.toLowerCase() === q ||
    (/^\d+$/.test(digits) && country.dialCode.slice(1).startsWith(digits))
  );
};

const CountryCodeSelect = ({
  value,
  onChange,
  icon,
}: CountryCodeSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const selected = COUNTRIES.find((country) => country.code === value);
  const filtered = useMemo(
    () => COUNTRIES.filter((country) => matchesQuery(country, query)),
    [query]
  );

  // close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    searchRef.current?.focus();
    listRef.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ block: 'center' });
  }, [isOpen]);

  // keep the highlighted option in view while using the arrow keys
  useEffect(() => {
    if (!isOpen) return;
    listRef.current?.children[activeIndex]?.scrollIntoView({
      block: 'nearest',
    });
  }, [activeIndex, isOpen]);

  const open = () => {
    setQuery('');
    setActiveIndex(
      Math.max(
        COUNTRIES.findIndex((country) => country.code === value),
        0
      )
    );
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const select = (country: Country) => {
    onChange(country.code);
    close();
  };

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, filtered.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filtered[activeIndex]) select(filtered[activeIndex]);
        break;
      case 'Escape':
        e.preventDefault();
        close();
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  const activeCountry = filtered[activeIndex];

  return (
    <div ref={containerRef} className="relative mt-1">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Country code: ${selected?.name} (${selected?.dialCode})`}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && !isOpen) {
            e.preventDefault();
            open();
          }
        }}
        className="flex w-full cursor-pointer items-center gap-2 rounded-4xl border border-(--color-border-medium) bg-(--color-bg-secondary) p-3 text-left"
      >
        {icon}
        <span className="flex-1 truncate text-(--color-text-primary)">
          {selected?.name} ({selected?.dialCode})
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-(--color-text-secondary) transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-(--color-border-medium) bg-(--color-bg-secondary) shadow-lg">
          <div className="flex items-center gap-2 border-b border-(--color-border-light) px-4 py-3">
            <Search className="h-4 w-4 shrink-0 text-(--color-text-tertiary)" />
            <input
              ref={searchRef}
              type="text"
              role="combobox"
              aria-expanded={isOpen}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={
                activeCountry ? `${listId}-${activeCountry.code}` : undefined
              }
              aria-label="Search country"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search country or code"
              className="w-full bg-transparent Body-Small text-(--color-text-primary) outline-none placeholder:text-(--color-text-disabled)"
            />
          </div>

          {filtered.length === 0 && (
            <p className="px-4 py-3 Body-Small text-(--color-text-secondary)">
              No countries found
            </p>
          )}

          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-label="Countries"
            className="max-h-60 overflow-y-auto py-1"
          >
            {filtered.map((country, index) => {
              const isSelected = country.code === value;

              return (
                <li
                  key={country.code}
                  id={`${listId}-${country.code}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => select(country)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex cursor-pointer items-center gap-2 px-4 py-2 Body-Small ${index === activeIndex ? 'bg-(--color-bg-hover)' : ''}`}
                >
                  <span className="flex-1 truncate text-(--color-text-primary)">
                    {country.name}
                  </span>
                  <span className="text-(--color-text-secondary)">
                    {country.dialCode}
                  </span>
                  <Check
                    className={`h-4 w-4 shrink-0 text-(--color-primary-500) ${isSelected ? '' : 'invisible'}`}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CountryCodeSelect;
