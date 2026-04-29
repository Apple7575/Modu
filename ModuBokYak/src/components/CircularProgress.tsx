import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';

interface Props {
  percent: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
}

export default function CircularProgress({
  percent,
  size = 120,
  strokeWidth = 10,
  color = colors.primary,
  bgColor = colors.borderLight,
}: Props) {
  const half = size / 2;
  const r = half - strokeWidth / 2;

  // 두 반원을 회전시켜 호를 표현
  // 0~50%: 오른쪽 반원만 회전
  // 50~100%: 오른쪽 전체 + 왼쪽 반원 회전
  const rightDeg = Math.min(percent, 50) / 50 * 180;
  const leftDeg = percent > 50 ? (percent - 50) / 50 * 180 : 0;

  const halfCircleStyle = {
    width: half,
    height: size,
    borderRadius: 0,
    overflow: 'hidden' as const,
    position: 'absolute' as const,
  };

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* 배경 원 */}
      <View style={[styles.ring, {
        width: size, height: size, borderRadius: half,
        borderWidth: strokeWidth, borderColor: bgColor,
      }]} />

      {/* 진행 호 — 오른쪽 반 */}
      <View style={[halfCircleStyle, { left: half, top: 0 }]}>
        <View style={{
          width: size, height: size, borderRadius: half,
          borderWidth: strokeWidth, borderColor: 'transparent',
          borderRightColor: color, borderTopColor: rightDeg > 90 ? color : 'transparent',
          transform: [{ rotate: `${rightDeg - 135}deg` }],
          position: 'absolute', left: -half,
        }} />
      </View>

      {/* 진행 호 — 왼쪽 반 (50% 넘을 때) */}
      {percent > 50 && (
        <View style={[halfCircleStyle, { left: 0, top: 0 }]}>
          <View style={{
            width: size, height: size, borderRadius: half,
            borderWidth: strokeWidth, borderColor: 'transparent',
            borderLeftColor: color, borderTopColor: leftDeg > 90 ? color : 'transparent',
            transform: [{ rotate: `${-(leftDeg - 135)}deg` }],
            position: 'absolute', left: 0,
          }} />
        </View>
      )}

      {/* 중앙 텍스트 */}
      <View style={styles.center}>
        <Text style={[styles.percentText, { color }]}>{percent}%</Text>
        <Text style={styles.label}>복약 완료</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: { position: 'absolute' },
  center: { alignItems: 'center' },
  percentText: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  label: { ...typography.caption, color: colors.text.hint, marginTop: 2 },
});
