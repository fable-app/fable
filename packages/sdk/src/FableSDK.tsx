/**
 * FableSDK
 * Main entry point for the Fable white-label SDK
 */

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { FableNavigator } from './navigation/Navigator';
import type { FableSDKProps } from './types';

export function FableSDK({
  theme,
  onStoryComplete,
  onStoryStart,
  customStories,
  useDefaultStories = true,
  analyticsProvider,
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
    <NavigationContainer>
      <FableNavigator />
    </NavigationContainer>
  );
}
