'use client';

import { useMemo } from 'react';
import { toNumber } from './numberUtils';

export const useQuickSum = ({
  table,
  enabled,
  selectedColumnIds,
}) => {
  const selectedRows = table.getSelectedRowModel().rows;

  const totals = useMemo(() => {
    if (!enabled) return [];
    if (!selectedRows.length) return [];

    return (selectedColumnIds || []).map((colId) => {
      const total = selectedRows.reduce((sum, r) => sum + toNumber(r.getValue(colId)), 0);
      return { id: colId, total };
    });
  }, [enabled, selectedRows, selectedColumnIds]);

  return {
    selectedCount: selectedRows.length,
    totals,
  };
};
