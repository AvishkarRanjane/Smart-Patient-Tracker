// app/providers.tsx
import type { ReactNode } from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { WardManagementProvider } from '../context/WardManagementContext';
import { MessageProvider } from '../context/MessageContext';
import { AlertProvider } from '../context/AlertContext';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Standard Root Provider Hierarchy
 * Encapsulates theme, authentication, ward/bed management, messaging, and alert monitoring.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WardManagementProvider>
          <MessageProvider>
            <AlertProvider>
              {children}
            </AlertProvider>
          </MessageProvider>
        </WardManagementProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
