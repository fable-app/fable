/**
 * Fable SDK Demo App
 *
 * 🤖 FOR AI AGENTS: This is a complete, working example of Fable SDK integration.
 * Copy the sections you need for your implementation.
 *
 * QUICK START (minimal integration):
 * ```
 * import { FableSDK } from '@fable/sdk';
 * export default function App() {
 *   return <FableSDK />;
 * }
 * ```
 *
 * This demo showcases ALL features:
 * - Basic integration (line 80-90: <FableSDK /> component)
 * - Custom theming (line 50-58: customThemeConfig)
 * - Analytics tracking (line 17-24: demoAnalyticsProvider)
 * - Lifecycle callbacks (line 38-44: handleStoryStart, handleStoryComplete)
 * - Interactive controls for testing
 *
 * See INTEGRATION_GUIDE.md for more copy-paste examples.
 */

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { FableSDK, type FableSDKProps, type AnalyticsProvider } from '@fable/sdk';

// Demo analytics provider implementation
const demoAnalyticsProvider: AnalyticsProvider = {
  trackEvent: (event: string, properties?: Record<string, any>) => {
    console.log('📊 Analytics Event:', event, properties);
  },
  trackScreenView: (screenName: string) => {
    console.log('📱 Screen View:', screenName);
  },
};

