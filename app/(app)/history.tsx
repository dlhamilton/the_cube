import React, { useCallback } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { useFocusEffect } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useGameHistory } from '@/src/db/hooks';
import type { Game } from '@/src/db/schema';

const STATUS_COLORS: Record<string, string> = {
  active: '#f39c12',
  completed: '#2ecc71',
  abandoned: '#95a5a6',
};

function GameRow({ game }: { game: Game }) {
  const date = new Date(game.createdAt).toLocaleDateString();
  const statusColor = STATUS_COLORS[game.status] ?? '#95a5a6';

  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <ThemedText style={styles.cubeSize}>
          {game.cubeSize}×{game.cubeSize}×{game.cubeSize}
        </ThemedText>
        <ThemedText style={styles.date}>{date}</ThemedText>
      </View>
      <View style={styles.rowCenter}>
        <ThemedText style={styles.prizes}>
          🏆 {game.prizesWon}
        </ThemedText>
        <ThemedText style={styles.remaining}>
          {game.totalCubes - game.cubesRemaining}/{game.totalCubes} clicked
        </ThemedText>
      </View>
      <View
        style={[styles.statusBadge, { backgroundColor: statusColor }]}
      >
        <ThemedText style={styles.statusText}>{game.status}</ThemedText>
      </View>
    </View>
  );
}

export default function HistoryScreen() {
  const { history, loading, refresh } = useGameHistory();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  return (
    <ThemedView style={styles.container}>
      {history.length === 0 && !loading ? (
        <View style={styles.empty}>
          <ThemedText style={styles.emptyText}>
            No games yet. Start playing!
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <GameRow game={item} />}
          contentContainerStyle={styles.list}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    opacity: 0.6,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(78, 205, 196, 0.08)',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  rowLeft: {
    flex: 1,
  },
  rowCenter: {
    alignItems: 'center',
  },
  cubeSize: {
    fontSize: 18,
    fontWeight: '700',
  },
  date: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 4,
  },
  prizes: {
    fontSize: 16,
  },
  remaining: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
