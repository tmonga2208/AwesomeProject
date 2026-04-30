import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { theme } from '@/theme';
import { springs } from '@/animations/springConfigs';
import Feather from 'react-native-vector-icons/Feather';

interface FABMenuProps {
  onNewHabit: () => void;
  onQuitHabit: () => void;
  onBrowseLibrary: () => void;
}

const FABMenu: React.FC<FABMenuProps> = ({ onNewHabit, onQuitHabit, onBrowseLibrary }) => {
  const [isOpen, setIsOpen] = useState(false);
  const animation = useSharedValue(0);

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    animation.value = withSpring(toValue, springs.bouncy);
    setIsOpen(!isOpen);
  };

  const mainButtonStyle = useAnimatedStyle(() => {
    const rotation = interpolate(animation.value, [0, 1], [0, 45], Extrapolate.CLAMP);
    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  const createItemStyle = (index: number) => {
    return useAnimatedStyle(() => {
      const translateY = interpolate(animation.value, [0, 1], [0, -60 * (index + 1)]);
      const scale = interpolate(animation.value, [0, 1], [0, 1]);
      const opacity = interpolate(animation.value, [0, 1], [0, 1]);

      return {
        opacity,
        transform: [{ translateY }, { scale }],
      };
    });
  };

  return (
    <View style={styles.container}>
      {/* Menu Items */}
      <Animated.View style={[styles.menuItemContainer, createItemStyle(2)]}>
        <TouchableOpacity style={styles.menuItem} onPress={onBrowseLibrary}>
          <Text style={styles.menuItemText}>Library</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.menuItemContainer, createItemStyle(1)]}>
        <TouchableOpacity style={styles.menuItem} onPress={onQuitHabit}>
          <Text style={styles.menuItemText}>Quit Habit</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.menuItemContainer, createItemStyle(0)]}>
        <TouchableOpacity style={styles.menuItem} onPress={onNewHabit}>
          <Text style={styles.menuItemText}>New Habit</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Main FAB */}
      <TouchableOpacity onPress={toggleMenu} activeOpacity={0.8}>
        <Animated.View style={[styles.fab, mainButtonStyle]}>
          <Feather name="plus" size={32} color={theme.colors.onPrimary} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.medium,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  menuItemContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItem: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    ...theme.shadows.soft,
  },
  menuItemText: {
    fontFamily: theme.typography.fonts.primary,
    fontSize: theme.typography.sizes.bodyMd,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.primary,
  },
});

export default FABMenu;
