import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { SubCube } from './SubCube';

// Color palette for the cubes
const COLORS = [
  '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7',
  '#dda0dd', '#98d8c8', '#f7dc6f', '#bb8fce',
  '#85c1e9', '#82e0aa', '#f8c471', '#d7bde2',
];

function getColor(x: number, y: number, z: number, size: number): string {
  const idx = (x + y * size + z * size * size) % COLORS.length;
  return COLORS[idx];
}

interface CubeGridProps {
  cubeSize: number;
  clickedPositions: Set<string>;
  onCubeClick: (x: number, y: number, z: number) => void;
}

function CubeGrid({ cubeSize, clickedPositions, onCubeClick }: CubeGridProps) {
  const cubes = useMemo(() => {
    const result: { x: number; y: number; z: number; pos: [number, number, number] }[] = [];
    const offset = (cubeSize - 1) / 2;
    for (let x = 0; x < cubeSize; x++) {
      for (let y = 0; y < cubeSize; y++) {
        for (let z = 0; z < cubeSize; z++) {
          const key = `${x},${y},${z}`;
          if (!clickedPositions.has(key)) {
            result.push({
              x,
              y,
              z,
              pos: [x - offset, y - offset, z - offset],
            });
          }
        }
      }
    }
    return result;
  }, [cubeSize, clickedPositions]);

  return (
    <>
      {cubes.map((cube) => (
        <SubCube
          key={`${cube.x},${cube.y},${cube.z}`}
          position={cube.pos}
          size={1}
          color={getColor(cube.x, cube.y, cube.z, cubeSize)}
          onClick={() => onCubeClick(cube.x, cube.y, cube.z)}
        />
      ))}
    </>
  );
}

interface CubeGameProps {
  cubeSize: number;
  clickedPositions: Set<string>;
  onCubeClick: (x: number, y: number, z: number) => void;
}

export function CubeGame({ cubeSize, clickedPositions, onCubeClick }: CubeGameProps) {
  const cameraDistance = cubeSize * 1.8;

  return (
    <Canvas
      camera={{
        position: [cameraDistance, cameraDistance, cameraDistance],
        fov: 50,
      }}
      style={{ flex: 1 }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />
      <CubeGrid
        cubeSize={cubeSize}
        clickedPositions={clickedPositions}
        onCubeClick={onCubeClick}
      />
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={cubeSize}
        maxDistance={cubeSize * 4}
      />
    </Canvas>
  );
}