export default function App() {
  const [showSDK, setShowSDK] = useState(false);
  const [customTheme, setCustomTheme] = useState(false);
  const [enableAnalytics, setEnableAnalytics] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const navigationRef = useRef(null);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 20));
  };

  const handleStoryStart = (storyId: string) => {
    addLog(`✅ Story started: ${storyId}`);
  };

  const handleStoryComplete = (storyId: string, progress: any) => {
    addLog(`🎉 Story completed: ${storyId} (${progress.completionPercentage}%)`);
  };

  // Theme configurations
  const defaultTheme = undefined;

  const customThemeConfig = {
    colors: {
      primary: '#C76542',
      secondary: '#41476E',
      accent: '#FFBB50',
      background: '#F4F2F1',
      text: '#191015',
      textSecondary: '#564E4A',
    },
    fonts: {
      regular: 'SpaceGrotesk-Regular',
      medium: 'SpaceGrotesk-Medium',
      semibold: 'SpaceGrotesk-SemiBold',
    },
    spacing: {
      sm: 8,
      base: 16,
      lg: 24,
      xl: 32,
    },
    branding: {
      appName: 'Demo App',
      hideDefaultBranding: false,
    },
  };

  const sdkProps: FableSDKProps = {
    theme: customTheme ? customThemeConfig : defaultTheme,
    onStoryStart: handleStoryStart,
    onStoryComplete: handleStoryComplete,
    useDefaultStories: true,
    analyticsProvider: enableAnalytics ? demoAnalyticsProvider : undefined,
    navigationContainerRef: navigationRef,
  };

  if (showSDK) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowSDK(false)}
          >
            <Text style={styles.backButtonText}>← Back to Demo Controls</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sdkContainer}>
          <FableSDK {...sdkProps} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.demoControls}>
        {/* Header */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>🎯 Fable SDK Demo</Text>
          <Text style={styles.subtitle}>
            Interactive demonstration of the Fable white-label SDK
          </Text>
        </View>

        {/* Configuration Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Configuration</Text>

          <View style={styles.setting}>
            <Text style={styles.settingLabel}>Custom Theme</Text>
            <Switch
              value={customTheme}
              onValueChange={setCustomTheme}
              trackColor={{ false: '#D7CEC9', true: '#C76542' }}
              thumbColor={customTheme ? '#FFFFFF' : '#F4F2F1'}
            />
          </View>

          <View style={styles.setting}>
            <Text style={styles.settingLabel}>Enable Analytics</Text>
            <Switch
              value={enableAnalytics}
              onValueChange={setEnableAnalytics}
              trackColor={{ false: '#E8DCC8', true: '#D4C5B0' }}
              thumbColor={enableAnalytics ? '#FFFCF7' : '#F0E8DC'}
            />
          </View>
        </View>

        {/* Current Configuration Display */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Active Configuration</Text>
          <View style={styles.configDisplay}>
            <Text style={styles.configText}>Theme: {customTheme ? 'Custom Green Theme' : 'Default Theme'}</Text>
            <Text style={styles.configText}>Analytics: {enableAnalytics ? 'Enabled' : 'Disabled'}</Text>
            <Text style={styles.configText}>Default Stories: Enabled</Text>
            <Text style={styles.configText}>Callbacks: onStoryStart, onStoryComplete</Text>
          </View>
        </View>

        {/* Launch Button */}
        <TouchableOpacity
          style={styles.launchButton}
          onPress={() => {
            addLog('🚀 Launching Fable SDK...');
            setShowSDK(true);
          }}
        >
          <Text style={styles.launchButtonText}>🚀 Launch SDK Demo</Text>
        </TouchableOpacity>

        {/* Event Log */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Event Log</Text>
          <View style={styles.logContainer}>
            {logs.length === 0 ? (
              <Text style={styles.emptyLog}>No events yet. Launch the SDK to see callbacks in action.</Text>
            ) : (
              logs.map((log, index) => (
                <Text key={index} style={styles.logEntry}>{log}</Text>
              ))
            )}
          </View>
        </View>

        {/* Integration Code Example */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💻 Integration Code</Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeText}>{`import { FableSDK } from '@fable/sdk';

function App() {
  return (
    <FableSDK
      theme={{
        colors: {
          primary: '#8B9D83',
          background: '#F5F5F0',
        }
      }}
      onStoryStart={(id) => {
        console.log('Story started:', id);
      }}
      onStoryComplete={(id, progress) => {
        console.log('Completed:', id);
      }}
      analyticsProvider={{
        trackEvent: (event, props) => {
          // Your analytics here
        }
      }}
    />
  );
}`}</Text>
          </View>
        </View>

        {/* Documentation Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 Documentation</Text>
          <Text style={styles.docLink}>• Installation Guide</Text>
          <Text style={styles.docLink}>• API Reference</Text>
          <Text style={styles.docLink}>• Theming Guide</Text>
          <Text style={styles.docLink}>• Custom Stories</Text>
          <Text style={styles.docLink}>• Analytics Integration</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F2F1', // neutral200
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#F4F2F1',
    borderBottomWidth: 1,
    borderBottomColor: '#D7CEC9', // neutral300
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    shadowColor: '#191015', // neutral800
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 12.81,
    elevation: 16,
  },
  backButton: {
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#C76542', // primary500
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  sdkContainer: {
    flex: 1,
  },
  demoControls: {
    padding: 20,
  },
  titleContainer: {
    marginBottom: 28,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: '#191015', // neutral800 (text)
    marginBottom: 8,
    letterSpacing: 1.2,
    fontFamily: 'SpaceGrotesk-Regular',
  },
  subtitle: {
    fontSize: 15,
    color: '#564E4A', // neutral600 (textDim)
    textAlign: 'center',
    letterSpacing: 0.8,
    fontWeight: '300',
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF', // neutral100
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D7CEC9', // neutral300
    shadowColor: '#191015', // neutral800
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 12.81,
    elevation: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '400',
    color: '#191015', // neutral800 (text)
    marginBottom: 16,
    letterSpacing: 1,
    fontFamily: 'SpaceGrotesk-Medium',
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#D7CEC9', // neutral300 (separator)
  },
  settingLabel: {
    fontSize: 15,
    color: '#564E4A', // neutral600 (textDim)
    letterSpacing: 0.5,
    fontWeight: '300',
  },
  configDisplay: {
    gap: 10,
  },
  configText: {
    fontSize: 14,
    color: '#564E4A', // neutral600 (textDim)
    paddingVertical: 6,
    paddingLeft: 12,
    letterSpacing: 0.4,
    fontWeight: '300',
  },
  launchButton: {
    backgroundColor: '#C76542', // primary500
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 28,
    alignItems: 'center',
    marginVertical: 20,
    shadowColor: '#191015', // neutral800
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 12.81,
    elevation: 16,
  },
  launchButtonText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF', // neutral100
    letterSpacing: 1.5,
  },
  logContainer: {
    backgroundColor: '#191015', // neutral800
    borderRadius: 12,
    padding: 16,
    maxHeight: 200,
    shadowColor: '#191015',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 12.81,
    elevation: 16,
  },
  emptyLog: {
    color: '#978F8A', // neutral500
    fontSize: 13,
    textAlign: 'center',
    padding: 20,
    letterSpacing: 0.5,
    fontWeight: '300',
  },
  logEntry: {
    color: '#D7CEC9', // neutral300
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  codeBlock: {
    backgroundColor: '#191015', // neutral800
    borderRadius: 12,
    padding: 18,
    shadowColor: '#191015',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 12.81,
    elevation: 16,
  },
  codeText: {
    color: '#F4F2F1', // neutral200
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  docLink: {
    fontSize: 14,
    color: '#C76542', // primary500
    paddingVertical: 6,
    paddingLeft: 12,
    letterSpacing: 0.5,
    fontWeight: '300',
  },
});
