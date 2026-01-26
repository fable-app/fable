/**
 * Navigator
 * React Navigation stack navigator for the SDK
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StoryListScreen } from '../screens/StoryListScreen';
import { ReaderScreen } from '../screens/ReaderScreen';
import { ChapterListScreen } from '../screens/ChapterListScreen';
import type { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

export function FableNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="StoryList" component={StoryListScreen} />
      <Stack.Screen name="ChapterList" component={ChapterListScreen} />
      <Stack.Screen name="Reader" component={ReaderScreen} />
    </Stack.Navigator>
  );
}
