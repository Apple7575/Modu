import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors, shadows, spacing, radius, typography } from '../theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'MedicalDashboard'>;
};

const PATIENT = {
  name: '김복순',
  age: 73,
  gender: 'F',
  regNo: '2018-0042871',
  diagnosis: '당뇨 8년차 · 고혈압 동반',
  lastVisit: '2026.04.05',
  nextVisit: '2026.05.10',
  prescribedAt: '4/5 발행, 30일분',
  drugs: [
    { name: 'Metformin', dose: '1000mg', freq: '1T bid' },
    { name: 'Dapagliflozin', dose: '10mg', freq: '1T qd' },
    { name: 'Amlodipine', dose: '5mg', freq: '1T qd' },
    { name: 'Atorvastatin', dose: '20mg', freq: '1T qd' },
    { name: 'Famotidine', dose: '20mg', freq: '1T bid' },
    { name: 'Aspirin', dose: '100mg', freq: '1T qd' },
  ],
};

type CalendarEntry = {
  date: string;
  status: 'complete' | 'partial' | 'missed' | 'complete_alert';
  alert?: string;
};

const CALENDAR_DATA: CalendarEntry[] = [
  { date: '4/5', status: 'complete' },
  { date: '4/6', status: 'complete' },
  { date: '4/7', status: 'complete' },
  { date: '4/8', status: 'partial' },
  { date: '4/9', status: 'complete' },
  { date: '4/10', status: 'complete' },
  { date: '4/11', status: 'complete' },
  { date: '4/12', status: 'complete_alert', alert: '"가슴이 답답해"' },
  { date: '4/13', status: 'complete' },
  { date: '4/14', status: 'complete' },
  { date: '4/15', status: 'complete' },
  { date: '4/16', status: 'missed' },
  { date: '4/17', status: 'missed' },
  { date: '4/18', status: 'missed', alert: '"어지러워"' },
  { date: '4/19', status: 'complete' },
  { date: '4/20', status: 'complete' },
  { date: '4/21', status: 'complete' },
  { date: '4/22', status: 'complete_alert', alert: '"어지러워"' },
  { date: '4/23', status: 'complete' },
  { date: '4/24', status: 'complete' },
  { date: '4/25', status: 'partial', alert: '"속이 좀 쓰려"' },
  { date: '4/26', status: 'complete' },
  { date: '4/27', status: 'complete' },
  { date: '4/28', status: 'complete' },
  { date: '4/29', status: 'complete' },
  { date: '4/30', status: 'complete' },
  { date: '5/1', status: 'complete' },
  { date: '5/2', status: 'complete' },
];

const ALERTS = [
  {
    iconName: 'alert-circle',
    title: '즉시 확인',
    date: '4/12 22:14',
    body: '"가슴이 답답해"',
    color: colors.status.error,
  },
  {
    iconName: 'calendar-alert',
    title: '패턴 변화',
    date: '4/16~18',
    body: '저녁약 3일 누락',
    color: colors.status.orange,
  },
  {
    iconName: 'trending-up',
    title: '증상 빈도',
    date: '',
    body: '어지럼증 1회 → 3회',
    color: colors.status.warning,
  },
];

const ADHERENCE = [95, 70, 85, 92];

const COMPLAINTS = [
  { date: '4/12', time: '22:14', text: '"가슴이 답답해"' },
  { date: '4/18', time: '', text: '"어지러워"' },
  { date: '4/22', time: '', text: '"어지러워"' },
  { date: '4/25', time: '', text: '"속이 좀 쓰려"' },
];

const OTC_DRUGS = [
  { name: '글루코사민 1500mg', since: '4/15~' },
  { name: '비타민 D3 1000IU', since: '지속' },
];

const RECOMMENDED_SUPPLEMENTS = [
  {
    name: '오메가3 (EPA/DHA 1g)',
    reason: '당뇨+고혈압 동반 → 심혈관 보호 차원 권장',
  },
  {
    name: '고함량 비타민B (B12 포함)',
    reason: 'Metformin 장기 복용자 B12 흡수 저하 보고 → 보충 권장',
  },
];

