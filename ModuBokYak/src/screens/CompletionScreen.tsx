import React, { useEffect, useRef } from 'react';
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
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Completion'>;
  route: RouteProp<RootStackParamList, 'Completion'>;
};

export default function CompletionScreen({ navigation, route }: Props) {
  const { tookMedicine, healthStatus } = route.params;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const now = new Date();
  const timeStr = `오전 ${now.getHours() < 12 ? now.getHours() : now.getHours() - 12}:${String(now.getMinutes()).padStart(2, '0')}`;

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
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* 완료 아이콘 */}
        <Animated.View
          style={[styles.iconWrap, { transform: [{ scale: scaleAnim }] }]}>
          <View style={[styles.iconCircle, !tookMedicine && styles.iconCircleWarn]}>
            <Text style={styles.iconText}>{tookMedicine ? '✅' : '⚠️'}</Text>
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
          <Text style={[styles.title, !tookMedicine && styles.titleWarn]}>
            {tookMedicine ? '복약 완료' : '복약 미완료'}
          </Text>
          <Text style={styles.subtitle}>건강 상태 기록 완료</Text>

          {/* 리포트 카드 */}
          <View style={styles.reportCard}>
            <View style={styles.reportHeader}>
              <Text style={styles.reportHeaderIcon}>📋</Text>
              <Text style={styles.reportHeaderText}>오늘의 복약 리포트</Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.reportRow}>
              <Text style={styles.reportLabel}>복약 여부</Text>
              <Text
                style={[
                  styles.reportValue,
                  tookMedicine ? styles.valueGreen : styles.valueRed,
                ]}>
                {tookMedicine ? '✅ 완료' : '❌ 미완료'}
              </Text>
            </View>

            <View style={styles.reportRow}>
              <Text style={styles.reportLabel}>기록 시간</Text>
              <Text style={styles.reportValue}>{timeStr}</Text>
            </View>

            <View style={styles.reportRow}>
              <Text style={styles.reportLabel}>복용 약</Text>
              <Text style={styles.reportValue}>혈압약, 당뇨약</Text>
            </View>

            <View style={styles.reportRow}>
              <Text style={styles.reportLabel}>건강 상태</Text>
              <Text style={styles.reportValue}>{healthStatus}</Text>
            </View>

            <View style={[styles.reportRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.reportLabel}>담당 의료진</Text>
              <Text style={styles.reportValue}>김현우 의사 (내과)</Text>
            </View>
          </View>

          {/* 의료진 전달 배너 */}
          <View style={styles.transmitBanner}>
            <Text style={styles.transmitIcon}>📡</Text>
            <View style={styles.transmitTextArea}>
              <Text style={styles.transmitTitle}>
                이 데이터가 의료진에게 전달됩니다
              </Text>
              <Text style={styles.transmitSub}>
                다음 진료 시 복약 이력 및 건강 상태가 자동으로 공유됩니다
              </Text>
            </View>
          </View>

          {/* 의료진 확인 */}
          <View style={styles.doctorConfirmCard}>
            <View style={styles.doctorRow}>
              <View style={styles.doctorAvatar}>
                <Text style={styles.doctorAvatarText}>👨‍⚕️</Text>
              </View>
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>김현우 의사 (내과)</Text>
                <Text style={styles.doctorStatus}>
                  ✓ 리포트 수신 완료 · 서울 케어 병원
                </Text>
              </View>
            </View>
          </View>

          {/* 홈으로 버튼 */}
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() =>
              navigation.reset({ index: 0, routes: [{ name: 'Home' }] })
            }>
            <Text style={styles.homeButtonText}>홈으로 돌아가기</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scroll: {
    paddingBottom: 40,
    alignItems: 'center',
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  iconWrap: {
    marginBottom: 16,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#10B981',
  },
  iconCircleWarn: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
  },
  iconText: {
    fontSize: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#10B981',
    marginBottom: 6,
  },
  titleWarn: {
    color: '#F59E0B',
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 24,
  },
  reportCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 16,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  reportHeaderIcon: {
    fontSize: 18,
  },
  reportHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 14,
  },
  reportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  reportLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  reportValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  valueGreen: {
    color: '#10B981',
  },
  valueRed: {
    color: '#EF4444',
  },
  transmitBanner: {
    width: '100%',
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    marginBottom: 16,
  },
  transmitIcon: {
    fontSize: 26,
  },
  transmitTextArea: {
    flex: 1,
  },
  transmitTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1D4ED8',
    marginBottom: 3,
  },
  transmitSub: {
    fontSize: 12,
    color: '#3B82F6',
    lineHeight: 18,
  },
  doctorConfirmCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 24,
  },
  doctorRow: {
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
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  doctorStatus: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 3,
  },
  homeButton: {
    width: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  homeButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
