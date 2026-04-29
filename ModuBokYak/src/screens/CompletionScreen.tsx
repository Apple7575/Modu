import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/AppNavigator';
import {colors, shadows, spacing, radius, typography} from '../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Completion'>;
  route: RouteProp<RootStackParamList, 'Completion'>;
};

export default function CompletionScreen({navigation, route}: Props) {
  const {tookMedicine, healthStatus} = route.params;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const now = new Date();
  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const isPM = hours >= 12;
  const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const timeStr = `${isPM ? '오후' : '오전'} ${displayHour}:${minutes}`;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusColor = tookMedicine ? colors.status.success : colors.status.warning;
  const statusBg = tookMedicine ? '#ECFDF5' : '#FFFBEB';
  const statusBorder = tookMedicine ? colors.status.success : colors.status.warning;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[styles.iconWrap, {transform: [{scale: scaleAnim}]}]}>
          <View
            style={[
              styles.iconCircle,
              {backgroundColor: statusBg, borderColor: statusBorder},
            ]}>
            <Icon
              name={tookMedicine ? 'check-circle' : 'alert-circle'}
              size={48}
              color={statusColor}
            />
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.content,
            {opacity: fadeAnim, transform: [{translateY: slideAnim}]},
          ]}>
          <Text style={[styles.title, {color: statusColor}]}>
            {tookMedicine ? '복약 완료' : '복약 미완료'}
          </Text>
          <Text style={styles.subtitle}>건강 상태 기록 완료</Text>

          <View style={styles.reportCard}>
            <View style={styles.reportHeader}>
              <View style={styles.reportHeaderIconWrap}>
                <Icon name="clipboard-text-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.reportHeaderText}>오늘의 복약 리포트</Text>
            </View>
            <View style={styles.divider} />

            <ReportRow label="복약 여부">
              <View style={styles.reportValueRow}>
                <Icon
                  name={tookMedicine ? 'check-circle' : 'close-circle'}
                  size={14}
                  color={tookMedicine ? colors.status.success : colors.status.error}
                />
                <Text
                  style={[
                    styles.reportValue,
                    {color: tookMedicine ? colors.status.success : colors.status.error},
                  ]}>
                  {' '}{tookMedicine ? '완료' : '미완료'}
                </Text>
              </View>
            </ReportRow>

            <ReportRow label="기록 시간">
              <Text style={styles.reportValue}>{timeStr}</Text>
            </ReportRow>

            <ReportRow label="복용 약">
              <Text style={styles.reportValue}>혈압약, 당뇨약</Text>
            </ReportRow>

            <ReportRow label="건강 상태">
              <Text style={styles.reportValue}>{healthStatus}</Text>
            </ReportRow>

            <ReportRow label="담당 의료진" isLast>
              <Text style={styles.reportValue}>김현우 의사 (내과)</Text>
            </ReportRow>
          </View>

          <View style={styles.transmitBanner}>
            <View style={styles.transmitIconWrap}>
              <Icon name="broadcast" size={22} color={colors.primary} />
            </View>
            <View style={styles.transmitTextArea}>
              <Text style={styles.transmitTitle}>
                이 데이터가 의료진에게 전달됩니다
              </Text>
              <Text style={styles.transmitSub}>
                다음 진료 시 복약 이력 및 건강 상태가 자동으로 공유됩니다
              </Text>
            </View>
          </View>

          <View style={styles.doctorCard}>
            <View style={styles.doctorAvatarWrap}>
              <Icon name="stethoscope" size={22} color={colors.primary} />
            </View>
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>김현우 의사 (내과)</Text>
              <View style={styles.doctorStatusRow}>
                <Icon name="check-circle" size={12} color={colors.status.success} />
                <Text style={styles.doctorStatus}> 리포트 수신 완료 · 서울 케어 병원</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
              navigation.reset({index: 0, routes: [{name: 'Home'}]})
            }>
            <LinearGradient
              colors={[colors.primary, colors.primaryLight]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.homeButton}>
              <Icon name="home-outline" size={20} color={colors.text.white} />
              <Text style={styles.homeButtonText}>홈으로 돌아가기</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ReportRow({
  label,
  children,
  isLast,
}: {
  label: string;
  children: React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <View style={[reportRowStyles.row, isLast && {borderBottomWidth: 0}]}>
      <Text style={reportRowStyles.label}>{label}</Text>
      {children}
    </View>
  );
}

const reportRowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  label: {
    ...typography.small,
    color: colors.text.secondary,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingBottom: 48,
    alignItems: 'center',
    paddingTop: 36,
    paddingHorizontal: spacing.lg,
  },
  iconWrap: {
    marginBottom: spacing.base,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
  },
  reportCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.card,
    marginBottom: spacing.base,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  reportHeaderIconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportHeaderText: {
    ...typography.bodyBold,
    color: colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.sm,
  },
  reportValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportValue: {
    ...typography.smallBold,
    color: colors.text.primary,
  },
  transmitBanner: {
    width: '100%',
    backgroundColor: '#EFF6FF',
    borderRadius: radius.lg,
    padding: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    marginBottom: spacing.base,
  },
  transmitIconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: 'rgba(29,78,216,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  transmitTextArea: {
    flex: 1,
  },
  transmitTitle: {
    ...typography.smallBold,
    color: '#1D4ED8',
    marginBottom: 3,
  },
  transmitSub: {
    ...typography.caption,
    color: '#3B82F6',
    lineHeight: 18,
  },
  doctorCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    ...shadows.card,
    marginBottom: spacing.xl,
  },
  doctorAvatarWrap: {
    width: 46,
    height: 46,
    borderRadius: radius.full,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    ...typography.bodyBold,
    color: colors.text.primary,
  },
  doctorStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  doctorStatus: {
    ...typography.caption,
    color: colors.status.success,
  },
  homeButton: {
    width: '100%',
    borderRadius: radius.lg,
    height: 64,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    ...shadows.button,
    minWidth: 280,
  },
  homeButtonText: {
    ...typography.h3,
    color: colors.text.white,
  },
});
