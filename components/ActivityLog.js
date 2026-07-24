'use client';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { UserAuth } from '../contexts/useAuthContext';
import { loadActivity } from '../utils/utils';
import { FileText, Receipt, Banknote, Package, Settings as SettingsIcon, Activity, RefreshCw, Loader2, Search } from 'lucide-react';
import { TONES } from './statusUtils';

// Visual identity per entity type (aligns with the status-color system in statusUtils).
const ENTITY_META = {
    contract: { label: 'Contract', icon: FileText, color: 'var(--brand)', bg: 'var(--brand-soft)' },
    invoice: { label: 'Invoice', icon: Receipt, color: TONES.green.text, bg: TONES.green.bg },
    expense: { label: 'Expense', icon: Banknote, color: TONES.amber.text, bg: TONES.amber.bg },
    stock: { label: 'Stock', icon: Package, color: '#7c3aed', bg: '#f5f3ff' },
    settings: { label: 'Settings', icon: SettingsIcon, color: TONES.gray.text, bg: TONES.gray.bg },
};
const FALLBACK_META = { label: 'Activity', icon: Activity, color: TONES.gray.text, bg: TONES.gray.bg };
const metaFor = (t) => ENTITY_META[t] || FALLBACK_META;

function relativeTime(ms) {
    if (!ms) return '';
    const diff = Date.now() - ms;
    const s = Math.floor(diff / 1000);
    if (s < 60) return 'just now';
    const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24); if (d < 7) return `${d}d ago`;
    return new Date(ms).toLocaleDateString();
}

function initials(name = '') {
    return name.toString().split(/[\s@.]+/).filter(Boolean).slice(0, 2).map(s => s[0]?.toUpperCase() || '').join('') || '?';
}

/**
 * Activity timeline. Two modes:
 *   - scoped (pass entityType + entityId): per-record History, no filters.
 *   - global (pass showFilters): full feed with search + type/actor filters.
 */
const ActivityLog = ({ entityType, entityId, showFilters = false }) => {
    const { uidCollection } = UserAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [q, setQ] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [actorFilter, setActorFilter] = useState('all');

    const load = useCallback(async () => {
        if (!uidCollection) return;
        setLoading(true);
        const rows = await loadActivity(uidCollection, { entityType, entityId });
        setItems(rows);
        setLoading(false);
    }, [uidCollection, entityType, entityId]);

    useEffect(() => { load(); }, [load]);

    const actors = useMemo(
        () => [...new Set(items.map(i => i.actorName).filter(Boolean))],
        [items]
    );

    const filtered = useMemo(() => {
        if (!showFilters) return items;
        let rows = items;
        if (typeFilter !== 'all') rows = rows.filter(r => r.entityType === typeFilter);
        if (actorFilter !== 'all') rows = rows.filter(r => r.actorName === actorFilter);
        const term = q.trim().toLowerCase();
        if (term) {
            rows = rows.filter(r =>
                [r.message, r.entityLabel, r.actorName, r.action]
                    .filter(Boolean).join(' ').toLowerCase().includes(term)
            );
        }
        return rows;
    }, [items, showFilters, typeFilter, actorFilter, q]);

    const pill = 'rounded-full border border-[var(--line-strong)] bg-[var(--bg-subtle)] outline-none focus:border-[var(--brand)]';

    return (
        <div className='p-3'>
            {/* Filters (global mode only) */}
            {showFilters && (
                <div className='flex flex-wrap items-center gap-2 mb-3'>
                    <div className='flex items-center gap-1.5 px-3 py-1 flex-1 min-w-[180px]' style={{ borderRadius: 9999, border: '1px solid var(--line-strong)', background: 'var(--bg-subtle)' }}>
                        <Search className='w-3.5 h-3.5' style={{ color: 'var(--ink-muted)' }} />
                        <input
                            value={q}
                            onChange={e => setQ(e.target.value)}
                            placeholder='Search activity…'
                            className='flex-1 bg-transparent outline-none'
                            style={{ fontSize: '0.72rem', color: 'var(--ink)' }}
                        />
                    </div>
                    <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className={`${pill} px-3 py-1`} style={{ fontSize: '0.72rem', color: 'var(--ink)' }}>
                        <option value='all'>All types</option>
                        {Object.entries(ENTITY_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                    <select value={actorFilter} onChange={e => setActorFilter(e.target.value)} className={`${pill} px-3 py-1`} style={{ fontSize: '0.72rem', color: 'var(--ink)' }}>
                        <option value='all'>All users</option>
                        {actors.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                    <button onClick={load} aria-label='Refresh activity' className={`${pill} flex items-center gap-1 px-2.5 py-1 hover:border-[var(--brand)]`} style={{ fontSize: '0.72rem', color: 'var(--ink-secondary)' }}>
                        <RefreshCw className='w-3 h-3' /> Refresh
                    </button>
                </div>
            )}

            {/* States */}
            {loading ? (
                <div className='flex items-center justify-center gap-2 py-8'>
                    <Loader2 className='w-4 h-4 animate-spin' style={{ color: 'var(--brand)' }} />
                    <span style={{ fontSize: '0.72rem', color: 'var(--ink-secondary)' }}>Loading activity…</span>
                </div>
            ) : filtered.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-8 gap-1'>
                    <Activity className='w-5 h-5' style={{ color: 'var(--ink-muted)' }} />
                    <span style={{ fontSize: '0.72rem', color: 'var(--ink-muted)' }}>
                        {items.length === 0 ? 'No activity recorded yet.' : 'No activity matches your filters.'}
                    </span>
                </div>
            ) : (
                <ul className='flex flex-col gap-1.5 max-h-[60vh] overflow-y-auto pr-1'>
                    {filtered.map((r) => {
                        const meta = metaFor(r.entityType);
                        const Icon = meta.icon;
                        return (
                            <li key={r.id} className='flex items-start gap-2.5 p-2 rounded-xl' style={{ border: '1px solid var(--line)', background: "var(--bg-card)" }}>
                                <span className='inline-flex items-center justify-center rounded-full flex-shrink-0' style={{ width: 26, height: 26, background: meta.bg }}>
                                    <Icon className='w-3.5 h-3.5' style={{ color: meta.color }} />
                                </span>
                                <div className='min-w-0 flex-1'>
                                    <p className='break-words' style={{ fontSize: '0.72rem', color: 'var(--ink)' }}>
                                        {r.message || `${meta.label} ${r.action || 'updated'}`}
                                    </p>
                                    <div className='flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5' style={{ fontSize: '0.6rem', color: 'var(--ink-muted)' }}>
                                        <span className='inline-flex items-center gap-1'>
                                            <span className='inline-flex items-center justify-center rounded-full text-white' style={{ width: 14, height: 14, fontSize: '0.5rem', background: meta.color }}>
                                                {initials(r.actorName)}
                                            </span>
                                            {r.actorName || 'Unknown'}
                                        </span>
                                        <span>·</span>
                                        <span title={r.createdAt}>{relativeTime(r.createdAtMs)}</span>
                                        {r.entityLabel && (
                                            <span className='px-1.5 py-0.5 rounded-full' style={{ background: meta.bg, color: meta.color }}>
                                                {r.entityLabel}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default ActivityLog;
