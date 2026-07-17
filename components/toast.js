import React, { useEffect, useContext, useState } from 'react';
import { SettingsContext } from "../contexts/useSettingsContext";
import { CheckCircle2, XCircle } from 'lucide-react';

const Toast = () => {
    const { setToast, toast } = useContext(SettingsContext);
    const [secondaryToast, setSecondaryToast] = useState(false);

    useEffect(() => {
        if (toast?.show) {
            const timer = setTimeout(() => {
                setToast({ ...toast, show: false });
                setSecondaryToast(true);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [toast?.show]);

    useEffect(() => {
        if (secondaryToast) {
            const secondaryTimer = setTimeout(() => {
                setSecondaryToast(false);
            }, 10000);

            return () => clearTimeout(secondaryTimer);
        }
    }, [secondaryToast]);

    return (
        <div>
            {toast?.show && (
                <div className={`gap-3 flex text-[0.8125rem] font-medium px-4 py-3 bottom-4 right-4 z-[70] fixed rounded-xl items-center fadeInToast border bg-white text-[var(--ink)]
                ${toast?.clr === 'success' ? 'border-[var(--ok-border)]' : 'border-[var(--bad-border)]'}`}
                    style={{ boxShadow: 'var(--shadow-md)' }}>
                    <span className={`w-1 self-stretch rounded-full flex-shrink-0 ${toast?.clr === 'success' ? 'bg-[var(--ok-text)]' : 'bg-[var(--bad-text)]'}`} />
                    {toast?.clr === 'success'
                        ? <CheckCircle2 size={18} className='text-[var(--ok-text)] flex-shrink-0' />
                        : <XCircle size={18} className='text-[var(--bad-text)] flex-shrink-0' />}
                    <div>{toast?.text || ''}</div>
                </div>
            )}
            {secondaryToast && toast?.clr === 'success' && (
                <div className="gap-3 flex text-[0.8125rem] font-medium px-4 py-3 bottom-4 right-4 z-[70] fixed rounded-xl items-center fadeInToast border border-[var(--line)] bg-white text-[var(--ink-secondary)]"
                    style={{ boxShadow: 'var(--shadow-md)' }}>
                    <CheckCircle2 size={16} className='text-[var(--brand)] flex-shrink-0' />
                    <div>Please verify the saved data again!</div>
                </div>
            )}
        </div>
    );
};

export default Toast;
