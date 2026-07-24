'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';

// Light/dark theme. The <html> class is set pre-hydration by the inline script in
// app/layout.js (no flash); this context keeps React state in sync and persists
// the choice. Default: saved preference, else the OS setting, else light.
const ThemeContext = createContext({ theme: 'light', toggleTheme: () => { } });

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('light');

    // Adopt whatever the pre-hydration script decided.
    useEffect(() => {
        setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(prev => {
            const next = prev === 'dark' ? 'light' : 'dark';
            document.documentElement.classList.toggle('dark', next === 'dark');
            try { localStorage.setItem('ims:theme', next); } catch { }
            return next;
        });
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
