import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { usePlayerStats } from '@/src/db/hooks';

export default function ProfileScreen() {
  const { stats, refresh } = usePlayerStats();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.avatar}>
        <ThemedText style={styles.avatarEmoji}>🎮</ThemedText>
      </View>
      <ThemedText type="title" style={styles.name}>
        Player
      </ThemedText>

      <View style={styles.statsGrid}>
        <StatRow label="Games Played" value={stats.totalGames} />
        <StatRow label="Games Completed" value={stats.completedGames} />
        <StatRow label="Total Clicks" value={stats.totalClicks} />
        <StatRow label="Prizes Won" value={stats.totalPrizes} />
        <StatRow label="Win Rate" value={`${stats.winRate}%`} />
        <StatRow
          label="Biggest Cube"
          value={
            stats.biggestCube > 0
              ? `${stats.biggestCube}×${stats.biggestCube}×${stats.biggestCube}`
              : '—'
          }
        />
      </View>
    </ThemedView>
  );
}

function StatRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <View style={styles.statRow}>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 24,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  name: {
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 32,
  },
  statsGrid: {
    gap: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(78, 205, 196, 0.06)',
  },
  statLabel: {
    fontSize: 16,
    opacity: 0.7,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
  },
});
