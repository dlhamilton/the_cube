import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

interface PrizeToastProps {
  message: string | null;
  onDone: () => void;
}

export function PrizeToast({ message, onDone }: PrizeToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (message) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(1500),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => onDone());
    }
  }, [message]);

  if (!message) return null;

  const isWin = message.includes('Won');

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity },
        isWin ? styles.win : styles.lose,
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    zIndex: 100,
  },
  win: {
    backgroundColor: '#2ecc71',
  },
  lose: {
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
