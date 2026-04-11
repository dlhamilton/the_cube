import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, Pressable, Modal } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { CubeGame } from '@/src/components/CubeGame';
import { PrizeToast } from '@/src/components/PrizeToast';
import {
  useCurrentGame,
  useGameClicks,
  useRecordClick,
  useCompleteGame,
  useAbandonGame,
} from '@/src/db/hooks';
import { getRandomCubeSize } from '@/src/lib/prizes';

export default function CubeScreen() {
  const router = useRouter();
  const { game, refresh: refreshGame, createGame } = useCurrentGame();
  const { clickedPositions, refresh: refreshClicks } = useGameClicks(game?.id);
  const recordClick = useRecordClick(game?.id);
  const completeGame = useCompleteGame();
  const abandonGame = useAbandonGame();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const [localClicked, setLocalClicked] = useState<Set<string>>(new Set());

  // Merge DB clicks with local optimistic clicks
  const allClicked = new Set([...clickedPositions, ...localClicked]);

  useFocusEffect(
    useCallback(() => {
      refreshGame();
      refreshClicks();
      setLocalClicked(new Set());
    }, [refreshGame, refreshClicks]),
  );

  const handleCubeClick = async (x: number, y: number, z: number) => {
    const key = `${x},${y},${z}`;
    if (allClicked.has(key)) return;

    // Optimistic update
    setLocalClicked((prev) => new Set(prev).add(key));

    const prize = await recordClick(x, y, z);
    if (prize?.won) {
      setToastMessage(`🎉 Won: ${prize.prizeName}!`);
    } else {
      setToastMessage('No prize this time');
    }

    await refreshGame();

    // Check completion
    const updatedGame = game;
    if (updatedGame && updatedGame.cubesRemaining <= 1) {
      setTimeout(() => setShowComplete(true), 500);
    }
  };

  const handlePlayAgain = async () => {
    if (game) await completeGame(game.id);
    setShowComplete(false);
    const size = getRandomCubeSize();
    await createGame(size);
    setLocalClicked(new Set());
    await refreshClicks();
  };

  const handleFinish = async () => {
    if (game) await completeGame(game.id);
    setShowComplete(false);
    setLocalClicked(new Set());
    router.navigate('/');
  };

  if (!game) {
    return (
      <ThemedView style={styles.emptyContainer}>
        <ThemedText type="subtitle">No active cube</ThemedText>
        <ThemedText style={styles.emptyText}>
          Start a new cube from the Home screen
        </ThemedText>
        <Pressable
          style={styles.button}
          onPress={() => router.navigate('/')}
        >
          <Text style={styles.buttonText}>Go Home</Text>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.info}>
          {game.cubeSize}×{game.cubeSize}×{game.cubeSize} Cube
        </ThemedText>
        <ThemedText style={styles.info}>
          {game.cubesRemaining - localClicked.size + clickedPositions.size > 0
            ? `${Math.max(0, game.cubesRemaining)} remaining`
            : '0 remaining'}
        </ThemedText>
        <ThemedText style={styles.info}>
          🏆 {game.prizesWon} prizes
        </ThemedText>
      </View>

      <View style={styles.canvasContainer}>
        <CubeGame
          cubeSize={game.cubeSize}
          clickedPositions={allClicked}
          onCubeClick={handleCubeClick}
        />
      </View>

      <PrizeToast
        message={toastMessage}
        onDone={() => setToastMessage(null)}
      />

      <Modal
        visible={showComplete}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🎉 Cube Complete!</Text>
            <Text style={styles.modalSubtitle}>
              You won {game.prizesWon} prizes from {game.totalCubes} cubes
            </Text>
            <Pressable style={styles.button} onPress={handlePlayAgain}>
              <Text style={styles.buttonText}>Play Again</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.secondaryButton]}
              onPress={handleFinish}
            >
              <Text style={styles.secondaryButtonText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  emptyText: {
    opacity: 0.6,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  info: {
    fontSize: 14,
    fontWeight: '600',
  },
  canvasContainer: {
    flex: 1,
  },
  button: {
    backgroundColor: '#4ecdc4',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 200,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#4ecdc4',
  },
  secondaryButtonText: {
    color: '#4ecdc4',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    gap: 16,
    width: 300,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  modalSubtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
});
