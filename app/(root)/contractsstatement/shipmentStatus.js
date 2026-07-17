// Single source of truth for the shipment lifecycle status shared by the Shipment page and the
// Contracts Statement, so the statement's Status column follows the same vocabulary/colors the
// user manages on the Shipment page (add a status here and both pages pick it up).

import { TONES } from '@components/statusUtils';

export const SHIPMENT_STATUSES = ['', 'Pending', 'Shipped', 'In Transit', 'Arrived', 'Completed', 'On Hold'];

const tone = (t) => ({ backgroundColor: TONES[t].bg, border: `1px solid ${TONES[t].border}`, color: TONES[t].text });

// Old stored values are mapped to the current vocabulary on read — no data migration needed.
const LEGACY_ALIASES = { 'At Port': 'Arrived', 'Delivered': 'Completed' };
export const normalizeStatus = (s) => LEGACY_ALIASES[s] || s || '';

export const SHIPMENT_STATUS_STYLES = {
    'Pending':    { backgroundColor: '#FDF3E1', border: '1px solid #F5DFAE', color: '#9A6215' },
    'Shipped':    { backgroundColor: '#EEEBFC', border: '1px solid #D6CFF7', color: '#5A49CB' },
    'In Transit': { backgroundColor: '#F4F3F9', border: '1px solid #EAE8F2', color: 'var(--chathams-blue)' },
    'Arrived':    { backgroundColor: '#ECEAFB', border: '1px solid #D8D3F6', color: '#7A6FE3' },
    'Completed':  { backgroundColor: '#E5F6EC', border: '1px solid #BFE8D0', color: '#177245' },
    'On Hold':    { backgroundColor: '#FDEAEA', border: '1px solid #F5C6C9', color: '#831843' },
    // Legacy keys kept as a safety net for any raw (un-normalized) value.
    'At Port':    { backgroundColor: '#ECEAFB', border: '1px solid #D8D3F6', color: '#7A6FE3' },
    'Delivered':  { backgroundColor: '#E5F6EC', border: '1px solid #BFE8D0', color: '#177245' },
    '':           { backgroundColor: '#F4F3F9', border: '1px solid #DAD6E8', color: 'var(--port-gore)' },
};

// True when a real lifecycle status has been set on the contract (not the empty default).
export const hasShipmentStatus = (s) => !!normalizeStatus(s);
