import React, { useCallback, useMemo, forwardRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { theme } from '@/theme';

export type CreateHabitBottomSheetRef = BottomSheetModal;

interface Props {
  onDismiss?: () => void;
}

const CreateHabitBottomSheet = forwardRef<CreateHabitBottomSheetRef, Props>(
  ({ onDismiss }, ref) => {
    // Snap points for the bottom sheet
    const snapPoints = useMemo(() => ['50%', '90%'], []);

    // Render backdrop with blur (glassmorphism effect)
    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      ),
      []
    );

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        onDismiss={onDismiss}
        backgroundStyle={styles.background}
        handleIndicatorStyle={styles.indicator}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Create Habit</Text>
          <Text style={styles.subtitle}>Let's build a new routine</Text>
          
          <View style={styles.placeholderContent}>
            <Text style={styles.placeholderText}>
              Step 1: Type → Step 2: Name/Icon → Step 3: Frequency
            </Text>
          </View>
        </View>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  background: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  indicator: {
    backgroundColor: theme.colors.outlineVariant,
    width: 40,
  },
  container: {
    flex: 1,
    padding: theme.spacing.containerPadding,
  },
  title: {
    fontFamily: theme.typography.fonts.primary,
    fontSize: theme.typography.sizes.h2,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.onSurface,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontFamily: theme.typography.fonts.primary,
    fontSize: theme.typography.sizes.bodyMd,
    color: theme.colors.onSurfaceVariant,
    marginBottom: theme.spacing.xl,
  },
  placeholderContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontFamily: theme.typography.fonts.primary,
    fontSize: theme.typography.sizes.bodyMd,
    color: theme.colors.onSurfaceVariant,
  },
});

export default CreateHabitBottomSheet;
