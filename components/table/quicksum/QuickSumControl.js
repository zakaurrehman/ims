'use client';

import { useEffect, useMemo, useState } from 'react';
import { detectNumericCols } from './detectNumericCols';
import { useQuickSum } from './useQuickSum';

/**
 * Props:
 * - table
 * - enabled, setEnabled
 * - selectedColumnIds, setSelectedColumnIds
 */
export default function QuickSumControl({
  table,
  enabled,
  setEnabled,
  selectedColumnIds,
  setSelectedColumnIds,
}) {
  const [open, setOpen] = useState(false);

  // Get row count to trigger re-detection when data changes
  const currentRowCount = table.getRowModel().rows.length;

  const numericCols = useMemo(() => {
    // detect columns whenever table changes (filters/sorts can affect sample rows)
    return detectNumericCols({ table, sampleSize: 60, exclude: ['select'] });
  }, [table, currentRowCount]);

  // auto-select first numeric col when turning on (if none selected)
  useEffect(() => {
    if (!enabled) return;
    if (selectedColumnIds?.length) return;
    if (numericCols.length) {
      setSelectedColumnIds([numericCols[0].id]);
    }
  }, [enabled, numericCols, selectedColumnIds, setSelectedColumnIds]);

  const { selectedCount, totals } = useQuickSum({
    table,
    enabled,
    selectedColumnIds,
  });

  const toggleEnabled = () => {
    const next = !enabled;
    setEnabled(next);

    // if turning OFF: clear selection + close dropdown
    if (!next) {
      table.resetRowSelection();
      setOpen(false);
    }
  };

  const toggleCol = (colId) => {
    setSelectedColumnIds((prev) => {
      const cur = Array.isArray(prev) ? prev : [];
      if (cur.includes(colId)) return cur.filter((x) => x !== colId);
      return [...cur, colId];
    });
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        type="button"
        onClick={toggleEnabled}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center border
          ${enabled ? 'bg-[var(--endeavour)] text-white' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'}`}
        title="Quick Sum"
      >
        Quick Sum
      </button>

      {enabled && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all bg-white border border-gray-300"
            title="Choose columns"
          >
            Columns ▾
          </button>

          {open && (
            <div className="sm:absolute right-0 mt-2 sm:w-64 w-full bg-white border rounded shadow-md z-50 p-2">
              <div className="text-xs font-semibold text-slate-700 mb-2">
                Select numeric columns
              </div>

              {numericCols.length === 0 ? (
                <div className="text-sm text-slate-500">
                  No numeric columns detected.
                </div>
              ) : (
                <div className="max-h-56 overflow-auto">
                  {numericCols.map((c) => (
                    <label
                      key={c.id}
                      className="flex items-center gap-2 text-sm py-1 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={(selectedColumnIds || []).includes(c.id)}
                        onChange={() => toggleCol(c.id)}
                      />
                      <span className="truncate">{c.label}</span>
                    </label>
                  ))}
                </div>
              )}

              <div className="mt-2 pt-2 border-t flex items-center justify-between">
                <button
                  type="button"
                  className="text-sm underline text-slate-600"
                  onClick={() => setSelectedColumnIds([])}
                >
                  Clear columns
                </button>

                <button
                  type="button"
                  className="text-sm underline text-slate-600"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Totals display (compact) */}
      {enabled ? (
        selectedCount > 0 ? (
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700 ml-2">
            <span className="font-medium">{selectedCount} selected</span>

            {(totals || []).map((t) => (
              <span key={t.id} className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm whitespace-nowrap">
                {t.id}: {t.total.toFixed(2)}
              </span>
            ))}

            <button
              type="button"
              className="text-sm underline text-slate-600"
              onClick={() => table.resetRowSelection()}
            >
              Clear rows
            </button>
          </div>
        ) : (
          <span className="text-xs text-slate-400 ml-2">
            Select rows to see Quick Sum
          </span>
        )
      ) : null}
    </div>
  );
}
