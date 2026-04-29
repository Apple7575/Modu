import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet} from 'react-native';

interface Props {
  isPlaying: boolean;
  size?: 'sm' | 'lg';
}

// Gradient-like: teal edges → blue center → dark navy middle
const LG_BARS = [
  {peak: 24, dur: 640, color: '#4A9B7F'},
  {peak: 38, dur: 520, color: '#2D86D4'},
  {peak: 52, dur: 440, color: '#2563EB'},
  {peak: 62, dur: 560, color: '#1D4ED8'},
  {peak: 68, dur: 380, color: '#1A3F7F'},
  {peak: 62, dur: 560, color: '#1D4ED8'},
  {peak: 52, dur: 440, color: '#2563EB'},
  {peak: 38, dur: 520, color: '#2D86D4'},
  {peak: 24, dur: 640, color: '#4A9B7F'},
];

const SM_BARS = [
  {peak: 10, dur: 600, color: '#4A9B7F'},
  {peak: 18, dur: 480, color: '#2563EB'},
  {peak: 26, dur: 400, color: '#1D4ED8'},
  {peak: 30, dur: 540, color: '#1A3F7F'},
  {peak: 26, dur: 400, color: '#1D4ED8'},
  {peak: 18, dur: 480, color: '#2563EB'},
  {peak: 10, dur: 600, color: '#4A9B7F'},
];

const MIN_H = 4;

export default function AudioWaveform({isPlaying, size = 'sm'}: Props) {
  const bars = size === 'lg' ? LG_BARS : SM_BARS;
  const anims = useRef(bars.map(() => new Animated.Value(MIN_H))).current;
  const loopsRef = useRef<Animated.CompositeAnimation[]>([]);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (isPlaying) {
      loopsRef.current.forEach(l => l.stop());
      timersRef.current.forEach(clearTimeout);

      loopsRef.current = anims.map((anim, i) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: bars[i].peak,
              duration: bars[i].dur,
              useNativeDriver: false,
            }),
            Animated.timing(anim, {
              toValue: MIN_H,
              duration: bars[i].dur,
              useNativeDriver: false,
            }),
          ]),
        ),
      );

      timersRef.current = loopsRef.current.map((loop, i) =>
        setTimeout(() => loop.start(), i * 55),
      );
    } else {
      timersRef.current.forEach(clearTimeout);
      loopsRef.current.forEach(l => l.stop());
      loopsRef.current = [];
      anims.forEach(anim =>
        Animated.spring(anim, {
          toValue: MIN_H,
          friction: 7,
          tension: 70,
          useNativeDriver: false,
        }).start(),
      );
    }

    return () => {
      timersRef.current.forEach(clearTimeout);
      loopsRef.current.forEach(l => l.stop());
    };
  }, [isPlaying]);

  const barW = size === 'lg' ? 8 : 5;
  const gap = size === 'lg' ? 6 : 4;
  const containerH = size === 'lg' ? 80 : 44;

  return (
    <View style={[styles.container, {height: containerH, gap}]}>
      {anims.map((anim, i) => (
        <Animated.View
          key={i}
          style={{
            width: barW,
            height: anim,
            borderRadius: barW / 2,
            backgroundColor: bars[i].color,
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
