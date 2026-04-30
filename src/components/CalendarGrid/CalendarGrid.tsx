import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from 'date-fns';
import { theme } from '@/theme';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import Feather from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');

interface CalendarGridProps {
  onDayPress?: (date: Date) => void;
  habitData?: { date: string; colors: string[] }[];
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ onDayPress, habitData = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const translateX = useSharedValue(0);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = useMemo(() => {
    const formatString = 'd';
    const dateFormat = 'yyyy-MM-dd';
    const rows = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      const row = [];
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, formatString);
        const cloneDay = day;
        const dateStr = format(day, dateFormat);
        const dayHabits = habitData.find((d) => d.date === dateStr);

        row.push(
          <TouchableOpacity
            key={cloneDay.toISOString()}
            style={styles.cell}
            onPress={() => onDayPress && onDayPress(cloneDay)}
          >
            <View
              style={[
                styles.dayContainer,
                isToday(cloneDay) && styles.todayContainer,
                !isSameMonth(cloneDay, monthStart) && styles.disabledContainer,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  isToday(cloneDay) && styles.todayText,
                  !isSameMonth(cloneDay, monthStart) && styles.disabledText,
                ]}
              >
                {formattedDate}
              </Text>
              <View style={styles.dotsContainer}>
                {dayHabits?.colors.slice(0, 3).map((color, idx) => (
                  <View key={idx} style={[styles.dot, { backgroundColor: color }]} />
                ))}
                {dayHabits && dayHabits.colors.length > 3 && (
                  <View style={[styles.dot, { backgroundColor: theme.colors.outline }]} />
                )}
              </View>
            </View>
          </TouchableOpacity>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <View key={day.toISOString()} style={styles.row}>
          {row}
        </View>
      );
    }
    return rows;
  }, [currentDate, habitData, onDayPress]);

  const changeMonth = (offset: number) => {
    setCurrentDate((prev) => (offset > 0 ? addMonths(prev, 1) : subMonths(prev, 1)));
    translateX.value = 0;
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      const threshold = width * 0.2;
      if (event.translationX > threshold) {
        // swipe right -> previous month
        translateX.value = withSpring(width, { damping: 15, stiffness: 200 }, () => {
          runOnJS(changeMonth)(-1);
        });
      } else if (event.translationX < -threshold) {
        // swipe left -> next month
        translateX.value = withSpring(-width, { damping: 15, stiffness: 200 }, () => {
          runOnJS(changeMonth)(1);
        });
      } else {
        // snap back
        translateX.value = withSpring(0, { damping: 15, stiffness: 200 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.iconButton}>
          <Feather name="chevron-left" size={24} color={theme.colors.onSurfaceVariant} />
        </TouchableOpacity>
        <Text style={styles.monthText}>{format(currentDate, 'MMMM yyyy')}</Text>
        <TouchableOpacity onPress={() => changeMonth(1)} style={styles.iconButton}>
          <Feather name="chevron-right" size={24} color={theme.colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderDaysOfWeek = () => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <View style={styles.daysOfWeek}>
        {daysOfWeek.map((day, idx) => (
          <Text key={idx} style={styles.dayOfWeekText}>
            {day}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderDaysOfWeek()}
      <GestureHandlerRootView>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={animatedStyle}>{days}</Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    ...theme.shadows.soft,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthText: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.onSurface,
    fontFamily: theme.typography.fonts.primary,
  },
  iconButton: {
    padding: 8,
  },
  daysOfWeek: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dayOfWeekText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.outline,
    fontFamily: theme.typography.fonts.primary,
    width: '14%',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  cell: {
    width: '14%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
  todayContainer: {
    backgroundColor: theme.colors.primaryContainer,
  },
  disabledContainer: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: theme.typography.sizes.bodySm,
    color: theme.colors.onSurface,
    fontFamily: theme.typography.fonts.primary,
  },
  todayText: {
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
  },
  disabledText: {
    color: theme.colors.outline,
  },
  dotsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 2,
    gap: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});

export default CalendarGrid;
