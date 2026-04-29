import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../theme';

interface Props {
  text: string;
  speed?: number;
  onDone?: () => void;
}

export default function TypingBubble({ text, speed = 28, onDone }: Props) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <View style={styles.aiBubbleWrap}>
      <View style={styles.aiBubble}>
        <Text style={styles.aiBubbleText}>
          {displayed}
          {!done && <Text style={styles.cursor}>|</Text>}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  aiBubbleWrap: { alignItems: 'flex-start' },
  aiBubble: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderTopLeftRadius: radius.xs,
    padding: spacing.base,
    maxWidth: '82%',
    ...shadows.card,
  },
  aiBubbleText: {
    ...typography.body,
    color: colors.text.primary,
    lineHeight: 24,
  },
  cursor: {
    color: colors.primary,
    fontWeight: '300',
  },
});
