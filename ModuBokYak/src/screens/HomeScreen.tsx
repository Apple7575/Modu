import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {colors, shadows, spacing, radius, typography} from '../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

const logoSource = require('../assets/logo.png');

export default function HomeScreen({navigation}: Props) {
  const insets = useSafeAreaInsets();

  return (
    // Outer view sets header color behind the status bar
    <View style={{flex: 1, backgroundColor: colors.primaryDark}}>
      <LinearGradient
        colors={[colors.primaryDark, colors.primary]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={[styles.header, {paddingTop: insets.top + spacing.md}]}>
        <View style={styles.logoRow}>
          <Image source={logoSource} style={styles.logoImage} resizeMode="contain" />
          <View>
            <Text style={styles.appName}>모두의 복약</Text>
            <Text style={styles.appSubtitle}>AI 음성 복약 관리 서비스</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {paddingBottom: insets.bottom + spacing.xl},
        ]}
        showsVerticalScrollIndicator={false}>
        {/* 복약 현황 카드 */}
        <View style={styles.card}>
          <Text style={styles.statusDate}>2026년 4월 27일 일요일</Text>
          <Text style={styles.statusName}>최미경님의 오늘 복약 현황</Text>
          <View style={styles.progressRow}>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, {width: '85%'}]} />
            </View>
            <Text style={styles.progressText}>85%</Text>
          </View>
          <Text style={styles.sectionLabel}>오늘의 복약 기록</Text>
          <View style={styles.medicineRow}>
            <View style={styles.medicineItem}>
              <View style={[styles.medIconWrap, {backgroundColor: '#ECFDF5'}]}>
                <Icon name="pill" size={24} color={colors.status.success} />
              </View>
              <Text style={styles.medicineName}>혈압약</Text>
              <View style={styles.doneTag}>
                <Icon name="check" size={12} color={colors.status.success} />
                <Text style={styles.medicineDone}> 완료</Text>
              </View>
            </View>
            <View style={styles.medicineItem}>
              <View style={[styles.medIconWrap, {backgroundColor: '#FFFBEB'}]}>
                <Icon name="pill" size={24} color={colors.status.warning} />
              </View>
              <Text style={styles.medicineName}>당뇨약</Text>
              <Text style={styles.medicinePending}>아침 예정</Text>
            </View>
          </View>
        </View>

        {/* 담당 의료진 카드 */}
        <View style={[styles.card, styles.doctorCard]}>
          <View style={styles.doctorAvatarWrap}>
            <Icon name="stethoscope" size={24} color={colors.primary} />
          </View>
          <View style={styles.doctorText}>
            <Text style={styles.doctorName}>김현우 의사 (내과)</Text>
            <Text style={styles.doctorSub}>서울 케어 병원 · 담당 의료진</Text>
          </View>
          <Icon name="chevron-right" size={20} color={colors.text.hint} />
        </View>

        {/* 시작 버튼 */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('VoiceMedication')}>
          <LinearGradient
            colors={[colors.primary, colors.primaryLight]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.startButton}>
            <Icon name="microphone" size={24} color={colors.text.white} />
            <Text style={styles.startButtonText} numberOfLines={1}>
              음성 복약 관리 시작
            </Text>
            <Icon name="chevron-right" size={22} color="rgba(255,255,255,0.7)" />
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.hint}>
          AI가 음성으로 복약을 안내하고 건강 상태를 기록합니다
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  logoImage: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  appName: {
    ...typography.h2,
    color: colors.text.white,
  },
  appSubtitle: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.82)',
    marginTop: 2,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.card,
  },
  statusDate: {
    ...typography.caption,
    color: colors.text.hint,
    marginBottom: spacing.xs,
  },
  statusName: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  progressBg: {
    flex: 1,
    height: 9,
    backgroundColor: colors.borderLight,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: 9,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  progressText: {
    ...typography.smallBold,
    color: colors.primary,
    minWidth: 38,
    textAlign: 'right',
  },
  sectionLabel: {
    ...typography.small,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  medicineRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  medicineItem: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  medIconWrap: {
    width: 50,
    height: 50,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  medicineName: {
    ...typography.smallBold,
    color: colors.text.primary,
  },
  doneTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicineDone: {
    ...typography.caption,
    color: colors.status.success,
    fontWeight: '600',
  },
  medicinePending: {
    ...typography.caption,
    color: colors.status.warning,
    fontWeight: '600',
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.base,
  },
  doctorAvatarWrap: {
    width: 46,
    height: 46,
    borderRadius: radius.full,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorText: {
    flex: 1,
  },
  doctorName: {
    ...typography.bodyBold,
    color: colors.text.primary,
  },
  doctorSub: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 3,
  },
  startButton: {
    borderRadius: radius.lg,
    height: 64,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    ...shadows.button,
  },
  startButtonText: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: colors.text.white,
  },
  hint: {
    textAlign: 'center',
    ...typography.caption,
    color: colors.text.hint,
    paddingHorizontal: spacing.lg,
  },
});
