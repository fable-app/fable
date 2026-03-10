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
      primary: '#8B9D83',
      secondary: '#6B7F63',
      accent: '#A4B89C',
      background: '#F5F5F0',
      text: '#2C3E2A',
      textSecondary: '#6B7563',
    },
    fonts: {
      regular: 'System',
      medium: 'System',
      semibold: 'System',
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
              trackColor={{ false: '#D1D5DB', true: '#8B9D83' }}
              thumbColor={customTheme ? '#FFFFFF' : '#F3F4F6'}
            />
          </View>

          <View style={styles.setting}>
            <Text style={styles.settingLabel}>Enable Analytics</Text>
            <Switch
              value={enableAnalytics}
              onValueChange={setEnableAnalytics}
              trackColor={{ false: '#D1D5DB', true: '#8B9D83' }}
              thumbColor={enableAnalytics ? '#FFFFFF' : '#F3F4F6'}
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
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#8B9D83',
    fontWeight: '600',
  },
  sdkContainer: {
    flex: 1,
  },
  demoControls: {
    padding: 20,
  },
  titleContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  settingLabel: {
    fontSize: 16,
    color: '#374151',
  },
  configDisplay: {
    gap: 8,
  },
  configText: {
    fontSize: 14,
    color: '#4B5563',
    paddingVertical: 4,
    paddingLeft: 8,
  },
  launchButton: {
    backgroundColor: '#8B9D83',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  launchButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  logContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 12,
    maxHeight: 200,
  },
  emptyLog: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
  },
  logEntry: {
    color: '#10B981',
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  codeBlock: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    padding: 16,
  },
  codeText: {
    color: '#E5E7EB',
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  docLink: {
    fontSize: 14,
    color: '#8B9D83',
    paddingVertical: 4,
    paddingLeft: 8,
  },
});
