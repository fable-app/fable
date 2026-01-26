/**
 * FableSDK
 * Main entry point for the Fable white-label SDK
 */

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { FableNavigator } from './navigation/Navigator';
import { SDKProvider } from './context/SDKContext';
import type { FableSDKProps } from './types';

export function FableSDK({
  theme,
  onStoryComplete,
  onStoryStart,
  customStories,
  useDefaultStories = true,
  analyticsProvider,
  navigationContainerRef,
}: FableSDKProps) {
  useEffect(() => {
    // Initialize SDK
    console.log('[FableSDK] Initialized');

    // Track analytics
    if (analyticsProvider) {
      analyticsProvider.trackEvent('sdk_initialized', {
        hasCustomTheme: !!theme,
        hasCustomStories: !!customStories,
        useDefaultStories,
      });
    }
  }, []);

  return (
    <SDKProvider
      theme={theme}
      analyticsProvider={analyticsProvider}
      onStoryStart={onStoryStart}
      onStoryComplete={onStoryComplete}
    >
      <NavigationContainer ref={navigationContainerRef}>
        <FableNavigator />
      </NavigationContainer>
    </SDKProvider>
  );
}