function statusColor(status: CalendarEntry['status']): string {
  switch (status) {
    case 'complete':
      return '#D1FAE5';
    case 'complete_alert':
      return '#D1FAE5';
    case 'partial':
      return '#FEF3C7';
    case 'missed':
      return '#FEE2E2';
  }
}

function statusMarker(status: CalendarEntry['status']): string {
  switch (status) {
    case 'complete':
      return '●';
    case 'complete_alert':
      return '●';
    case 'partial':
      return '◐';
    case 'missed':
      return '✕';
  }
}

function statusMarkerColor(status: CalendarEntry['status']): string {
  switch (status) {
    case 'complete':
      return colors.status.success;
    case 'complete_alert':
      return colors.status.success;
    case 'partial':
      return colors.status.warning;
    case 'missed':
      return colors.status.error;
  }
}

export default function MedicalDashboardScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'doctor' | 'pharmacist'>('doctor');

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* 헤더 */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={28} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>의료진 대시보드</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}>

        {/* 공통 헤더 — 환자 정보 */}
        <View style={styles.patientCard}>
          <View style={styles.patientTopRow}>
            <View style={styles.patientNameRow}>
              <Text style={styles.patientName}>{PATIENT.name}</Text>
              <Text style={styles.patientMeta}>
                {' '}(만 {PATIENT.age}·{PATIENT.gender})
              </Text>
            </View>
            <Text style={styles.patientRegNo}>{PATIENT.regNo}</Text>
          </View>
          <Text style={styles.patientDiagnosis}>{PATIENT.diagnosis}</Text>
          <View style={styles.divider} />
          <Text style={styles.prescriptionLabel}>
            현재 처방 ({PATIENT.prescribedAt}):
          </Text>
          <Text style={styles.prescriptionDrugs}>
            {PATIENT.drugs.map(d => `${d.name} ${d.dose} ${d.freq}`).join(' · ')}
          </Text>
          <View style={styles.divider} />
          <Text style={styles.visitInfo}>
            최종 진료 {PATIENT.lastVisit}  ·  다음 진료 {PATIENT.nextVisit}
          </Text>
        </View>

        {/* 토글 탭 */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'doctor' && styles.tabActive]}
            onPress={() => setActiveTab('doctor')}>
            <Icon
              name="stethoscope"
              size={16}
              color={activeTab === 'doctor' ? colors.text.white : colors.text.hint}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'doctor' && styles.tabTextActive,
              ]}>
              의사 뷰
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'pharmacist' && styles.tabActive]}
            onPress={() => setActiveTab('pharmacist')}>
            <Icon
              name="pill"
              size={16}
              color={activeTab === 'pharmacist' ? colors.text.white : colors.text.hint}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'pharmacist' && styles.tabTextActive,
              ]}>
              약사 뷰
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'doctor' ? (
          <DoctorView />
        ) : (
          <PharmacistView />
        )}
      </ScrollView>
    </View>
  );
}

