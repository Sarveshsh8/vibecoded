import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  CheckCircle,
  Clock,
  Award,
  Calendar,
  Zap,
  Star,
  Activity
} from 'lucide-react-native';
import { theme } from '../theme/theme';

const { width } = Dimensions.get('window');

interface StatData {
  label: string;
  value: number;
  color: string;
  icon: any;
}

interface WeeklyData {
  day: string;
  tasks: number;
  habits: number;
  focus: number;
}

export default function StatsScreen() {
  const [animatedValues] = useState({
    tasksCompleted: new Animated.Value(0),
    habitsStreak: new Animated.Value(0),
    focusTime: new Animated.Value(0),
    productivity: new Animated.Value(0),
  });

  const weeklyData: WeeklyData[] = [
    { day: 'Mon', tasks: 8, habits: 5, focus: 120 },
    { day: 'Tue', tasks: 12, habits: 7, focus: 150 },
    { day: 'Wed', tasks: 6, habits: 4, focus: 90 },
    { day: 'Thu', tasks: 15, habits: 8, focus: 180 },
    { day: 'Fri', tasks: 10, habits: 6, focus: 135 },
    { day: 'Sat', tasks: 4, habits: 3, focus: 60 },
    { day: 'Sun', tasks: 7, habits: 5, focus: 105 },
  ];

  const statsData: StatData[] = [
    {
      label: 'Tasks Completed',
      value: 62,
      color: theme.colors.success,
      icon: CheckCircle,
    },
    {
      label: 'Habit Streak',
      value: 12,
      color: theme.colors.primary,
      icon: Star,
    },
    {
      label: 'Focus Time',
      value: 840,
      color: theme.colors.secondary,
      icon: Clock,
    },
    {
      label: 'Productivity',
      value: 87,
      color: theme.colors.warning,
      icon: TrendingUp,
    },
  ];

  const achievements = [
    { title: 'Early Bird', description: 'Completed 5 tasks before 9 AM', icon: Award, color: theme.colors.warning },
    { title: 'Streak Master', description: '7-day habit streak', icon: Zap, color: theme.colors.primary },
    { title: 'Focus Champion', description: '2 hours of focus time', icon: Target, color: theme.colors.success },
    { title: 'Task Destroyer', description: 'Completed 20 tasks in a day', icon: CheckCircle, color: theme.colors.secondary },
  ];

  const motivationalQuotes = [
    "Success is the sum of small efforts repeated day in and day out.",
    "The way to get started is to quit talking and begin doing.",
    "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "It is during our darkest moments that we must focus to see the light.",
  ];

  useEffect(() => {
    // Animate the stat values
    Animated.parallel([
      Animated.timing(animatedValues.tasksCompleted, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
      Animated.timing(animatedValues.habitsStreak, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: false,
      }),
      Animated.timing(animatedValues.focusTime, {
        toValue: 1,
        duration: 1400,
        useNativeDriver: false,
      }),
      Animated.timing(animatedValues.productivity, {
        toValue: 1,
        duration: 1600,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const getMaxValue = (data: WeeklyData[], key: keyof WeeklyData) => {
    return Math.max(...data.map(item => item[key] as number));
  };

  const renderStatCard = (stat: StatData, index: number) => {
    const animatedValue = Object.values(animatedValues)[index];
    
    return (
      <Animated.View 
        key={stat.label}
        style={[
          styles.statCard,
          {
            opacity: animatedValue,
            transform: [{
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              })
            }]
          }
        ]}
      >
        <LinearGradient
          colors={theme.gradients.glass}
          style={styles.statGradient}
        >
          <View style={styles.statContent}>
            <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
              <stat.icon size={24} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  const renderWeeklyChart = () => {
    const maxTasks = getMaxValue(weeklyData, 'tasks');
    const maxHabits = getMaxValue(weeklyData, 'habits');
    const maxFocus = getMaxValue(weeklyData, 'focus');

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Weekly Overview</Text>
        <View style={styles.chart}>
          {weeklyData.map((day, index) => (
            <View key={day.day} style={styles.chartColumn}>
              <View style={styles.chartBars}>
                <View style={[
                  styles.chartBar,
                  styles.tasksBar,
                  { height: (day.tasks / maxTasks) * 100 }
                ]} />
                <View style={[
                  styles.chartBar,
                  styles.habitsBar,
                  { height: (day.habits / maxHabits) * 100 }
                ]} />
                <View style={[
                  styles.chartBar,
                  styles.focusBar,
                  { height: (day.focus / maxFocus) * 100 }
                ]} />
              </View>
              <Text style={styles.chartLabel}>{day.day}</Text>
            </View>
          ))}
        </View>
        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: theme.colors.success }]} />
            <Text style={styles.legendText}>Tasks</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: theme.colors.primary }]} />
            <Text style={styles.legendText}>Habits</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: theme.colors.secondary }]} />
            <Text style={styles.legendText}>Focus</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderAchievement = (achievement: any, index: number) => (
    <Animated.View 
      key={achievement.title}
      style={[
        styles.achievementCard,
        {
          opacity: animatedValues.productivity,
          transform: [{
            translateX: animatedValues.productivity.interpolate({
              inputRange: [0, 1],
              outputRange: [100, 0],
            })
          }]
        }
      ]}
    >
      <LinearGradient
        colors={theme.gradients.glass}
        style={styles.achievementGradient}
      >
        <View style={styles.achievementContent}>
          <View style={[styles.achievementIcon, { backgroundColor: achievement.color + '20' }]}>
            <achievement.icon size={20} color={achievement.color} />
          </View>
          <View style={styles.achievementText}>
            <Text style={styles.achievementTitle}>{achievement.title}</Text>
            <Text style={styles.achievementDescription}>{achievement.description}</Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Statistics</Text>
          <Text style={styles.headerSubtitle}>Your productivity insights</Text>
        </View>

        <View style={styles.statsGrid}>
          {statsData.map((stat, index) => renderStatCard(stat, index))}
        </View>

        {renderWeeklyChart()}

        <View style={styles.achievementsContainer}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          {achievements.map((achievement, index) => renderAchievement(achievement, index))}
        </View>

        <View style={styles.quoteContainer}>
          <LinearGradient
            colors={theme.gradients.primary}
            style={styles.quoteGradient}
          >
            <View style={styles.quoteContent}>
              <Text style={styles.quoteText}>"{randomQuote}"</Text>
              <Text style={styles.quoteAuthor}>— Daily Motivation</Text>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.insightsContainer}>
          <Text style={styles.sectionTitle}>Insights</Text>
          <View style={styles.insightsList}>
            <View style={styles.insightItem}>
              <Activity size={20} color={theme.colors.success} />
              <Text style={styles.insightText}>
                You're most productive on Thursdays
              </Text>
            </View>
            <View style={styles.insightItem}>
              <TrendingUp size={20} color={theme.colors.primary} />
              <Text style={styles.insightText}>
                Your focus time has increased by 25% this week
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Star size={20} color={theme.colors.warning} />
              <Text style={styles.insightText}>
                Keep up the great work with your habits!
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  statCard: {
    width: (width - theme.spacing.md * 3) / 2,
    borderRadius: theme.borderRadius.lg,
    elevation: theme.elevation.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statGradient: {
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: theme.spacing.md,
  },
  statContent: {
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  statValue: {
    ...theme.typography.h2,
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
  chartContainer: {
    margin: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    elevation: theme.elevation.sm,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartTitle: {
    ...theme.typography.h3,
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: theme.spacing.md,
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    gap: 2,
  },
  chartBar: {
    width: 8,
    borderRadius: theme.borderRadius.sm,
  },
  tasksBar: {
    backgroundColor: theme.colors.success,
  },
  habitsBar: {
    backgroundColor: theme.colors.primary,
  },
  focusBar: {
    backgroundColor: theme.colors.secondary,
  },
  chartLabel: {
    ...theme.typography.caption,
    color: theme.colors.onSurfaceVariant,
    marginTop: theme.spacing.sm,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: theme.borderRadius.sm,
  },
  legendText: {
    ...theme.typography.caption,
    color: theme.colors.onSurfaceVariant,
  },
  achievementsContainer: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.md,
  },
  achievementCard: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    elevation: theme.elevation.sm,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  achievementGradient: {
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: theme.spacing.md,
  },
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    ...theme.typography.body,
    color: theme.colors.onSurface,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  achievementDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.onSurfaceVariant,
  },
  quoteContainer: {
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    elevation: theme.elevation.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  quoteGradient: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  quoteContent: {
    alignItems: 'center',
  },
  quoteText: {
    ...theme.typography.body,
    color: '#FFFFFF',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: theme.spacing.sm,
  },
  quoteAuthor: {
    ...theme.typography.bodySmall,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  insightsContainer: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  insightsList: {
    gap: theme.spacing.md,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    elevation: theme.elevation.sm,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  insightText: {
    ...theme.typography.bodySmall,
    color: theme.colors.onSurface,
    marginLeft: theme.spacing.md,
    flex: 1,
  },
});
