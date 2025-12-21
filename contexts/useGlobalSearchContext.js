'use client';

import { createContext, useContext, useMemo, useState } from 'react';

const GlobalSearchContext = createContext(null);

export function GlobalSearchProvider({ children }) {
  // store items per source so pages can update independently
  const [itemsBySource, setItemsBySource] = useState({}); // { expenses: [...], invoices: [...], contracts: [...] }
  const [query, setQuery] = useState('');

  const items = useMemo(() => {
    return Object.values(itemsBySource).flat();
  }, [itemsBySource]);

  const upsertSourceItems = (sourceKey, items) => {
    setItemsBySource(prev => ({ ...prev, [sourceKey]: items }));
  };

  const clearSource = (sourceKey) => {
    setItemsBySource(prev => {
      const copy = { ...prev };
      delete copy[sourceKey];
      return copy;
    });
  };

  const value = useMemo(() => ({
    query,
    setQuery,
    items,
    upsertSourceItems,
    clearSource,
  }), [query, items]);

  return (
    <GlobalSearchContext.Provider value={value}>
      {children}
    </GlobalSearchContext.Provider>
  );
}

export function useGlobalSearch() {
  const ctx = useContext(GlobalSearchContext);
  if (!ctx) throw new Error('useGlobalSearch must be used inside GlobalSearchProvider');
  return ctx;
}