function DoctorView() {
  const maxAdherence = 100;

  return (
    <>
      {/* A — AI 요약 */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryAccent} />
        <View style={styles.summaryContent}>
          <View style={styles.cardIconRow}>
            <View style={styles.cardIconWrap}>
              <Icon name="clipboard-text-outline" size={18} color={colors.primary} />
            </View>
            <Text style={styles.cardTitle}>진료 전 한눈에 (AI 정리)</Text>
          </View>
          <Text style={styles.summaryText}>
            지난 30일 · 복약 순응도{' '}
            <Text style={styles.summaryBold}>87%</Text>
            {' '}· 어지럼증{' '}
            <Text style={styles.summaryBold}>3회</Text>
            {' '}· 저녁약 누락{' '}
            <Text style={styles.summaryBold}>3일</Text>
            {' '}· 잔여 예상{' '}
            <Text style={styles.summaryBold}>4일분</Text>
          </Text>
        </View>
      </View>

      {/* C — 모니터링 알림 (풀 너비) */}
      <View style={styles.card}>
        <View style={styles.cardIconRow}>
          <View style={styles.cardIconWrap}>
            <Icon name="bell-alert-outline" size={18} color={colors.primary} />
          </View>
          <Text style={styles.cardTitle}>모니터링 알림</Text>
        </View>
        {ALERTS.map((alert, idx) => (
          <View
            key={idx}
            style={[styles.alertCard, { borderLeftColor: alert.color }]}>
            <View style={styles.alertLevelRow}>
              <Icon name={alert.iconName} size={16} color={alert.color} />
              <Text style={[styles.alertLevelText, { color: alert.color }]}>
                {alert.title}
              </Text>
            </View>
            {alert.date ? (
              <Text style={styles.alertDate}>{alert.date}</Text>
            ) : null}
            <Text style={styles.alertBody}>{alert.body}</Text>
            {idx === 2 && (
              <View style={styles.referenceBox}>
                <View style={styles.alertLevelRow}>
                  <Icon name="information-outline" size={13} color={colors.text.secondary} />
                  <Text style={styles.referenceTitle}>진료 참고</Text>
                </View>
                <Text style={styles.referenceText}>
                  SGLT-2i 계열은 어지럼증·기립성 저혈압 사례 보고된 바 있음 — 진료 시 참조용 정보입니다
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>


      {/* B — 캘린더 히트맵 (풀 너비) */}
      <View style={styles.card}>
        <View style={styles.cardIconRow}>
          <View style={styles.cardIconWrap}>
            <Icon name="calendar-month-outline" size={18} color={colors.primary} />
          </View>
          <Text style={styles.cardTitle}>30일 복약 이력</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <Icon name="circle" size={10} color={colors.status.success} />
            <Text style={styles.legendLabel}>정상</Text>
          </View>
          <View style={styles.legendItem}>
            <Icon name="circle-half-full" size={10} color={colors.status.warning} />
            <Text style={styles.legendLabel}>부분</Text>
          </View>
          <View style={styles.legendItem}>
            <Icon name="close-circle" size={10} color={colors.status.error} />
            <Text style={styles.legendLabel}>누락</Text>
          </View>
          <View style={styles.legendItem}>
            <Icon name="alert-circle-outline" size={10} color={colors.status.warning} />
            <Text style={styles.legendLabel}>이상</Text>
          </View>
        </View>
        <View style={styles.calendarGrid}>
          {CALENDAR_DATA.map(entry => (
            <View
              key={entry.date}
              style={[
                styles.calendarCell,
                { backgroundColor: statusColor(entry.status) },
              ]}>
              <Text style={styles.calendarDate}>{entry.date}</Text>
              <Icon
                name={
                  entry.status === 'missed'
                    ? 'close-circle'
                    : entry.status === 'partial'
                      ? 'circle-half-full'
                      : 'circle'
                }
                size={10}
                color={statusMarkerColor(entry.status)}
              />
              {entry.alert && <View style={styles.alertDot} />}
            </View>
          ))}
        </View>
      </View>


      {/* D — 잔여 처방약 */}
      <View style={styles.card}>
        <View style={styles.cardIconRow}>
          <View style={styles.cardIconWrap}>
            <Icon name="magnify" size={18} color={colors.primary} />
          </View>
          <Text style={styles.cardTitle}>잔여 처방약 예상치</Text>
        </View>
        <Text style={styles.bodyText}>
          Metformin · Atorvastatin · Aspirin · Famotidine
        </Text>
        <Text style={styles.bodyText}>
          약 <Text style={styles.bodyBold}>4일분</Text> 잔여 보유 추정 (저녁약 누락 패턴 반영)
        </Text>
        <Text style={styles.hintText}>→ 다음 처방 일수 결정 시 참고</Text>
      </View>

      {/* E — 복약 순응도 추이 */}
      <View style={styles.card}>
        <View style={styles.cardIconRow}>
          <View style={styles.cardIconWrap}>
            <Icon name="chart-bar" size={18} color={colors.primary} />
          </View>
          <Text style={styles.cardTitle}>복약 순응도 추이 (4주)</Text>
        </View>
        <View style={styles.barChartWrap}>
          {ADHERENCE.map((val, idx) => (
            <View key={idx} style={styles.barCol}>
              <Text style={styles.barLabel}>{val}%</Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { height: `${(val / maxAdherence) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.barWeek}>{idx + 1}주</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 면책 고지 */}
      <View style={styles.disclaimerRow}>
        <Icon name="information-outline" size={14} color={colors.text.hint} />
        <Text style={styles.disclaimerText}>
          본 리포트는 환자 자가 응답 기반 모니터링 데이터이며, 의학적 진단·처방 결정은 진료 의사에게 있습니다.
        </Text>
      </View>
    </>
  );
}

function PharmacistView() {
  return (
    <>
      {/* F — AI 코칭 포인트 */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryAccent} />
        <View style={styles.summaryContent}>
          <View style={styles.cardIconRow}>
            <View style={styles.cardIconWrap}>
              <Icon name="message-text-outline" size={18} color={colors.primary} />
            </View>
            <Text style={styles.cardTitle}>오늘 카운터 코칭 포인트 (AI 정리)</Text>
          </View>
          <Text style={styles.summaryText}>
            ① 저녁 복약 누락 패턴 — 복약 시간 조정 권장{'\n'}
            ② 어지럼증 3회 호소 — 기립 시 주의 안내{'\n'}
            ③ 글루코사민 자가복용 시작 — 처방약과 병용 무문제 안내
          </Text>
        </View>
      </View>

      {/* H — 복약 개선 가이드 (풀 너비) */}
      <View style={styles.card}>
        <View style={styles.cardIconRow}>
          <View style={styles.cardIconWrap}>
            <Icon name="wrench-outline" size={18} color={colors.primary} />
          </View>
          <Text style={styles.cardTitle}>복약 개선 가이드</Text>
        </View>
        <View style={[styles.alertCard, { borderLeftColor: colors.status.orange }]}>
          <View style={styles.alertLevelRow}>
            <Icon name="calendar-remove" size={16} color={colors.status.orange} />
            <Text style={[styles.alertLevelText, { color: colors.status.orange }]}>누락 패턴</Text>
          </View>
          <Text style={styles.alertDate}>4/16~18 누락 (3일)</Text>
          <Text style={styles.alertBody}>→ 저녁 식사 거른 날 누락</Text>
        </View>
        <View style={styles.coachingBox}>
          <Icon name="chat-processing-outline" size={14} color={colors.text.secondary} style={{ marginBottom: 4 }} />
          <Text style={styles.coachingText}>
            "어르신, 저녁 약을 취침 전이나 점심 식후로 옮기시면 덜 잊으세요"
          </Text>
        </View>
      </View>

      {/* G — 통합 복약 현황 (풀 너비) */}
      <View style={styles.card}>
        <View style={styles.cardIconRow}>
          <View style={styles.cardIconWrap}>
            <Icon name="pill" size={18} color={colors.primary} />
          </View>
          <Text style={styles.cardTitle}>통합 복약 현황 (30일)</Text>
        </View>

        <View style={styles.subSectionRow}>
          <Icon name="chevron-right-circle-outline" size={14} color={colors.text.secondary} />
          <Text style={styles.subSectionLabel}>처방약 (6종)</Text>
        </View>
        {PATIENT.drugs.map((d, i) => (
          <View key={i} style={styles.drugRow}>
            <Text style={styles.drugName}>{d.name} {d.dose}</Text>
            <Text style={styles.drugFreq}>{d.freq}</Text>
          </View>
        ))}

        <View style={styles.divider} />
        <View style={styles.subSectionRow}>
          <Icon name="chevron-right-circle-outline" size={14} color={colors.text.secondary} />
          <Text style={styles.subSectionLabel}>OTC·건기식 (자가 보고)</Text>
        </View>
        {OTC_DRUGS.map((d, i) => (
          <Text key={i} style={styles.otcItem}>
            {d.name} ({d.since})
          </Text>
        ))}

        <View style={styles.divider} />
        <View style={styles.interactionBox}>
          <View style={styles.alertLevelRow}>
            <Icon name="shield-alert-outline" size={15} color={colors.status.warning} />
            <Text style={styles.interactionTitle}>병용 점검</Text>
          </View>
          <Text style={styles.interactionText}>
            • 처방 6종 + 자가복용 → 무문제{'\n'}
            • Metformin 장기복용 시 비타민 B12 흡수 저하 보고 → 비타민B 보충 권장
          </Text>
        </View>
      </View>



      {/* I — 약사 권장 건기식 */}
      <View style={styles.card}>
        <View style={styles.cardIconRow}>
          <View style={styles.cardIconWrap}>
            <Icon name="leaf" size={18} color={colors.primary} />
          </View>
          <Text style={styles.cardTitle}>약사 권장 건기식</Text>
        </View>
        {RECOMMENDED_SUPPLEMENTS.map((s, i) => (
          <View key={i} style={styles.supplementRow}>
            <Icon name="check-circle" size={16} color={colors.status.success} />
            <View style={styles.supplementText}>
              <Text style={styles.supplementName}>{s.name}</Text>
              <Text style={styles.supplementReason}>{s.reason}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* J — 환자 호소 이력 */}
      <View style={styles.card}>
        <View style={styles.cardIconRow}>
          <View style={styles.cardIconWrap}>
            <Icon name="chat-outline" size={18} color={colors.primary} />
          </View>
          <Text style={styles.cardTitle}>환자 호소 이력 (30일)</Text>
        </View>
        {COMPLAINTS.map((c, i) => (
          <View key={i} style={styles.complaintRow}>
            <Text style={styles.complaintDate}>
              {c.date}{c.time ? ` ${c.time}` : ''}
            </Text>
            <Text style={styles.complaintText}>{c.text}</Text>
          </View>
        ))}
      </View>

      {/* 면책 고지 */}
      <View style={styles.disclaimerRow}>
        <Icon name="information-outline" size={14} color={colors.text.hint} />
        <Text style={styles.disclaimerText}>
          카운터 복약지도 시 활용. 환자 자가 응답 기반 정보입니다.
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.card,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  scrollContent: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    gap: spacing.md,
  },

  // 환자 카드
  patientCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.card,
  },
  patientTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  patientNameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text.primary,
  },
  patientMeta: {
    ...typography.small,
    color: colors.text.secondary,
  },
  patientRegNo: {
    ...typography.caption,
    color: '#6B6B6B',
  },
  patientDiagnosis: {
    ...typography.small,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  prescriptionLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  prescriptionDrugs: {
    ...typography.caption,
    color: colors.text.primary,
    lineHeight: 18,
  },
  visitInfo: {
    ...typography.caption,
    color: colors.text.secondary,
  },

  // 탭
  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 4,
    ...shadows.card,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabActive: {
    backgroundColor: colors.primaryDark,
  },
  tabText: {
    ...typography.smallBold,
    color: colors.text.hint,
  },
  tabTextActive: {
    color: colors.text.white,
  },

  // 공통 카드
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.base,
    ...shadows.card,
    gap: spacing.sm,
  },
  cardIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardIconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    ...typography.bodyBold,
    color: colors.text.primary,
    flex: 1,
  },
  cardTitleSm: {
    ...typography.smallBold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },

  // AI 요약 카드
  summaryCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    flexDirection: 'row',
    overflow: 'hidden',
    ...shadows.card,
  },
  summaryAccent: {
    width: 4,
    backgroundColor: colors.primaryDark,
  },
  summaryContent: {
    flex: 1,
    padding: spacing.base,
    gap: spacing.sm,
  },
  summaryText: {
    ...typography.small,
    color: colors.text.primary,
    lineHeight: 20,
  },
  summaryBold: {
    fontWeight: '700',
    color: colors.primaryDark,
  },

  // 2열 레이아웃
  twoColRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  // 캘린더
  legendRow: {
    flexDirection: 'row',
    gap: spacing.md,
    flexWrap: 'wrap',
    marginBottom: spacing.xs,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  calendarCell: {
    width: '13%',
    aspectRatio: 0.9,
    borderRadius: radius.xs,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 2,
  },
  calendarDate: {
    fontSize: 8,
    color: colors.text.secondary,
    lineHeight: 10,
  },
  calendarMarker: {
    fontSize: 10,
    lineHeight: 12,
  },
  alertDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.status.warning,
  },

  // 알림 카드
  alertCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderLeftWidth: 4,
    padding: spacing.sm,
    gap: 3,
    ...shadows.card,
  },
  alertLevelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  alertLevelText: {
    ...typography.smallBold,
  },
  subSectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.xs,
  },
  alertDate: {
    ...typography.caption,
    color: colors.text.hint,
  },
  alertBody: {
    ...typography.caption,
    color: colors.text.primary,
    lineHeight: 16,
  },
  referenceBox: {
    backgroundColor: colors.background,
    borderRadius: radius.xs,
    padding: spacing.sm,
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  referenceTitle: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.text.secondary,
    marginBottom: 2,
  },
  referenceText: {
    fontSize: 10,
    color: colors.text.secondary,
    lineHeight: 14,
  },

  // 잔여 약 / 공통 텍스트
  bodyText: {
    ...typography.small,
    color: colors.text.primary,
    lineHeight: 20,
  },
  bodyBold: {
    fontWeight: '700',
  },
  hintText: {
    ...typography.caption,
    color: colors.text.hint,
  },

  // 막대 그래프
  barChartWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 100,
    paddingTop: spacing.lg,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  barLabel: {
    ...typography.caption,
    color: colors.text.primary,
    fontWeight: '700',
  },
  barTrack: {
    width: 28,
    height: 60,
    backgroundColor: colors.background,
    borderRadius: radius.xs,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: colors.primaryDark,
    borderRadius: radius.xs,
  },
  barWeek: {
    ...typography.caption,
    color: colors.text.secondary,
  },

  // 면책
  disclaimerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    color: colors.text.hint,
    lineHeight: 16,
  },

  // 약사 뷰
  subSectionLabel: {
    ...typography.smallBold,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  drugRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  drugName: {
    ...typography.caption,
    color: colors.text.primary,
    flex: 1,
  },
  drugFreq: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  otcItem: {
    ...typography.caption,
    color: colors.text.primary,
    lineHeight: 18,
  },
  interactionBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: radius.sm,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  interactionTitle: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.status.warning,
    marginBottom: 4,
  },
  interactionText: {
    ...typography.caption,
    color: colors.text.primary,
    lineHeight: 16,
  },
  coachingBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  coachingText: {
    ...typography.caption,
    color: colors.text.primary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  supplementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  supplementText: {
    flex: 1,
    gap: 2,
  },
  supplementName: {
    ...typography.smallBold,
    color: colors.text.primary,
  },
  supplementReason: {
    ...typography.caption,
    color: colors.text.secondary,
    lineHeight: 16,
  },
  complaintRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  complaintDate: {
    ...typography.caption,
    color: colors.text.hint,
    minWidth: 60,
  },
  complaintText: {
    ...typography.small,
    color: colors.text.primary,
    flex: 1,
  },
});
