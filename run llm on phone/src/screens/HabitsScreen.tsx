import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Target, 
  Plus, 
  X, 
  Minus, 
  Star,
  TrendingUp,
  Calendar,
  Award
} from 'lucide-react-native';
import { theme } from '../theme/theme';

interface Habit {
  id: string;
  name: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  streak: number;
  bestStreak: number;
  color: string;
  createdAt: Date;
}

const habitColors = [
  theme.colors.primary,
  theme.colors.secondary,
  theme.colors.success,
  theme.colors.warning,
  theme.colors.info,
  '#8B5CF6',
  '#EC4899',
  '#F59E0B',
];

export default function HabitsScreen() {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      name: 'Drink Water',
      description: 'Stay hydrated throughout the day',
      target: 8,
      current: 5,
      unit: 'glasses',
      streak: 7,
      bestStreak: 12,
      color: theme.colors.info,
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'Exercise',
      description: 'Daily physical activity',
      target: 1,
      current: 1,
      unit: 'session',
      streak: 3,
      bestStreak: 8,
      color: theme.colors.success,
      createdAt: new Date(),
    },
    {
      id: '3',
      name: 'Read',
      description: 'Read for personal development',
      target: 30,
      current: 15,
      unit: 'minutes',
      streak: 2,
      bestStreak: 5,
      color: theme.colors.primary,
      createdAt: new Date(),
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    target: '1',
    unit: 'times',
    color: habitColors[0],
  });

  const incrementHabit = (id: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const newCurrent = Math.min(habit.current + 1, habit.target * 2);
        const newStreak = newCurrent >= habit.target ? habit.streak + 1 : habit.streak;
        const newBestStreak = Math.max(newStreak, habit.bestStreak);
        
        return {
          ...habit,
          current: newCurrent,
          streak: newStreak,
          bestStreak: newBestStreak,
        };
      }
      return habit;
    }));
  };

  const decrementHabit = (id: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const newCurrent = Math.max(habit.current - 1, 0);
        const newStreak = newCurrent >= habit.target ? habit.streak : 0;
        
        return {
          ...habit,
          current: newCurrent,
          streak: newStreak,
        };
      }
      return habit;
    }));
  };

  const deleteHabit = (id: string) => {
    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => setHabits(habits.filter(habit => habit.id !== id))
        },
      ]
    );
  };

  const addHabit = () => {
    if (!newHabit.name.trim()) return;
    
    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit.name,
      description: newHabit.description,
      target: parseInt(newHabit.target) || 1,
      current: 0,
      unit: newHabit.unit,
      streak: 0,
      bestStreak: 0,
      color: newHabit.color,
      createdAt: new Date(),
    };
    
    setHabits([habit, ...habits]);
    setNewHabit({ name: '', description: '', target: '1', unit: 'times', color: habitColors[0] });
    setModalVisible(false);
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const renderHabit = ({ item }: { item: Habit }) => {
    const progress = getProgressPercentage(item.current, item.target);
    const isCompleted = item.current >= item.target;
    
    return (
      <Animated.View style={styles.habitCard}>
        <LinearGradient
          colors={theme.gradients.glass}
          style={styles.habitGradient}
        >
          <View style={styles.habitContent}>
            <View style={styles.habitHeader}>
              <View style={styles.habitInfo}>
                <Text style={styles.habitName}>{item.name}</Text>
                {item.description ? (
                  <Text style={styles.habitDescription}>{item.description}</Text>
                ) : null}
              </View>
              
              <View style={styles.streakContainer}>
                <View style={[styles.streakBadge, { backgroundColor: item.color }]}>
                  <Star size={16} color="#FFFFFF" />
                  <Text style={styles.streakText}>{item.streak}</Text>
                </View>
                <Text style={styles.streakLabel}>day streak</Text>
              </View>
            </View>
            
            <View style={styles.progressSection}>
              <View style={styles.progressInfo}>
                <Text style={styles.progressText}>
                  {item.current} / {item.target} {item.unit}
                </Text>
                <Text style={styles.progressPercentage}>
                  {Math.round(progress)}%
                </Text>
              </View>
              
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <LinearGradient
                    colors={[item.color, item.color + '80']}
                    style={[styles.progressFill, { width: `${progress}%` }]}
                  />
                </View>
              </View>
            </View>
            
            <View style={styles.habitActions}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.decrementButton]}
                onPress={() => decrementHabit(item.id)}
                disabled={item.current === 0}
              >
                <Minus size={20} color={item.current === 0 ? theme.colors.onSurfaceVariant : theme.colors.error} />
              </TouchableOpacity>
              
              <View style={styles.counterContainer}>
                <Text style={styles.counterText}>{item.current}</Text>
              </View>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.incrementButton]}
                onPress={() => incrementHabit(item.id)}
              >
                <Plus size={20} color={theme.colors.success} />
              </TouchableOpacity>
            </View>
            
            {isCompleted && (
              <View style={styles.completionBadge}>
                <Award size={16} color={theme.colors.success} />
                <Text style={styles.completionText}>Completed!</Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  const totalHabits = habits.length;
  const completedHabits = habits.filter(habit => habit.current >= habit.target).length;
  const totalStreak = habits.reduce((sum, habit) => sum + habit.streak, 0);
  const averageStreak = totalHabits > 0 ? Math.round(totalStreak / totalHabits) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Habits</Text>
          <Text style={styles.headerSubtitle}>
            {completedHabits} of {totalHabits} completed • {averageStreak} avg streak
          </Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <TrendingUp size={20} color={theme.colors.success} />
            <Text style={styles.statValue}>{totalStreak}</Text>
            <Text style={styles.statLabel}>Total Streak</Text>
          </View>
          
          <View style={styles.statItem}>
            <Calendar size={20} color={theme.colors.primary} />
            <Text style={styles.statValue}>{completedHabits}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={habits}
        renderItem={renderHabit}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <LinearGradient
          colors={theme.gradients.secondary}
          style={styles.fabGradient}
        >
          <Plus size={24} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Habit</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <X size={24} color={theme.colors.onSurface} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Habit name"
              value={newHabit.name}
              onChangeText={(text) => setNewHabit({ ...newHabit, name: text })}
              placeholderTextColor={theme.colors.onSurfaceVariant}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description (optional)"
              value={newHabit.description}
              onChangeText={(text) => setNewHabit({ ...newHabit, description: text })}
              placeholderTextColor={theme.colors.onSurfaceVariant}
              multiline
              numberOfLines={3}
            />
            
            <View style={styles.targetSection}>
              <Text style={styles.sectionTitle}>Daily Target</Text>
              <View style={styles.targetInputs}>
                <TextInput
                  style={[styles.input, styles.targetInput]}
                  placeholder="1"
                  value={newHabit.target}
                  onChangeText={(text) => setNewHabit({ ...newHabit, target: text })}
                  placeholderTextColor={theme.colors.onSurfaceVariant}
                  keyboardType="numeric"
                />
                <TextInput
                  style={[styles.input, styles.unitInput]}
                  placeholder="times"
                  value={newHabit.unit}
                  onChangeText={(text) => setNewHabit({ ...newHabit, unit: text })}
                  placeholderTextColor={theme.colors.onSurfaceVariant}
                />
              </View>
            </View>
            
            <View style={styles.colorSection}>
              <Text style={styles.sectionTitle}>Color</Text>
              <View style={styles.colorButtons}>
                {habitColors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorButton,
                      { backgroundColor: color },
                      newHabit.color === color && styles.colorButtonActive
                    ]}
                    onPress={() => setNewHabit({ ...newHabit, color })}
                  />
                ))}
              </View>
            </View>
          </View>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.addButton}
              onPress={addHabit}
            >
              <LinearGradient
                colors={theme.gradients.secondary}
                style={styles.addButtonGradient}
              >
                <Text style={styles.addButtonText}>Add Habit</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
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
  },
  headerContent: {
    marginBottom: theme.spacing.md,
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
  statsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    ...theme.typography.h3,
    color: theme.colors.onSurface,
    marginTop: theme.spacing.xs,
  },
  statLabel: {
    ...theme.typography.caption,
    color: theme.colors.onSurfaceVariant,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  habitCard: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    elevation: theme.elevation.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  habitGradient: {
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  habitContent: {
    padding: theme.spacing.md,
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    ...theme.typography.body,
    color: theme.colors.onSurface,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  habitDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.onSurfaceVariant,
  },
  streakContainer: {
    alignItems: 'center',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  streakText: {
    ...theme.typography.caption,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  streakLabel: {
    ...theme.typography.caption,
    color: theme.colors.onSurfaceVariant,
  },
  progressSection: {
    marginBottom: theme.spacing.md,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  progressText: {
    ...theme.typography.bodySmall,
    color: theme.colors.onSurface,
    fontWeight: '500',
  },
  progressPercentage: {
    ...theme.typography.bodySmall,
    color: theme.colors.onSurfaceVariant,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.borderRadius.full,
  },
  progressFill: {
    height: '100%',
    borderRadius: theme.borderRadius.full,
  },
  habitActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  decrementButton: {
    borderColor: theme.colors.error,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  incrementButton: {
    borderColor: theme.colors.success,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  counterContainer: {
    minWidth: 60,
    alignItems: 'center',
  },
  counterText: {
    ...theme.typography.h3,
    color: theme.colors.onSurface,
    fontWeight: '700',
  },
  completionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
    padding: theme.spacing.sm,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xs,
  },
  completionText: {
    ...theme.typography.bodySmall,
    color: theme.colors.success,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    right: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    elevation: theme.elevation.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  modalTitle: {
    ...theme.typography.h3,
    color: theme.colors.onSurface,
  },
  modalContent: {
    flex: 1,
    padding: theme.spacing.md,
  },
  input: {
    ...theme.typography.body,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    color: theme.colors.onSurface,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  targetSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.body,
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
  },
  targetInputs: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  targetInput: {
    flex: 1,
  },
  unitInput: {
    flex: 2,
  },
  colorSection: {
    marginBottom: theme.spacing.lg,
  },
  colorButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorButtonActive: {
    borderColor: theme.colors.onSurface,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  cancelButton: {
    flex: 1,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...theme.typography.body,
    color: theme.colors.onSurfaceVariant,
    fontWeight: '600',
  },
  addButton: {
    flex: 1,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  addButtonGradient: {
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  addButtonText: {
    ...theme.typography.body,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
