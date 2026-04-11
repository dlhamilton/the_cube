const PRIZE_NAMES = [
  'Golden Star',
  'Diamond Shard',
  'Ruby Fragment',
  'Emerald Piece',
  'Sapphire Chunk',
  'Crystal Core',
  'Neon Spark',
  'Cosmic Dust',
  'Plasma Orb',
  'Shadow Gem',
];

const WIN_PROBABILITY = 0.2; // 20% chance

export function rollForPrize(): { won: boolean; prizeName?: string } {
  const roll = Math.random();
  if (roll < WIN_PROBABILITY) {
    const prizeName =
      PRIZE_NAMES[Math.floor(Math.random() * PRIZE_NAMES.length)];
    return { won: true, prizeName };
  }
  return { won: false };
}

export function getRandomCubeSize(): number {
  return Math.floor(Math.random() * 4) + 3; // 3 to 6
}
