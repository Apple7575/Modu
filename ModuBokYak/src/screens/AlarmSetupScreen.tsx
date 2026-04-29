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

Sound.setCategory('Playback');

type Stage =
  | 'intro'
  | 'user_input'
  | 'alarm_set'
  | 'pick_alarm'
  | 'confirm'
  | 'done';

type ChatMsg = {
  id: string;
  type: 'ai' | 'user' | 'user_listening' | 'alarm_card' | 'alarm_options' | 'done_banner';
  text: string;
};

const ALARM_OPTIONS = [
  {
    id: 'music',
    icon: 'music-note',
    label: '음악 알람\n+ 음성 안내형',
    color: colors.primary,
    bg: '#EFF6FF',
    border: '#BFDBFE',
  },
  {
    id: 'vibration',
    icon: 'vibrate',
    label: '진동\n+ 음성 안내형',
    color: colors.status.purple,
    bg: '#F5F3FF',
    border: '#DDD6FE',
  },
];

const ALARM_TIMES = [
  { label: '오전 7:30', icon: 'weather-sunny', color: colors.status.warning },
  { label: '정오 12:00', icon: 'weather-partly-cloudy', color: colors.primary },
  { label: '오후 6:00', icon: 'weather-sunset', color: colors.status.orange },
];

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'AlarmSetup'>;
};

