import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { theme } from '@/theme';
import { format, startOfDay, endOfDay } from 'date-fns';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useStore } from '@/store';

const { width, height } = Dimensions.get('window');

interface DayDetailSheetProps {
  date: Date | null;
  onClose: () => void;
}

const DayDetailSheet: React.FC<DayDetailSheetProps> = ({ date, onClose }) => {
  const { completions, habits } = useStore();
  const translateX = useSharedValue(width);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (date) {
      // Slide in
      translateX.value = withSpring(0, { damping: 20, stiffness: 90 });
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      // Slide out
      translateX.value = withSpring(width, { damping: 20, stiffness: 90 });
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [date, translateX, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    pointerEvents: date ? 'auto' : 'none',
  }));

  const dayData = useMemo(() => {
    if (!date) return { completed: [], missed: [] };

    const start = startOfDay(date).getTime();
    const end = endOfDay(date).getTime();

    const dayCompletions = completions.filter(
      (c) => c.completedAt >= start && c.completedAt <= end
    );
    const completedHabitIds = new Set(dayCompletions.map((c) => c.habitId));

    const completed = habits.filter((h) => completedHabitIds.has(h.id));
    const missed = habits.filter((h) => !completedHabitIds.has(h.id) && h.frequency === 'daily');

    return { completed, missed, dayCompletions };
  }, [date, completions, habits]);

  if (!date) return null;

  return (
    <>
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />
      </Animated.View>

      <Animated.View style={[styles.sheet, animatedStyle]}>
        <View style={styles.header}>
          <Text style={styles.title}>{format(date, 'MMM do, yyyy')}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Feather name="x" size={24} color={theme.colors.onSurface} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>Completed Habits</Text>
          
          {dayData.completed.length > 0 ? (
            dayData.completed.map((habit) => {
              const comp = dayData.dayCompletions?.find(c => c.habitId === habit.id);
              return (
                <View key={habit.id} style={styles.habitItem}>
                  <MaterialCommunityIcons 
                    name={habit.iconName || 'star'} 
                    size={24} 
                    color={habit.color || theme.colors.primary} 
                    style={{ marginRight: 12 }}
                  />
                  <View style={styles.habitInfo}>
                    <Text style={styles.habitName}>{habit.name}</Text>
                    {comp?.memo && <Text style={styles.habitMemo}>"{comp.memo}"</Text>}
                    {comp?.value && <Text style={styles.habitMemo}>{comp.value} {habit.targetUnit}</Text>}
                  </View>
                  <Feather name="check-circle" size={20} color={theme.colors.primary} />
                </View>
              );
            })
          ) : (
            <Text style={styles.emptyText}>No habits completed on this day.</Text>
          )}
          
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Missed Habits</Text>

          {dayData.missed.length > 0 ? (
            dayData.missed.map((habit) => (
              <View key={habit.id} style={[styles.habitItem, styles.habitItemMissed]}>
                <MaterialCommunityIcons 
                  name={habit.iconName || 'star-outline'} 
                  size={24} 
                  color={theme.colors.outline} 
                  style={{ marginRight: 12 }}
                />
                <View style={styles.habitInfo}>
                  <Text style={[styles.habitName, styles.textMissed]}>{habit.name}</Text>
                </View>
                <Feather name="circle" size={20} color={theme.colors.outline} />
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>All daily habits were completed!</Text>
          )}

        </ScrollView>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 100,
  },
  sheet: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: width * 0.85,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 32,
    borderBottomLeftRadius: 32,
    zIndex: 101,
    paddingTop: 60,
    ...theme.shadows.medium,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: theme.colors.onBackground,
    fontFamily: theme.typography.fonts.primary,
  },
  closeBtn: {
    padding: 8,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.typography.fonts.primary,
    marginBottom: 16,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    marginBottom: 12,
  },
  habitItemMissed: {
    backgroundColor: 'transparent',
    borderStyle: 'dashed',
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
    fontFamily: theme.typography.fonts.primary,
    marginBottom: 4,
  },
  habitMemo: {
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.typography.fonts.primary,
    fontStyle: 'italic',
  },
  textMissed: {
    color: theme.colors.outline,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.outline,
    fontFamily: theme.typography.fonts.primary,
    fontStyle: 'italic',
    marginBottom: 12,
  },
});

export default DayDetailSheet;
