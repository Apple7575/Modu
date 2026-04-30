import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Sound from 'react-native-sound';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import AudioWaveform from '../components/AudioWaveform';
import TypingBubble from '../components/TypingBubble';
import UserListeningBubble from '../components/UserListeningBubble';
import { colors, shadows, spacing, radius, typography } from '../theme';
import { bgmManager } from '../utils/bgmManager';

Sound.setCategory('Playback');

type Stage =
  | 'intro'           // voice1 재생 중
  | 'ask_medtaken'    // 복약 여부 버튼 표시
  | 'confirm_took'    // voice2+3 재생 중
  | 'ask_health'      // voice4 재생 중
  | 'pick_health'     // 건강 상태 선택지 표시
  | 'confirm_health'  // voice5 재생 중
  | 'done';

type ChatMsg = { id: string; type: 'ai' | 'user' | 'user_listening'; text: string };

const HEALTH_OPTIONS = [
  { id: 'good', icon: 'emoticon-happy-outline', label: '괜찮아요', color: colors.status.success, bg: '#ECFDF5' },
  { id: 'pain', icon: 'emoticon-sick-outline', label: '통증이 있어요', color: colors.status.error, bg: '#FEF2F2' },
  { id: 'tired', icon: 'sleep', label: '피로해요', color: colors.status.orange, bg: '#FFF7ED' },
  { id: 'dizzy', icon: 'emoticon-confused-outline', label: '어지러워요', color: colors.status.purple, bg: '#F5F3FF' },
];

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'VoiceMedication'>;
};

