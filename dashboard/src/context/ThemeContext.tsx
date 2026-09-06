// context/ThemeContext.tsx
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type Theme = 'light'; // future: 'dark'

interface ThemeCtx {
  theme: Theme;
}

const ThemeContext = createContext<ThemeCtx>({ theme: 'light' });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme] = useState<Theme>('light');
  return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() { return useContext(ThemeContext); }
