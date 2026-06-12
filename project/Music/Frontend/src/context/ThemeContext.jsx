import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

const AVAILABLE_THEMES = [
    { id: 'mood-white', label: 'Mood White' },
    { id: 'retro-boombox', label: 'Retro Boombox' },
    { id: 'cyber-walkman', label: 'Cyber Walkman' },
    { id: 'mid-century', label: 'Mid-Century Vintage' },
    { id: 'all-black', label: 'All Black Studio' },
    { id: 'cyberpunk', label: 'Cyberpunk' },
    { id: 'glassmorphism', label: 'Glassmorphism' },
    { id: 'high-teen', label: 'High-Teen Pink' },
    { id: 'ocean-refresh', label: 'Ocean Refresh' },
    { id: 'city-pop', label: 'City Pop Sunset' },
];

const DEFAULT_THEME = 'mood-white';
const isValidTheme = (id) => AVAILABLE_THEMES.some(t => t.id === id);

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        if (typeof window === 'undefined') return DEFAULT_THEME;
        const stored = window.localStorage.getItem('theme');
        return isValidTheme(stored) ? stored : DEFAULT_THEME;
    });

    useEffect(() => {
        const darkLike = new Set(['all-black', 'cyberpunk']);
        document.body.classList.toggle('dark', darkLike.has(theme));
        document.body.setAttribute('data-theme', theme);
        window.localStorage.setItem('theme', theme);
    }, [theme]);

    const setThemeById = (id) => {
        if (!isValidTheme(id)) return;
        setTheme(id);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme: setThemeById, themes: AVAILABLE_THEMES }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used inside ThemeProvider');
    return context;
}
