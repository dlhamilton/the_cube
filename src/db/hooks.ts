import { useState, useEffect, useCallback } from 'react';
import { eq, desc, sql } from 'drizzle-orm';
import { useDatabase } from './provider';
import { games, clicks, type Game } from './schema';
import { rollForPrize } from '../lib/prizes';

export function useCurrentGame() {
  const db = useDatabase();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const result = await db
      .select()
      .from(games)
      .where(eq(games.status, 'active'))
      .orderBy(desc(games.createdAt))
      .limit(1);
    setGame(result[0] ?? null);
    setLoading(false);
  }, [db]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createGame = useCallback(
    async (cubeSize: number) => {
      const totalCubes = cubeSize * cubeSize * cubeSize;
      const result = await db
        .insert(games)
        .values({
          cubeSize,
          totalCubes,
          cubesRemaining: totalCubes,
          createdAt: new Date().toISOString(),
        })
        .returning();
      setGame(result[0]);
      return result[0];
    },
    [db],
  );

  return { game, loading, refresh, createGame };
}

export function useGameClicks(gameId: number | undefined) {
  const db = useDatabase();
  const [clickedPositions, setClickedPositions] = useState<
    Set<string>
  >(new Set());

  const refresh = useCallback(async () => {
    if (!gameId) return;
    const result = await db
      .select()
      .from(clicks)
      .where(eq(clicks.gameId, gameId));
    setClickedPositions(
      new Set(result.map((c) => `${c.x},${c.y},${c.z}`)),
    );
  }, [db, gameId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { clickedPositions, refresh };
}

export function useRecordClick(gameId: number | undefined) {
  const db = useDatabase();

  return useCallback(
    async (x: number, y: number, z: number) => {
      if (!gameId) return null;

      const prize = rollForPrize();

      await db.insert(clicks).values({
        gameId,
        x,
        y,
        z,
        isWinner: prize.won ? 1 : 0,
        prizeName: prize.prizeName ?? null,
        clickedAt: new Date().toISOString(),
      });

      // Update game counters
      await db
        .update(games)
        .set({
          cubesRemaining: sql`${games.cubesRemaining} - 1`,
          prizesWon: prize.won
            ? sql`${games.prizesWon} + 1`
            : games.prizesWon,
        })
        .where(eq(games.id, gameId));

      return prize;
    },
    [db, gameId],
  );
}

export function useCompleteGame() {
  const db = useDatabase();

  return useCallback(
    async (gameId: number) => {
      await db
        .update(games)
        .set({
          status: 'completed',
          completedAt: new Date().toISOString(),
        })
        .where(eq(games.id, gameId));
    },
    [db],
  );
}

export function useAbandonGame() {
  const db = useDatabase();

  return useCallback(
    async (gameId: number) => {
      await db
        .update(games)
        .set({
          status: 'abandoned',
          completedAt: new Date().toISOString(),
        })
        .where(eq(games.id, gameId));
    },
    [db],
  );
}

export function useGameHistory() {
  const db = useDatabase();
  const [history, setHistory] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const result = await db
      .select()
      .from(games)
      .orderBy(desc(games.createdAt));
    setHistory(result);
    setLoading(false);
  }, [db]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { history, loading, refresh };
}

export function usePlayerStats() {
  const db = useDatabase();
  const [stats, setStats] = useState({
    totalGames: 0,
    completedGames: 0,
    totalClicks: 0,
    totalPrizes: 0,
    biggestCube: 0,
    winRate: 0,
  });

  const refresh = useCallback(async () => {
    const allGames = await db.select().from(games);
    const allClicks = await db.select().from(clicks);

    const completedGames = allGames.filter(
      (g) => g.status === 'completed',
    );
    const totalPrizes = allGames.reduce(
      (sum, g) => sum + g.prizesWon,
      0,
    );
    const biggestCube = allGames.reduce(
      (max, g) => Math.max(max, g.cubeSize),
      0,
    );
    const winningClicks = allClicks.filter(
      (c) => c.isWinner === 1,
    ).length;

    setStats({
      totalGames: allGames.length,
      completedGames: completedGames.length,
      totalClicks: allClicks.length,
      totalPrizes,
      biggestCube,
      winRate:
        allClicks.length > 0
          ? Math.round((winningClicks / allClicks.length) * 100)
          : 0,
    });
  }, [db]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { stats, refresh };
}