export default function VoiceMedicationScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [stage, setStage] = useState<Stage>('intro');
  const [isPlaying, setIsPlaying] = useState(true);
  const [tookMedicine, setTookMedicine] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: '0', type: 'ai', text: '안연일님, 아침 약 드실 시간입니다.\n약 드셨다면 말씀해주세요.' },
  ]);

  const mountedRef = useRef(true);
  const soundRef = useRef<Sound | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const scrollRef = useRef<ScrollView>(null);
  const footerFade = useRef(new Animated.Value(0)).current;
  const gridFade = useRef(new Animated.Value(0)).current;

  const addTimer = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  };

  const scrollBottom = () => {
    addTimer(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const pushMsg = (msg: Omit<ChatMsg, 'id'>) => {
    setMessages(prev => [...prev, { id: String(Date.now() + Math.random()), ...msg }]);
    scrollBottom();
  };

  const playSound = (filename: string, onDone?: () => void) => {
    const s = new Sound(filename, Sound.MAIN_BUNDLE, err => {
      if (err) {
        if (mountedRef.current) onDone?.();
        return;
      }
      soundRef.current = s;
      s.play(() => {
        s.release();
        soundRef.current = null;
        if (mountedRef.current) onDone?.();
      });
    });
  };

  const showFooter = () => {
    Animated.timing(footerFade, { toValue: 1, duration: 350, useNativeDriver: true }).start();
  };

  const hideFooter = (cb?: () => void) => {
    Animated.timing(footerFade, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      footerFade.setValue(0);
      cb?.();
    });
  };

  // ── 건강 상태 그리드 표시 (메시지는 호출부에서 따로 push) ──
  const startHealthStage = () => {
    setStage('pick_health');
    setIsPlaying(false);
    Animated.timing(gridFade, { toValue: 1, duration: 350, useNativeDriver: true }).start();
    scrollBottom();
  };

  // ── 초기: voice1 재생 ───────────────────────────────
  useEffect(() => {
    playSound('voice1.mp3', () => {
      if (!mountedRef.current) return;
      setIsPlaying(false);
      setStage('ask_medtaken');
      showFooter();
    });

    return () => {
      mountedRef.current = false;
      soundRef.current?.stop();
      soundRef.current?.release();
      timersRef.current.forEach(clearTimeout);
      bgmManager.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── 복약 완료 ────────────────────────────────────────
  const handleTookMedicine = () => {
    bgmManager.stop();
    setTookMedicine(true);
    hideFooter(() => {
      if (!mountedRef.current) return;
      pushMsg({ type: 'user_listening', text: '네, 먹었어요' });
      setStage('confirm_took');
      setIsPlaying(true);

      playSound('voice2.mp3', () => {
        if (!mountedRef.current) return;
        addTimer(() => {
          if (!mountedRef.current) return;
          pushMsg({ type: 'ai', text: '오늘 복용이 확인되었습니다.' });
          playSound('voice3.mp3', () => {
            if (!mountedRef.current) return;
            pushMsg({ type: 'ai', text: '오늘 몸 상태는 어떠신가요?' });
            playSound('voice3b.mp3', () => {
              if (!mountedRef.current) return;
              startHealthStage();
            });
          });
        }, 500);
      });
    });
  };

  // ── 복약 미완료 ──────────────────────────────────────
  const handleNotTook = () => {
    bgmManager.stop();
    setTookMedicine(false);
    hideFooter(() => {
      if (!mountedRef.current) return;
      pushMsg({ type: 'user_listening', text: '아직 안 먹었어요' });
      addTimer(() => {
        if (!mountedRef.current) return;
        pushMsg({ type: 'ai', text: '오늘 몸 상태는 어떠신가요?' });
        startHealthStage();
      }, 400);
    });
  };

  // ── 건강 상태 선택 ───────────────────────────────────
  const handleHealthSelect = (opt: typeof HEALTH_OPTIONS[0]) => {
    if (stage !== 'pick_health') return;
    Animated.timing(gridFade, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    pushMsg({ type: 'user_listening', text: opt.label });
    setStage('confirm_health');
    setIsPlaying(true);

    playSound('voice4.mp3', () => {
      if (!mountedRef.current) return;
      addTimer(() => {
        if (!mountedRef.current) return;
        // voice5 시작과 동시에 AI 마무리 메시지 표시
        pushMsg({ type: 'ai', text: '말씀해주신 내용은 기록되었습니다.\n해당 내용은 진료시 참고 될 수 있습니다.' });
        playSound('voice5.mp3', () => {
          if (!mountedRef.current) return;
          setIsPlaying(false);
          setStage('done');
          addTimer(() => {
            if (!mountedRef.current) return;
            navigation.navigate('Completion', { tookMedicine, healthStatus: opt.label });
          }, 1500);
        });
      }, 500);
    });
  };

  const statusText = isPlaying
    ? 'AI가 말하는 중...'
    : stage === 'ask_medtaken'
      ? '응답을 선택하세요'
      : stage === 'pick_health'
        ? '상태를 선택하세요'
        : '';

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* 헤더 */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={28} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>음성 복약 관리</Text>
        <View style={styles.backBtn} />
      </View>

      {/* 이퀄라이저 섹션 */}
      <View style={styles.equalizerSection}>
        <View style={styles.equalizerGlow} />
        <AudioWaveform isPlaying={isPlaying} size="lg" />
        <Text style={styles.statusLabel}>{statusText}</Text>
      </View>

      {/* 채팅 영역 */}
      <ScrollView
        ref={scrollRef}
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={scrollBottom}>
        {messages.map(msg =>
          msg.type === 'ai' ? (
            <TypingBubble key={msg.id} text={msg.text} />
          ) : msg.type === 'user_listening' ? (
            <UserListeningBubble key={msg.id} text={msg.text} />
          ) : (
            <View key={msg.id} style={styles.userBubbleWrap}>
              <View style={styles.userBubble}>
                <Text style={styles.userBubbleText}>{msg.text}</Text>
              </View>
            </View>
          ),
        )}

        {/* 건강 상태 선택지 (인라인) */}
        {(stage === 'pick_health' || stage === 'confirm_health' || stage === 'done') && (
          <Animated.View style={[styles.optionsGrid, { opacity: gridFade }]}>
            {HEALTH_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.id}
                activeOpacity={0.8}
                disabled={stage !== 'pick_health'}
                style={[styles.optionCard, { borderColor: opt.color + '50' }]}
                onPress={() => handleHealthSelect(opt)}>
                <View style={[styles.optionIconWrap, { backgroundColor: opt.bg }]}>
                  <Icon name={opt.icon} size={28} color={opt.color} />
                </View>
                <Text style={[styles.optionLabel, { color: opt.color }]}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}
      </ScrollView>

      {/* 복약 여부 버튼 (하단 고정) */}
      {stage === 'ask_medtaken' && (
        <Animated.View
          style={[
            styles.footer,
            { paddingBottom: insets.bottom + spacing.md, opacity: footerFade },
          ]}>
          <TouchableOpacity activeOpacity={0.85} onPress={handleTookMedicine}>
            <LinearGradient
              colors={[colors.primary, colors.primaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.btnYes}>
              <Icon name="check-circle-outline" size={22} color={colors.text.white} />
              <Text style={styles.btnYesText}>네, 먹었어요</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnNo}
            activeOpacity={0.85}
            onPress={handleNotTook}>
            <Icon name="clock-outline" size={22} color={colors.text.secondary} />
            <Text style={styles.btnNoText}>아직 안 먹었어요</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
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
  equalizerSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  equalizerGlow: {
    position: 'absolute',
    width: 200,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(29, 78, 216, 0.06)',
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
    backgroundColor: colors.background,
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
    maxWidth: '82%',
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
    marginTop: spacing.xs,
  },
  optionCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.base,
    alignItems: 'center',
    gap: spacing.sm,
    ...shadows.card,
    borderWidth: 1.5,
  },
  optionIconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: {
    ...typography.smallBold,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  btnYes: {
    borderRadius: radius.lg,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    ...shadows.button,
  },
  btnYesText: {
    ...typography.h3,
    color: colors.text.white,
  },
  btnNo: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  btnNoText: {
    ...typography.bodyBold,
    color: colors.text.secondary,
  },
});
