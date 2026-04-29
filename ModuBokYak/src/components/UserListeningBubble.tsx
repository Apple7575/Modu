import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, radius, shadows, spacing, typography } from '../theme';

interface Props {
  text: string;
  listeningDuration?: number;
}

export default function UserListeningBubble({ text, listeningDuration = 1400 }: Props) {
  const [phase, setPhase] = useState<'listening' | 'text'>('listening');
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;
  const fadeOut = useRef(new Animated.Value(1)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    const makeDot = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0.3, duration: 300, useNativeDriver: true }),
          Animated.delay(600 - delay),
        ]),
      );

    loopRef.current = Animated.parallel([
      makeDot(dot1, 0),
      makeDot(dot2, 200),
      makeDot(dot3, 400),
    ]);
    loopRef.current.start();

    const t = setTimeout(() => {
      loopRef.current?.stop();
      Animated.parallel([
        Animated.timing(fadeOut, { toValue: 0, duration: 180, useNativeDriver: true }),
        Animated.timing(fadeIn, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start(() => setPhase('text'));
    }, listeningDuration);

    return () => {
      clearTimeout(t);
      loopRef.current?.stop();
    };
  }, []);

  return (
    <View style={styles.wrap}>
      {/* 인식 중 */}
      {phase === 'listening' && (
        <Animated.View style={[styles.listeningBubble, { opacity: fadeOut }]}>
          <Icon name="microphone" size={14} color="rgba(255,255,255,0.8)" />
          <View style={styles.dots}>
            {[dot1, dot2, dot3].map((d, i) => (
              <Animated.View key={i} style={[styles.dot, { opacity: d }]} />
            ))}
          </View>
        </Animated.View>
      )}
      {/* 실제 텍스트 */}
      {phase === 'text' && (
        <Animated.View style={[styles.textBubble, { opacity: fadeIn }]}>
          <Text style={styles.textBubbleText}>{text}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'flex-end' },
  listeningBubble: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.lg,
    borderTopRightRadius: radius.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dots: { flexDirection: 'row', gap: 5, alignItems: 'center' },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  textBubble: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    borderTopRightRadius: radius.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    maxWidth: '70%',
  },
  textBubbleText: {
    ...typography.bodyBold,
    color: colors.text.white,
  },
});
