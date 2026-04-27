import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Easing,
} from 'react-native';
import Sound from 'react-native-sound';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/AppNavigator';

Sound.setCategory('Playback');

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'HealthCheck'>;
  route: RouteProp<RootStackParamList, 'HealthCheck'>;
};

const HEALTH_OPTIONS = [
  {id: 'good', emoji: '😊', label: '괜찮아요', color: '#10B981'},
  {id: 'pain', emoji: '🤕', label: '통증이 있어요', color: '#EF4444'},
  {id: 'tired', emoji: '😴', label: '피로해요', color: '#F59E0B'},
  {id: 'dizzy', emoji: '🤢', label: '어지러워요', color: '#8B5CF6'},
];

export default function HealthCheckScreen({navigation, route}: Props) {
  const {tookMedicine} = route.params;
  const [selected, setSelected] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim2 = useRef(new Animated.Value(1)).current;

  const startPulse = () => {
    const createPulse = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1.35,
            duration: 600,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 600,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ]),
      );
    createPulse(pulseAnim, 0).start();
    createPulse(pulseAnim2, 300).start();
  };

  const stopPulse = () => {
    pulseAnim.stopAnimation(() => pulseAnim.setValue(1));
    pulseAnim2.stopAnimation(() => pulseAnim2.setValue(1));
  };

  const playSound = (filename: string, onDone?: () => void) => {
    const sound = new Sound(filename, Sound.MAIN_BUNDLE, err => {
      if (err) {
        console.log('Sound error:', err);
        onDone && onDone();
        return;
      }
      sound.play(() => {
        sound.release();
        onDone && onDone();
      });
    });
  };

  const handleSelect = (optionId: string, label: string) => {
    if (selected) return;
    setSelected(optionId);
    setIsPlaying(true);
    startPulse();
    // 4.mp3 (사용자 응답) 재생
    playSound('voice4.mp3', () => {
      setTimeout(() => {
        // 5.mp3 (AI 완료 메시지) 재생
        playSound('voice5.mp3', () => {
          stopPulse();
          setIsPlaying(false);
          setTimeout(() => {
            navigation.navigate('Completion', {
              tookMedicine,
              healthStatus: label,
            });
          }, 500);
        });
      }, 800);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>건강 상태 확인</Text>
        <View style={styles.backBtn} />
      </View>

      <View style={styles.body}>
        {/* AI 아이콘 */}
        <View style={styles.voiceCircleContainer}>
          {isPlaying && (
            <>
              <Animated.View
                style={[styles.pulseRing, {transform: [{scale: pulseAnim2}]}]}
              />
            </>
          )}
          <Animated.View
            style={[
              styles.voiceCircle,
              isPlaying && {transform: [{scale: pulseAnim}]},
            ]}>
            <Text style={styles.voiceIcon}>🤖</Text>
          </Animated.View>
        </View>

        {isPlaying && (
          <Text style={styles.playingLabel}>AI가 말하는 중...</Text>
        )}

        {/* 질문 말풍선 */}
        <View style={styles.messageBubble}>
          <Text style={styles.messageText}>오늘 몸 상태는 어떠신가요?</Text>
        </View>

        {/* 건강 상태 선택 버튼 */}
        {!selected && (
          <View style={styles.optionsGrid}>
            {HEALTH_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.id}
                style={styles.optionCard}
                onPress={() => handleSelect(opt.id, opt.label)}>
                <Text style={styles.optionEmoji}>{opt.emoji}</Text>
                <Text style={styles.optionLabel}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 선택 후 표시 */}
        {selected && (
          <View style={styles.selectedArea}>
            <View style={styles.userBubble}>
              <Text style={styles.userBubbleText}>
                {HEALTH_OPTIONS.find(o => o.id === selected)?.emoji}{' '}
                {HEALTH_OPTIONS.find(o => o.id === selected)?.label}
              </Text>
            </View>
            {!isPlaying && (
              <View style={styles.aiBubble}>
                <Text style={styles.aiBubbleText}>
                  말씀해주신 내용은 기록되었습니다.{'\n'}해당 내용은 진료 시
                  참고될 수 있습니다.
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 28,
    color: '#2563EB',
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1E293B',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 30,
    paddingHorizontal: 24,
  },
  voiceCircleContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  pulseRing: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
  },
  voiceCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  voiceIcon: {
    fontSize: 36,
  },
  playingLabel: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 12,
  },
  messageBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    maxWidth: '90%',
    marginBottom: 28,
  },
  messageText: {
    fontSize: 18,
    color: '#1E293B',
    fontWeight: '600',
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    width: '100%',
  },
  optionCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  optionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
  },
  selectedArea: {
    width: '100%',
    gap: 12,
  },
  userBubble: {
    backgroundColor: '#2563EB',
    borderRadius: 16,
    borderTopRightRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignSelf: 'flex-end',
  },
  userBubbleText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    padding: 16,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  aiBubbleText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
  },
});
