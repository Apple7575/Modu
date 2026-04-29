import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Sound from 'react-native-sound';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/AppNavigator';
import AudioWaveform from '../components/AudioWaveform';
import {colors, shadows, spacing, radius, typography} from '../theme';

Sound.setCategory('Playback');

type ChatMsg = {id: string; type: 'ai' | 'user'; text: string};

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'HealthCheck'>;
  route: RouteProp<RootStackParamList, 'HealthCheck'>;
};

const HEALTH_OPTIONS = [
  {id: 'good', icon: 'emoticon-happy-outline', label: '괜찮아요', color: colors.status.success, bg: '#ECFDF5'},
  {id: 'pain', icon: 'emoticon-sick-outline', label: '통증이 있어요', color: colors.status.error, bg: '#FEF2F2'},
  {id: 'tired', icon: 'sleep', label: '피로해요', color: colors.status.orange, bg: '#FFF7ED'},
  {id: 'dizzy', icon: 'emoticon-confused-outline', label: '어지러워요', color: colors.status.purple, bg: '#F5F3FF'},
];

export default function HealthCheckScreen({navigation, route}: Props) {
  const {tookMedicine} = route.params;
  const [isPlaying, setIsPlaying] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {id: '0', type: 'ai', text: '오늘 몸 상태는 어떠신가요?'},
  ]);

  const mountedRef = useRef(true);
  const soundRef = useRef<Sound | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const scrollRef = useRef<ScrollView>(null);
  const gridFade = useRef(new Animated.Value(0)).current;

  const addTimer = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  };

  const scrollBottom = () => {
    addTimer(() => scrollRef.current?.scrollToEnd({animated: true}), 80);
  };

  const pushMessage = (msg: Omit<ChatMsg, 'id'>) => {
    setMessages(prev => [...prev, {id: String(Date.now() + Math.random()), ...msg}]);
    scrollBottom();
  };

  const playSound = (filename: string, onDone?: () => void) => {
    const sound = new Sound(filename, Sound.MAIN_BUNDLE, err => {
      if (err) {
        console.log('Sound error:', err);
        if (mountedRef.current) {
          setIsPlaying(false);
          // Show grid even if audio fails
          Animated.timing(gridFade, {toValue: 1, duration: 350, useNativeDriver: true}).start();
        }
        return;
      }
      soundRef.current = sound;
      sound.play(() => {
        sound.release();
        soundRef.current = null;
        if (mountedRef.current) onDone?.();
      });
    });
  };

  useEffect(() => {
    // Play health check question audio, then show grid
    playSound('voice4.mp3', () => {
      if (!mountedRef.current) return;
      setIsPlaying(false);
      Animated.timing(gridFade, {toValue: 1, duration: 350, useNativeDriver: true}).start();
    });

    return () => {
      mountedRef.current = false;
      soundRef.current?.stop();
      soundRef.current?.release();
      timersRef.current.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (optionId: string, label: string) => {
    if (selected) return;
    setSelected(optionId);

    // Fade out grid
    Animated.timing(gridFade, {toValue: 0, duration: 200, useNativeDriver: true}).start();

    pushMessage({type: 'user', text: label});
    setIsPlaying(true);

    playSound('voice5.mp3', () => {
      if (!mountedRef.current) return;
      setIsPlaying(false);
      pushMessage({type: 'ai', text: '말씀해주신 내용은 기록되었습니다.\n해당 내용은 진료 시 참고될 수 있습니다.'});
      addTimer(() => {
        if (!mountedRef.current) return;
        navigation.navigate('Completion', {tookMedicine, healthStatus: label});
      }, 1400);
    });
  };

  const statusText = isPlaying ? 'AI가 말하는 중...' : selected ? '' : '상태를 선택해주세요';

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={28} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>건강 상태 확인</Text>
        <View style={styles.backBtn} />
      </View>

      {/* 이퀄라이저 섹션 */}
      <View style={styles.equalizerSection}>
        <View style={styles.equalizerGlow} />
        <AudioWaveform isPlaying={isPlaying} size="lg" />
        <Text style={styles.statusLabel}>{statusText}</Text>
      </View>

      {/* 채팅 + 선택지 영역 */}
      <ScrollView
        ref={scrollRef}
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}>
        {messages.map(msg =>
          msg.type === 'ai' ? (
            <View key={msg.id} style={styles.aiBubbleWrap}>
              <View style={styles.aiBubble}>
                <Text style={styles.aiBubbleText}>{msg.text}</Text>
              </View>
            </View>
          ) : (
            <View key={msg.id} style={styles.userBubbleWrap}>
              <View style={styles.userBubble}>
                <Text style={styles.userBubbleText}>{msg.text}</Text>
              </View>
            </View>
          ),
        )}

        {/* 건강 상태 선택 그리드 */}
        {!selected && (
          <Animated.View style={[styles.optionsGrid, {opacity: gridFade}]}>
            {HEALTH_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.id}
                activeOpacity={0.8}
                style={[styles.optionCard, {borderColor: opt.color + '50'}]}
                onPress={() => handleSelect(opt.id, opt.label)}>
                <View style={[styles.optionIconWrap, {backgroundColor: opt.bg}]}>
                  <Icon name={opt.icon} size={32} color={opt.color} />
                </View>
                <Text style={[styles.optionLabel, {color: opt.color}]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
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
  equalizerSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  equalizerGlow: {
    position: 'absolute',
    width: 180,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(29, 78, 216, 0.07)',
    top: spacing.lg,
  },
  statusLabel: {
    ...typography.small,
    color: colors.text.secondary,
    marginTop: spacing.md,
    letterSpacing: 0.3,
    minHeight: 18,
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  aiBubbleWrap: {
    alignItems: 'flex-start',
  },
  aiBubble: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderTopLeftRadius: radius.xs,
    padding: spacing.base,
    maxWidth: '80%',
    ...shadows.card,
  },
  aiBubbleText: {
    ...typography.body,
    color: colors.text.primary,
    lineHeight: 24,
  },
  userBubbleWrap: {
    alignItems: 'flex-end',
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    borderTopRightRadius: radius.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    maxWidth: '70%',
  },
  userBubbleText: {
    ...typography.bodyBold,
    color: colors.text.white,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  optionCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
    ...shadows.card,
    borderWidth: 1.5,
  },
  optionIconWrap: {
    width: 60,
    height: 60,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  optionLabel: {
    ...typography.smallBold,
    textAlign: 'center',
  },
});
