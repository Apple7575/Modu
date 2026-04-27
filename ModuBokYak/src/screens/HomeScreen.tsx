import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>💊</Text>
          </View>
          <View>
            <Text style={styles.appName}>모두의 복약</Text>
            <Text style={styles.appSubtitle}>AI 음성 복약 관리 서비스</Text>
          </View>
        </View>
      </View>

      {/* 오늘 복약 현황 카드 */}
      <View style={styles.statusCard}>
        <Text style={styles.statusDate}>2026년 4월 27일 일요일</Text>
        <Text style={styles.statusName}>최미경님의 오늘 복약 현황</Text>
        <View style={styles.progressRow}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '85%' }]} />
          </View>
          <Text style={styles.progressText}>85%</Text>
        </View>
        <Text style={styles.statusSub}>오늘의 복약 기록</Text>
        <View style={styles.medicineRow}>
          <View style={styles.medicineItem}>
            <Text style={styles.medicineEmoji}>🌿</Text>
            <Text style={styles.medicineName}>혈압약</Text>
            <Text style={styles.medicineDone}>✓ 완료</Text>
          </View>
          <View style={styles.medicineItem}>
            <Text style={styles.medicineEmoji}>💊</Text>
            <Text style={styles.medicineName}>당뇨약</Text>
            <Text style={styles.medicinePending}>아침 예정</Text>
          </View>
        </View>
      </View>

      {/* 담당 의료진 카드 */}
      <View style={styles.doctorCard}>
        <View style={styles.doctorInfo}>
          <View style={styles.doctorAvatar}>
            <Text style={styles.doctorAvatarText}>👨‍⚕️</Text>
          </View>
          <View>
            <Text style={styles.doctorName}>김현우 의사 (내과)</Text>
            <Text style={styles.doctorSub}>서울 케어 병원 · 담당 의료진</Text>
          </View>
        </View>
      </View>

      {/* 음성 복약 관리 시작 버튼 */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate('VoiceMedication')}>
        <Text style={styles.startButtonIcon}>🎙️</Text>
        <Text style={styles.startButtonText}>음성 복약 관리 시작</Text>
        <Text style={styles.startButtonArrow}>›</Text>
      </TouchableOpacity>

      <Text style={styles.bottomHint}>
        AI가 음성으로 복약을 안내하고 건강 상태를 기록합니다
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    fontSize: 24,
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  appSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statusDate: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },
  statusName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563EB',
  },
  statusSub: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 10,
  },
  medicineRow: {
    flexDirection: 'row',
    gap: 10,
  },
  medicineItem: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  medicineEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  medicineName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 4,
  },
  medicineDone: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  medicinePending: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '600',
  },
  doctorCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  doctorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorAvatarText: {
    fontSize: 22,
  },
  doctorName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  doctorSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  startButton: {
    backgroundColor: '#2563EB',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonIcon: {
    fontSize: 22,
  },
  startButtonText: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  startButtonArrow: {
    fontSize: 22,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '300',
  },
  bottomHint: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 12,
    paddingHorizontal: 20,
  },
});
