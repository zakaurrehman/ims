'use client';

// Deterministic initial-avatar chip for suppliers/clients/users.
// Same name -> same color, always. Soft tone bg + strong tone text (reference style).
const PALETTE = [
    { bg: '#EEEBFC', text: '#5A49CB' }, // violet
    { bg: '#E0F5F2', text: '#0B6D62' }, // teal
    { bg: '#FDF3E1', text: '#9A6215' }, // amber
    { bg: '#FBE9F0', text: '#B03A62' }, // rose
    { bg: '#E7F0FB', text: '#2563A8' }, // blue
    { bg: '#E5F6EC', text: '#177245' }, // green
];

const hashName = (s) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return Math.abs(h);
};

const initialsOf = (name) => {
    const words = String(name).trim().split(/\s+/).filter(Boolean);
    if (!words.length) return '?';
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
};

export default function Avatar({ name, size = 22, className = '', style = {} }) {
    const label = String(name || '').trim();
    if (!label) return null;
    const tone = PALETTE[hashName(label) % PALETTE.length];
    return (
        <span
            className={`inline-flex items-center justify-center rounded-full font-semibold select-none shrink-0 ${className}`}
            style={{
                width: size, height: size,
                background: tone.bg, color: tone.text,
                fontSize: Math.max(9, Math.round(size * 0.4)),
                letterSpacing: '0.02em',
                ...style,
            }}
            title={label}
        >
            {initialsOf(label)}
        </span>
    );
}
