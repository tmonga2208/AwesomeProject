import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Habit } from '@/types/habit';
import { theme } from '@/theme';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface HabitCardProps {
  habit: Habit;
  isCompleted?: boolean;
  onComplete: (id: string) => void;
  onSkip?: (id: string) => void;
}

const HabitCard: React.FC<HabitCardProps> = React.memo(({ habit, isCompleted = false, onComplete }) => {

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        {/* Icon */}
        <View style={[styles.iconWrapper, { backgroundColor: isCompleted ? theme.colors.primaryContainer : theme.colors.surfaceVariant }]}>
          <MaterialCommunityIcons 
            name={habit.iconName || 'water-outline'} 
            size={24} 
            color={isCompleted ? theme.colors.primary : theme.colors.secondary} 
          />
        </View>

        {/* Text */}
        <View style={styles.textContainer}>
          <Text style={styles.name}>{habit.name}</Text>
          <View style={styles.subtitleRow}>
            {isCompleted ? (
              <>
                <Feather name="check" size={12} color={theme.colors.outline} style={{ marginRight: 4 }} />
                <Text style={styles.subtitle}>COMPLETED</Text>
              </>
            ) : (
              <>
                <MaterialCommunityIcons name="history" size={12} color={theme.colors.outline} style={{ marginRight: 4 }} />
                <Text style={styles.subtitle}>
                  {habit.targetCount || 1} {habit.frequency === 'daily' ? 'DAILY' : 'WEEKLY'}{habit.targetUnit ? ` • ${habit.targetValue} ${habit.targetUnit}` : ''}
                </Text>
              </>
            )}
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          style={isCompleted ? styles.completedButton : styles.actionButton}
          onPress={() => onComplete(habit.id)}
          activeOpacity={0.7}
        >
          {isCompleted ? (
            <Feather name="check" size={16} color={theme.colors.onPrimary} />
          ) : (
            <Feather name="plus" size={18} color={theme.colors.onSurfaceVariant} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: 16,
    marginBottom: 16,
    ...theme.shadows.soft,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)', // subtle inner border
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontFamily: theme.typography.fonts.primary,
    fontSize: theme.typography.sizes.bodyMd,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.onSurface,
    marginBottom: 4,
    letterSpacing: theme.typography.letterSpacings.bodyMd,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    fontFamily: theme.typography.fonts.primary,
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.outline,
    letterSpacing: 0.5,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.full,
    borderWidth: 1.5,
    borderColor: theme.colors.outlineVariant,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  },
  completedButton: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
  },
});

export default HabitCard;
