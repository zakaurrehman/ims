'use client';

// Converts common numeric formats to a real number.
// Supports: "$1,234.50", "1,234", "(1,200.00)", "  99.9  ", "-12", "12%", etc.
export const toNumber = (val) => {
  if (val == null) return NaN;

  if (typeof val === 'number') return Number.isFinite(val) ? val : NaN;

  // React-table sometimes returns strings
  let s = String(val).trim();
  if (!s) return NaN;

  // handle percentages: "12%" => 12
  const isPercent = s.endsWith('%');
  if (isPercent) s = s.slice(0, -1);

  // handle parentheses for negatives: "(123.45)" => "-123.45"
  if (s.startsWith('(') && s.endsWith(')')) {
    s = '-' + s.slice(1, -1);
  }

  // remove currency symbols, spaces, etc (keep digits, dot, minus)
  s = s.replace(/[^0-9.-]+/g, '');

  // reject cases like "-" or "." etc
  if (!s || s === '-' || s === '.' || s === '-.') return NaN;

  const num = Number(s);
  return Number.isFinite(num) ? num : NaN;
};

export const isNumericLike = (val) => {
  return Number.isFinite(toNumber(val));
};
