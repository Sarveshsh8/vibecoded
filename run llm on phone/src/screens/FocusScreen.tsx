import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Timer,
  Coffee,
  Target,
  CheckCircle
} from 'lucide-react-native';
import { theme } from '../theme/theme';

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

interface TimerSession {
  mode: TimerMode;
  duration: number; // in minutes
  color: string[];
}

const timerSessions: TimerSession[] = [
  { mode: 'focus', duration: 25, color: theme.gradients.primary },
  { mode: 'shortBreak', duration: 5, color: theme.gradients.success },
  { mode: 'longBreak', duration: 15, color: theme.gradients.secondary },
];

export default function FocusScreen() {
  const [currentSession, setCurrentSession] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timerSessions[0].duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  const currentTimer = timerSessions[currentSession];

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  useEffect(() => {
    const progress = 1 - (timeLeft / (currentTimer.duration * 60));
    Animated.timing(progressAnimation, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [timeLeft, currentTimer.duration]);

  useEffect(() => {
    if (isRunning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnimation.setValue(1);
    }
  }, [isRunning]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    setCompletedSessions(prev => prev + 1);
    
    // Show completion alert
    Alert.alert(
      'Session Complete!',
      `Great job! You've completed a ${currentTimer.mode === 'focus' ? 'focus' : 'break'} session.`,
      [
        {
          text: 'Continue',
          onPress: () => {
            // Auto-advance to next session
            const nextSession = (currentSession + 1) % timerSessions.length;
            setCurrentSession(nextSession);
            setTimeLeft(timerSessions[nextSession].duration * 60);
          }
        }
      ]
    );
  };

  const startTimer = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    setIsPaused(true);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(currentTimer.duration * 60);
    progressAnimation.setValue(0);
  };

  const switchSession = (index: number) => {
    if (isRunning) {
      Alert.alert(
        'Switch Session',
        'Are you sure you want to switch sessions? This will reset the current timer.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Switch',
            onPress: () => {
              setCurrentSession(index);
              setTimeLeft(timerSessions[index].duration * 60);
              setIsRunning(false);
              setIsPaused(false);
              progressAnimation.setValue(0);
            }
          }
        ]
      );
    } else {
      setCurrentSession(index);
      setTimeLeft(timerSessions[index].duration * 60);
      progressAnimation.setValue(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionTitle = (mode: TimerMode) => {
    switch (mode) {
      case 'focus': return 'Focus Time';
      case 'shortBreak': return 'Short Break';
      case 'longBreak': return 'Long Break';
    }
  };

  const getSessionIcon = (mode: TimerMode) => {
    switch (mode) {
      case 'focus': return Target;
      case 'shortBreak': return Coffee;
      case 'longBreak': return Coffee;
    }
  };

  const getSessionDescription = (mode: TimerMode) => {
    switch (mode) {
      case 'focus': return 'Time to focus and get things done';
      case 'shortBreak': return 'Take a quick break to recharge';
      case 'longBreak': return 'Enjoy a longer break to rest';
    }
  };

  const radius = 120;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Focus Timer</Text>
        <Text style={styles.headerSubtitle}>
          {completedSessions} sessions completed today
        </Text>
      </View>

      <View style={styles.timerContainer}>
        <Animated.View style={[
          styles.timerCircle,
          { transform: [{ scale: pulseAnimation }] }
        ]}>
          <LinearGradient
            colors={currentTimer.color}
            style={styles.timerGradient}
          >
            <View style={styles.timerInner}>
              <View style={styles.timerContent}>
                <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                <Text style={styles.timerMode}>{getSessionTitle(currentTimer.mode)}</Text>
                <Text style={styles.timerDescription}>
                  {getSessionDescription(currentTimer.mode)}
                </Text>
              </View>
              
              {/* Progress Ring */}
              <View style={styles.progressRing}>
                <Animated.View
                  style={[
                    styles.progressRingFill,
                    {
                      transform: [{
                        rotate: progressAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '360deg'],
                        })
                      }]
                    }
                  ]}
                />
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>

      <View style={styles.controlsContainer}>
        <View style={styles.controlButtons}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={resetTimer}
          >
            <RotateCcw size={24} color={theme.colors.onSurfaceVariant} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.mainButton, { backgroundColor: isRunning ? theme.colors.warning : theme.colors.success }]}
            onPress={isRunning ? pauseTimer : startTimer}
          >
            {isRunning ? (
              <Pause size={32} color="#FFFFFF" />
            ) : (
              <Play size={32} color="#FFFFFF" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={() => {/* Add settings */}}
          >
            <Timer size={24} color={theme.colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sessionsContainer}>
        <Text style={styles.sessionsTitle}>Sessions</Text>
        <View style={styles.sessionsList}>
          {timerSessions.map((session, index) => {
            const IconComponent = getSessionIcon(session.mode);
            const isActive = index === currentSession;
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.sessionCard,
                  isActive && styles.sessionCardActive
                ]}
                onPress={() => switchSession(index)}
              >
                <LinearGradient
                  colors={isActive ? session.color : theme.gradients.surface}
                  style={styles.sessionGradient}
                >
                  <View style={styles.sessionContent}>
                    <IconComponent 
                      size={24} 
                      color={isActive ? '#FFFFFF' : theme.colors.onSurfaceVariant} 
                    />
                    <Text style={[
                      styles.sessionTitle,
                      isActive && styles.sessionTitleActive
                    ]}>
                      {getSessionTitle(session.mode)}
                    </Text>
                    <Text style={[
                      styles.sessionDuration,
                      isActive && styles.sessionDurationActive
                    ]}>
                      {session.duration} min
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <CheckCircle size={20} color={theme.colors.success} />
          <Text style={styles.statValue}>{completedSessions}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        
        <View style={styles.statCard}>
          <Target size={20} color={theme.colors.primary} />
          <Text style={styles.statValue}>
            {Math.floor(completedSessions * 25 / 60)}h {completedSessions * 25 % 60}m
          </Text>
          <Text style={styles.statLabel}>Focus Time</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
    alignItems: 'center',
  },
  headerTitle: {
    ...theme.typography.h2,
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.onSurfaceVariant,
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  timerCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    elevation: theme.elevation.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  timerGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerInner: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  timerContent: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.sm,
  },
  timerMode: {
    ...theme.typography.h3,
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.xs,
  },
  timerDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
  progressRing: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 8,
    borderColor: theme.colors.surfaceVariant,
  },
  progressRingFill: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 8,
    borderColor: 'transparent',
    borderTopColor: theme.colors.primary,
  },
  controlsContainer: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  controlButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xl,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: theme.elevation.sm,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mainButton: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: theme.elevation.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  sessionsContainer: {
    padding: theme.spacing.md,
  },
  sessionsTitle: {
    ...theme.typography.h3,
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.md,
  },
  sessionsList: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  sessionCard: {
    flex: 1,
    borderRadius: theme.borderRadius.lg,
    elevation: theme.elevation.sm,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sessionCardActive: {
    elevation: theme.elevation.md,
    shadowOpacity: 0.2,
  },
  sessionGradient: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  sessionContent: {
    alignItems: 'center',
  },
  sessionTitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.onSurfaceVariant,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  sessionTitleActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  sessionDuration: {
    ...theme.typography.caption,
    color: theme.colors.onSurfaceVariant,
    marginTop: theme.spacing.xs,
  },
  sessionDurationActive: {
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    elevation: theme.elevation.sm,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    ...theme.typography.h3,
    color: theme.colors.onSurface,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    ...theme.typography.caption,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
});
