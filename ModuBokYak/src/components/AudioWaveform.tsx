import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet, Easing} from 'react-native';

interface Props {
  isPlaying: boolean;
  size?: 'sm' | 'lg';
}

const LG_BARS = [
  {maxScale: 0.10, dur: 820, color: '#93C5FD'},
  {maxScale: 0.20, dur: 740, color: '#7CB9FA'},
  {maxScale: 0.35, dur: 660, color: '#60A5FA'},
  {maxScale: 0.52, dur: 580, color: '#3B82F6'},
  {maxScale: 0.70, dur: 500, color: '#2563EB'},
  {maxScale: 0.86, dur: 420, color: '#1D4ED8'},
  {maxScale: 0.96, dur: 370, color: '#1E3A8A'},
  {maxScale: 1.00, dur: 340, color: '#1E3A8A'},
  {maxScale: 0.96, dur: 370, color: '#1E3A8A'},
  {maxScale: 0.86, dur: 420, color: '#1D4ED8'},
  {maxScale: 0.70, dur: 500, color: '#2563EB'},
  {maxScale: 0.52, dur: 580, color: '#3B82F6'},
  {maxScale: 0.35, dur: 660, color: '#60A5FA'},
  {maxScale: 0.20, dur: 740, color: '#7CB9FA'},
  {maxScale: 0.10, dur: 820, color: '#93C5FD'},
];

const SM_BARS = [
  {maxScale: 0.12, dur: 780, color: '#93C5FD'},
  {maxScale: 0.30, dur: 660, color: '#60A5FA'},
  {maxScale: 0.55, dur: 540, color: '#3B82F6'},
  {maxScale: 0.80, dur: 440, color: '#2563EB'},
  {maxScale: 1.00, dur: 380, color: '#1D4ED8'},
  {maxScale: 0.80, dur: 440, color: '#2563EB'},
  {maxScale: 0.55, dur: 540, color: '#3B82F6'},
  {maxScale: 0.30, dur: 660, color: '#60A5FA'},
  {maxScale: 0.12, dur: 780, color: '#93C5FD'},
];

const MIN_SCALE = 0.05;
const BAR_H_LG = 68;
const BAR_H_SM = 34;

export default function AudioWaveform({isPlaying, size = 'sm'}: Props) {
  const bars = size === 'lg' ? LG_BARS : SM_BARS;
  const barH = size === 'lg' ? BAR_H_LG : BAR_H_SM;
  const barW = size === 'lg' ? 4 : 3;
  const gap = size === 'lg' ? 6 : 4;

  const anims = useRef(bars.map(() => new Animated.Value(MIN_SCALE))).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;
  const loopsRef = useRef<Animated.CompositeAnimation[]>([]);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    loopsRef.current.forEach(l => l.stop());
    timersRef.current.forEach(clearTimeout);
    loopsRef.current = [];
    timersRef.current = [];

    if (isPlaying) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {toValue: 1.03, duration: 1000, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
          Animated.timing(pulseAnim, {toValue: 1, duration: 1000, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
        ]),
      );
      const glow = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {toValue: 0.85, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
          Animated.timing(glowAnim, {toValue: 0.4, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
        ]),
      );
      pulse.start();
      glow.start();
      loopsRef.current.push(pulse, glow);

      const barLoops = anims.map((anim, i) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {toValue: bars[i].maxScale, duration: bars[i].dur, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
            Animated.timing(anim, {toValue: MIN_SCALE, duration: bars[i].dur, easing: Easing.inOut(Easing.sin), useNativeDriver: true}),
          ]),
        ),
      );
      loopsRef.current.push(...barLoops);
      timersRef.current = barLoops.map((loop, i) =>
        setTimeout(() => loop.start(), i * 45),
      );
    } else {
      Animated.spring(pulseAnim, {toValue: 1, friction: 8, useNativeDriver: true}).start();
      Animated.timing(glowAnim, {toValue: 0.4, duration: 300, useNativeDriver: true}).start();
      anims.forEach(anim =>
        Animated.spring(anim, {toValue: MIN_SCALE, friction: 6, tension: 80, useNativeDriver: true}).start(),
      );
    }

    return () => {
      timersRef.current.forEach(clearTimeout);
      loopsRef.current.forEach(l => l.stop());
    };
  }, [isPlaying]);

  return (
    <Animated.View style={[styles.wrapper, {transform: [{scale: pulseAnim}]}]}>
      {/* 글로우 링 */}
      {size === 'lg' && (
        <Animated.View style={[styles.glowRing, {opacity: glowAnim}]} />
      )}
      <View style={styles.pill}>
        <View style={[styles.barsRow, {gap}]}>
          {anims.map((anim, i) => (
            <View key={i} style={{width: barW, height: barH, justifyContent: 'center', alignItems: 'center'}}>
              <Animated.View
                style={{
                  width: barW,
                  height: barH,
                  borderRadius: barW / 2,
                  backgroundColor: bars[i].color,
                  transform: [{scaleY: anim}],
                }}
              />
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute',
    width: 180,
    height: 90,
    borderRadius: 45,
    borderWidth: 1.5,
    borderColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 0,
  },
  pill: {
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
