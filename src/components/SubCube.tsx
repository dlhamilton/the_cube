import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SubCubeProps {
  position: [number, number, number];
  size: number;
  onClick: () => void;
  color: string;
}

export function SubCube({ position, size, onClick, color }: SubCubeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [removing, setRemoving] = useState(false);
  const scaleRef = useRef(1);

  useFrame((_, delta) => {
    if (removing && meshRef.current) {
      scaleRef.current = Math.max(0, scaleRef.current - delta * 4);
      meshRef.current.scale.setScalar(scaleRef.current);
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (removing) return;
    setRemoving(true);
    // Delay the actual removal to let animation play
    setTimeout(onClick, 250);
  };

  if (scaleRef.current <= 0.01 && removing) return null;

  const gap = 0.08;
  const cubeSize = size - gap;

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
      <meshStandardMaterial
        color={hovered ? '#ff6b6b' : color}
        roughness={0.4}
        metalness={0.3}
      />
    </mesh>
  );
}
