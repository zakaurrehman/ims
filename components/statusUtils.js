// Pure status → color helpers (no JSX/React) so they're unit-testable in isolation
// and reusable anywhere. The <StatusBadge> component in StatusBadge.js renders these.

// One pastel system: soft bg, dark text, faint border (see globals.css :root tokens).
// "blue" is the info/accent tone — violet in the reference palette.
export const TONES = {
    green: { bg: '#E5F6EC', text: '#177245', border: '#BFE8D0' },
    amber: { bg: '#FDF3E1', text: '#9A6215', border: '#F5DFAE' },
    red: { bg: '#FDEAEA', text: '#B42332', border: '#F5C6C9' },
    blue: { bg: '#EEEBFC', text: '#5A49CB', border: '#D6CFF7' },
    gray: { bg: '#F1EFF6', text: '#5D5A74', border: '#DDD9EA' },
};

// Map a free-text status label to a tone. Order matters: negative/partial checks
// run before the positive check so "Not Shipped" / "Partly Shipped" don't match
// the "shipped" → green rule.
export function statusTone(label = '') {
    const s = String(label).toLowerCase().trim();
    if (!s) return 'gray';
    if (s.includes('draft')) return 'blue';
    if (/(unpaid|not shipped|unsold|cancel|overdue|delayed|reject|fail|loss|denied|expired|stale)/.test(s)) return 'red';
    if (/(partial|partly|pending|\bopen\b|hold|await|processing|review|in transit)/.test(s)) return 'amber';
    if (/(paid|final|finish|closed|shipped|complete|active|approved|done|delivered|success)/.test(s)) return 'green';
    return 'gray';
}

// Tailwind text-color class for signed amounts (negatives red, positives green).
// Returns '' for zero / non-numbers so they stay default-colored.
export function amountToneClass(n) {
    const v = typeof n === 'number' ? n : parseFloat(String(n ?? '').replace(/[^0-9.-]/g, ''));
    if (!Number.isFinite(v) || v === 0) return '';
    return v < 0 ? 'text-red-600' : 'text-green-700';
}
