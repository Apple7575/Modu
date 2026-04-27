import React, {useEffect, useRef, useState} from 'react';
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
import {RootStackParamList} from '../navigation/AppNavigator';

Sound.setCategory('Playback');

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'VoiceMedication'>;
};

export default function VoiceMedicationScreen({navigation}: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim2 = useRef(new Animated.Value(1)).current;
  const pulseAnim3 = useRef(new Animated.Value(1)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  const startPulse = () => {
    const createPulse = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1.4,
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
    createPulse(pulseAnim2, 200).start();
    createPulse(pulseAnim3, 400).start();
  };

  const stopPulse = () => {
    pulseAnim.stopAnimation(() => pulseAnim.setValue(1));
    pulseAnim2.stopAnimation(() => pulseAnim2.setValue(1));
    pulseAnim3.stopAnimation(() => pulseAnim3.setValue(1));
  };

  const playSound = (filename: string, onDone?: () => void) => {
    const sound = new Sound(filename, Sound.MAIN_BUNDLE, err => {
      if (err) {
        console.log('Sound load error:', err);
        onDone && onDone();
        return;
      }
      sound.play(success => {
        sound.release();
        onDone && onDone();
      });
    });
  };

  useEffect(() => {
    // 화면 진입 시 1.mp3 자동 재생
    setIsPlaying(true);
    startPulse();
    playSound('voice1.mp3', () => {
      stopPulse();
      setIsPlaying(false);
      setShowButtons(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTookMedicine = () => {
    setSelectedChoice('took');
    setShowButtons(false);
    setIsPlaying(true);
    startPulse();
    // 2.mp3 (사용자 응답) 재생
    playSound('voice2.mp3', () => {
      // 1초 딜레이 후 3.mp3 (AI 확인) 재생
      setTimeout(() => {
        playSound('voice3.mp3', () => {
          stopPulse();
          setIsPlaying(false);
          setTimeout(() => {
            navigation.navigate('HealthCheck', {tookMedicine: true});
          }, 500);
        });
      }, 1000);
    });
  };

  const handleNotTook = () => {
    setSelectedChoice('not');
    setShowButtons(false);
    navigation.navigate('HealthCheck', {tookMedicine: false});
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
        <Text style={styles.headerTitle}>음성 복약 관리</Text>
        <View style={styles.backBtn} />
      </View>

      <View style={styles.body}>
        {/* AI 아이콘 + 파형 애니메이션 */}
        <View style={styles.voiceCircleContainer}>
          {isPlaying && (
            <>
              <Animated.View
                style={[styles.pulseRing, {transform: [{scale: pulseAnim3}]}]}
              />
              <Animated.View
                style={[styles.pulseRing2, {transform: [{scale: pulseAnim2}]}]}
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

        {/* 상태 텍스트 */}
        <Text style={styles.statusLabel}>
          {isPlaying ? 'AI가 말하는 중...' : showButtons ? '응답을 선택하세요' : '처리 중...'}
        </Text>

        {/* 메시지 말풍선 */}
        <View style={styles.messageBubble}>
          <Text style={styles.messageText}>
            최미경님, 아침 약 드실 시간입니다{'\n'}
            약 드셨다면 말씀해주세요.
          </Text>
        </View>

        {/* 선택 버튼 */}
        {showButtons && (
          <View style={styles.buttonArea}>
            <TouchableOpacity
              style={styles.btnYes}
              onPress={handleTookMedicine}>
              <Text style={styles.btnYesIcon}>✅</Text>
              <Text style={styles.btnYesText}>네, 먹었어요</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnNo} onPress={handleNotTook}>
              <Text style={styles.btnNoIcon}>⏰</Text>
              <Text style={styles.btnNoText}>아직 안 먹었어요</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 사용자 응답 말풍선 (선택 후) */}
        {selectedChoice === 'took' && (
          <View style={styles.userBubble}>
            <Text style={styles.userBubbleText}>네, 먹었어요</Text>
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
    paddingTop: 40,
    paddingHorizontal: 24,
  },
  voiceCircleContainer: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  pulseRing: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
  },
  pulseRing2: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
  },
  voiceCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  voiceIcon: {
    fontSize: 40,
  },
  statusLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
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
    marginBottom: 30,
  },
  messageText: {
    fontSize: 17,
    color: '#1E293B',
    lineHeight: 26,
    textAlign: 'center',
    fontWeight: '500',
  },
  buttonArea: {
    width: '100%',
    gap: 12,
  },
  btnYes: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#2563EB',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  btnYesIcon: {
    fontSize: 20,
  },
  btnYesText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  btnNo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  btnNoIcon: {
    fontSize: 20,
  },
  btnNoText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#475569',
  },
  userBubble: {
    backgroundColor: '#2563EB',
    borderRadius: 16,
    borderTopRightRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  userBubbleText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});
