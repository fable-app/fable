/**
 * SDK Context
 * Provides theme, analytics, and configuration to all SDK components
 */

import React, { createContext, useContext, ReactNode } from 'react';
import type { FableTheme, AnalyticsProvider } from '../types';
import { createTheme } from '../config/theme';

interface SDKContextValue {
  theme: FableTheme;
  analyticsProvider?: AnalyticsProvider;
  onStoryStart?: (storyId: string) => void;
  onStoryComplete?: (storyId: string, progress: any) => void;
}

const SDKContext = createContext<SDKContextValue | null>(null);

interface SDKProviderProps {
  theme?: Partial<FableTheme>;
  analyticsProvider?: AnalyticsProvider;
  onStoryStart?: (storyId: string) => void;
  onStoryComplete?: (storyId: string, progress: any) => void;
  children: ReactNode;
}

export function SDKProvider({
  theme: customTheme,
  analyticsProvider,
  onStoryStart,
  onStoryComplete,
  children,
}: SDKProviderProps) {
  const theme = createTheme(customTheme);

  const value: SDKContextValue = {
    theme,
    analyticsProvider,
    onStoryStart,
    onStoryComplete,
  };

  return <SDKContext.Provider value={value}>{children}</SDKContext.Provider>;
}

/**
 * Hook to access SDK context
 */
export function useSDKContext() {
  const context = useContext(SDKContext);
  if (!context) {
    throw new Error('useSDKContext must be used within SDKProvider');
  }
  return context;
}

/**
 * Hook to access analytics provider
 */
export function useAnalytics() {
  const { analyticsProvider } = useSDKContext();
  return analyticsProvider;
}

/**
 * Hook to access theme
 */
export function useTheme() {
  const { theme } = useSDKContext();
  return theme;
}
