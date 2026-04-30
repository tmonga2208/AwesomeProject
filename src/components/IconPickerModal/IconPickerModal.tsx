import React, { useCallback, useMemo, forwardRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { theme } from '@/theme';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export type IconPickerModalRef = BottomSheetModal;

interface Props {
  onDismiss?: () => void;
  onSelect?: (iconName: string) => void;
}

const IconPickerModal = forwardRef<IconPickerModalRef, Props>(({ onDismiss, onSelect }, ref) => {
  const snapPoints = useMemo(() => ['85%'], []);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedIcon, setSelectedIcon] = useState('yoga');

  const categories = ['All', 'Health', 'Mind', 'Work'];
  
  const mindIcons = ['brain', 'yoga', 'weather-night', 'star-four-points-outline'];
  const healthIcons = ['dumbbell', 'heart-pulse', 'run', 'apple', 'water-outline'];

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Choose Icon</Text>
          <TouchableOpacity onPress={() => (ref as React.MutableRefObject<BottomSheetModal>).current?.dismiss()}>
            <Feather name="x" size={24} color={theme.colors.onSurface} />
          </TouchableOpacity>
        </View>

        {/* Current Selection */}
        <View style={styles.selectionCard}>
          <View style={styles.selectionIconBadge}>
            <MaterialCommunityIcons name={selectedIcon} size={28} color={theme.colors.primary} />
          </View>
          <View>
            <Text style={styles.selectionSubtitle}>CURRENT SELECTION</Text>
            <Text style={styles.selectionTitle}>Meditation</Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color={theme.colors.outline} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search icons..."
            placeholderTextColor={theme.colors.outline}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Categories */}
        <View style={styles.chipsRow}>
          {categories.map((cat) => (
            <TouchableOpacity 
              key={cat} 
              style={[styles.chip, selectedCategory === cat && styles.chipActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.chipText, selectedCategory === cat && styles.chipTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
          {/* Mind Section */}
          <Text style={styles.sectionTitle}>MIND</Text>
          <View style={styles.iconGrid}>
            {mindIcons.map((icon) => (
              <TouchableOpacity 
                key={icon} 
                style={[styles.iconButton, selectedIcon === icon && styles.iconButtonActive]}
                onPress={() => setSelectedIcon(icon)}
              >
                <MaterialCommunityIcons 
                  name={icon} 
                  size={24} 
                  color={selectedIcon === icon ? theme.colors.primary : theme.colors.onSurface} 
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Health Section */}
          <Text style={styles.sectionTitle}>HEALTH</Text>
          <View style={styles.iconGrid}>
            {healthIcons.map((icon) => (
              <TouchableOpacity 
                key={icon} 
                style={[styles.iconButton, selectedIcon === icon && styles.iconButtonActive]}
                onPress={() => setSelectedIcon(icon)}
              >
                <MaterialCommunityIcons 
                  name={icon} 
                  size={24} 
                  color={selectedIcon === icon ? theme.colors.primary : theme.colors.onSurface} 
                />
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => (ref as React.MutableRefObject<BottomSheetModal>).current?.dismiss()}
          >
            <Text style={styles.cancelButtonText}>CANCEL</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.selectButton}
            onPress={() => {
              if (onSelect) onSelect(selectedIcon);
              (ref as React.MutableRefObject<BottomSheetModal>).current?.dismiss();
            }}
          >
            <Text style={styles.selectButtonText}>SELECT ICON</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  background: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
  },
  indicator: {
    backgroundColor: theme.colors.surfaceVariant,
    width: 48,
    height: 4,
    marginTop: 8,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.containerPadding,
    paddingTop: 8,
    paddingBottom: 24,
  },
  title: {
    fontSize: theme.typography.sizes.h2,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.onSurface,
    fontFamily: theme.typography.fonts.primary,
  },
  selectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.containerPadding,
    padding: 20,
    borderRadius: theme.radius.lg,
    marginBottom: 24,
    ...theme.shadows.soft,
  },
  selectionIconBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  selectionSubtitle: {
    fontSize: 10,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    letterSpacing: theme.typography.letterSpacings.labelCaps,
    marginBottom: 4,
  },
  selectionTitle: {
    fontSize: theme.typography.sizes.h2,
    color: theme.colors.onSurface,
    fontFamily: theme.typography.fonts.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    marginHorizontal: theme.spacing.containerPadding,
    borderRadius: theme.radius.md,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: theme.typography.sizes.bodySm,
    fontFamily: theme.typography.fonts.primary,
    color: theme.colors.onSurface,
  },
  chipsRow: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.containerPadding,
    gap: 8,
    marginBottom: 24,
  },
  chip: {
    backgroundColor: theme.colors.surfaceVariant,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
  },
  chipText: {
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.onSurface,
    fontFamily: theme.typography.fonts.primary,
  },
  chipTextActive: {
    color: theme.colors.onPrimary,
  },
  scrollArea: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: theme.colors.outlineVariant,
    paddingTop: 24,
    paddingHorizontal: theme.spacing.containerPadding,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.labelCaps,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.onSurface,
    letterSpacing: theme.typography.letterSpacings.labelCaps,
    marginBottom: 16,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  },
  iconButton: {
    width: 64,
    height: 64,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.soft,
  },
  iconButtonActive: {
    backgroundColor: theme.colors.primaryContainer,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: theme.spacing.containerPadding,
    paddingTop: 16,
    paddingBottom: 32,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.radius.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.onSurface,
    letterSpacing: theme.typography.letterSpacings.labelCaps,
  },
  selectButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.onPrimary,
    letterSpacing: theme.typography.letterSpacings.labelCaps,
  },
});

export default IconPickerModal;