export default function AlarmSetupScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [stage, setStage] = useState<Stage>('intro');
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedAlarm, setSelectedAlarm] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: '0',
      type: 'ai',
      text: '안연일님, 만나서 반갑습니다.\n저는 깜빡하기 쉬운 복약을 음성 AI로 챙겨주는 \'모두의 복약\'입니다.\n\n복약 시간 설정을 도와드릴까요?',
    },
  ]);

  const mountedRef = useRef(true);
  const soundRef = useRef<Sound | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const scrollRef = useRef<ScrollView>(null);

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

  useEffect(() => {
    playSound('alarm_voice1.mp3', () => {
      if (!mountedRef.current) return;
      setIsPlaying(false);
      setStage('user_input');

      addTimer(() => {
        if (!mountedRef.current) return;
        pushMsg({ type: 'user_listening', text: '아침, 점심, 저녁 약이 있어~' });

        playSound('alarm_user1.mp3', () => {
          if (!mountedRef.current) return;
          pushMsg({ type: 'user_listening', text: '시간은… 오전 7시 반, 정오, 오후 6시로 설정해줘.' });

          playSound('alarm_user2.mp3', () => {
            if (!mountedRef.current) return;

            addTimer(() => {
              if (!mountedRef.current) return;
              setStage('alarm_set');
              setIsPlaying(true);

              pushMsg({
                type: 'ai',
                text: '네, 오전 7시 30분, 정오, 오후 6시로\n하루 3회 복용 알람이 설정되었습니다.',
              });

              playSound('alarm_voice2.mp3', () => {
                if (!mountedRef.current) return;

                addTimer(() => {
                  if (!mountedRef.current) return;
                  pushMsg({ type: 'alarm_card', text: '' });

                  addTimer(() => {
                    if (!mountedRef.current) return;
                    setStage('pick_alarm');
                    setIsPlaying(true);
                    pushMsg({ type: 'ai', text: '알람 방식을 선택해주세요.' });

                    playSound('alarm_voice3.mp3', () => {
                      if (!mountedRef.current) return;
                      setIsPlaying(false);
                    });

                    addTimer(() => {
                      if (!mountedRef.current) return;
                      pushMsg({ type: 'alarm_options', text: '' });
                      scrollBottom();
                    }, 300);
                  }, 600);
                }, 400);
              });
            }, 1200);
          });
        });
      }, 800);
    });

    return () => {
      mountedRef.current = false;
      soundRef.current?.stop();
      soundRef.current?.release();
      timersRef.current.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAlarmSelect = (opt: typeof ALARM_OPTIONS[0]) => {
    if (stage !== 'pick_alarm') return;
    setSelectedAlarm(opt.id);
    pushMsg({ type: 'user_listening', text: opt.id === 'music' ? '1번으로 할게.' : '2번으로 할게.' });
    setStage('confirm');

    const confirmText =
      opt.id === 'music'
        ? '네, 음악 알람과 음성 안내형으로 설정되었습니다.\n\n설정된 시간에 복약 안내를 드리겠습니다.'
        : '네, 진동과 음성 안내형으로 설정되었습니다.\n\n설정된 시간에 복약 안내를 드리겠습니다.';

    playSound('alarm_user3.mp3', () => {
      if (!mountedRef.current) return;
      setIsPlaying(true);

      addTimer(() => {
        if (!mountedRef.current) return;
        pushMsg({ type: 'ai', text: confirmText });

        playSound('alarm_voice4.mp3', () => {
          if (!mountedRef.current) return;
          setIsPlaying(false);
          setStage('done');
          pushMsg({ type: 'done_banner', text: '' });
          scrollBottom();
          addTimer(() => {
            if (!mountedRef.current) return;
            navigation.goBack();
          }, 2000);
        });
      }, 400);
    });
  };

  const statusText = isPlaying
    ? 'AI가 말하는 중...'
    : stage === 'user_input'
      ? '음성 인식 중...'
      : stage === 'pick_alarm'
        ? '알람 방식을 선택하세요'
        : '';

  const renderMessage = (msg: ChatMsg) => {
    switch (msg.type) {
      case 'ai':
        return <TypingBubble key={msg.id} text={msg.text} />;
      case 'user_listening':
        return <UserListeningBubble key={msg.id} text={msg.text} />;
      case 'user':
        return (
          <View key={msg.id} style={styles.userBubbleWrap}>
            <View style={styles.userBubble}>
              <Text style={styles.userBubbleText}>{msg.text}</Text>
            </View>
          </View>
        );
      case 'alarm_card':
        return (
          <View key={msg.id} style={styles.alarmCard}>
            <View style={styles.alarmCardHeader}>
              <View style={styles.alarmCardIconWrap}>
                <Icon name="alarm-check" size={18} color={colors.primary} />
              </View>
              <Text style={styles.alarmCardTitle}>복약 알람 설정 완료</Text>
            </View>
            <View style={styles.alarmDivider} />
            {ALARM_TIMES.map(t => (
              <View key={t.label} style={styles.alarmTimeRow}>
                <View style={[styles.alarmTimeIcon, { backgroundColor: t.color + '18' }]}>
                  <Icon name={t.icon} size={16} color={t.color} />
                </View>
                <Text style={styles.alarmTimeText}>{t.label}</Text>
                <View style={styles.alarmBadge}>
                  <Icon name="check" size={11} color={colors.status.success} />
                  <Text style={styles.alarmBadgeText}>설정됨</Text>
                </View>
              </View>
            ))}
          </View>
        );
      case 'alarm_options':
        return (
          <View key={msg.id} style={styles.optionsRow}>
            {ALARM_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.id}
                activeOpacity={0.8}
                disabled={stage !== 'pick_alarm'}
                style={[
                  styles.optionCard,
                  { borderColor: opt.border, backgroundColor: opt.bg },
                  selectedAlarm === opt.id && styles.optionCardSelected,
                  (stage === 'confirm' || stage === 'done') && selectedAlarm !== opt.id && styles.optionCardDimmed,
                ]}
                onPress={() => handleAlarmSelect(opt)}>
                <View style={[styles.optionIconWrap, { backgroundColor: opt.color + '18' }]}>
                  <Icon name={opt.icon} size={28} color={opt.color} />
                </View>
                <Text style={[styles.optionLabel, { color: opt.color }]}>{opt.label}</Text>
                {selectedAlarm === opt.id && (
                  <View style={[styles.optionCheck, { backgroundColor: opt.color }]}>
                    <Icon name="check" size={12} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        );
      case 'done_banner':
        return (
          <View key={msg.id} style={styles.doneBanner}>
            <Icon name="bell-check-outline" size={20} color={colors.primary} />
            <Text style={styles.doneBannerText}>알람 설정이 완료되었습니다</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* 헤더 */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={28} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>음성 AI 알람 설정</Text>
        <View style={styles.backBtn} />
      </View>

      {/* 이퀄라이저 */}
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
        {messages.map(msg => renderMessage(msg))}
      </ScrollView>
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
  aiBubbleWrap: { alignItems: 'flex-start' },
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
  userBubbleWrap: { alignItems: 'flex-end' },
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
  alarmCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.base,
    ...shadows.card,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
  },
  alarmCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  alarmCardIconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alarmCardTitle: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  alarmDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.sm,
  },
  alarmTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  alarmTimeIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alarmTimeText: {
    flex: 1,
    ...typography.bodyBold,
    color: colors.text.primary,
  },
  alarmBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  alarmBadgeText: {
    ...typography.caption,
    color: colors.status.success,
    fontWeight: '600',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  optionCard: {
    flex: 1,
    borderRadius: radius.lg,
    padding: spacing.base,
    alignItems: 'center',
    gap: spacing.sm,
    ...shadows.card,
    borderWidth: 1.5,
    position: 'relative',
  },
  optionCardSelected: {
    borderWidth: 2.5,
  },
  optionCardDimmed: {
    opacity: 0.4,
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
    lineHeight: 18,
  },
  optionCheck: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 20,
    height: 20,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: '#EFF6FF',
    borderRadius: radius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  doneBannerText: {
    ...typography.bodyBold,
    color: colors.primary,
  },
});
