import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useCurrentGame } from '@/src/db/hooks';
import { usePlayerStats } from '@/src/db/hooks';
import { getRandomCubeSize } from '@/src/lib/prizes';

export default function HomeScreen() {
  const router = useRouter();
  const { game, createGame, refresh } = useCurrentGame();
  const { stats } = usePlayerStats();

  const handleStartNewCube = async () => {
    const size = getRandomCubeSize();
    await createGame(size);
    router.navigate('/cube');
  };

  const handleContinue = () => {
    router.navigate('/cube');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">The Cube</ThemedText>
        <ThemedText style={styles.subtitle}>
          Explore. Click. Win prizes.
        </ThemedText>
      </View>

      <View style={styles.actions}>
        {game && (
          <Pressable style={styles.primaryButton} onPress={handleContinue}>
            <Text style={styles.primaryButtonText}>
              Continue Cube ({game.cubesRemaining}/{game.totalCubes} remaining)
            </Text>
          </Pressable>
        )}
        <Pressable
          style={game ? styles.secondaryButton : styles.primaryButton}
          onPress={handleStartNewCube}
        >
          <Text
            style={
              game ? styles.secondaryButtonText : styles.primaryButtonText
            }
          >
            Start New Cube
          </Text>
        </Pressable>
      </View>

      <View style={styles.statsContainer}>
        <ThemedText type="subtitle">Your Stats</ThemedText>
        <View style={styles.statsGrid}>
          <StatCard label="Games Played" value={stats.totalGames} />
          <StatCard label="Completed" value={stats.completedGames} />
          <StatCard label="Total Clicks" value={stats.totalClicks} />
          <StatCard label="Prizes Won" value={stats.totalPrizes} />
        </View>
      </View>
    </ThemedView>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.statCard}>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 8,
  },
  actions: {
    gap: 12,
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#4ecdc4',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4ecdc4',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#4ecdc4',
    fontSize: 18,
    fontWeight: '700',
  },
  statsContainer: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
});
