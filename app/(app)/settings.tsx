import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function SettingsScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.section}>
        <ThemedText type="subtitle">App</ThemedText>
        <View style={styles.row}>
          <ThemedText>Version</ThemedText>
          <ThemedText style={styles.value}>1.0.0</ThemedText>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle">Game</ThemedText>
        <View style={styles.row}>
          <ThemedText>Cube Size</ThemedText>
          <ThemedText style={styles.value}>Random (3–6)</ThemedText>
        </View>
        <View style={styles.row}>
          <ThemedText>Win Probability</ThemedText>
          <ThemedText style={styles.value}>20%</ThemedText>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle">Coming Soon</ThemedText>
        <ThemedText style={styles.comingSoon}>
          • Cloud sync with PostgreSQL{'\n'}
          • User accounts{'\n'}
          • Custom difficulty{'\n'}
          • Theme options{'\n'}
          • Sound effects
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  section: {
    marginBottom: 32,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  value: {
    opacity: 0.6,
  },
  comingSoon: {
    marginTop: 8,
    lineHeight: 28,
    opacity: 0.6,
  },
});
