import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  TextInput,
  Switch,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme, useTheme } from '@/theme';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IconPickerModal from '@/components/IconPickerModal/IconPickerModal';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { TouchableOpacity as GHTouchableOpacity } from 'react-native-gesture-handler';
import { useStore } from '@/store';
import { useAuthStore } from '@/store/authStore';

const CreateHabitScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const { addHabit } = useStore();
  const { user } = useAuthStore();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const unitModalRef = useRef<BottomSheetModal>(null);
  
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('yoga');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [frequency, setFrequency] = useState<'Daily' | 'Weekly'>('Daily');
  const [goal, setGoal] = useState(1);
  const [targetValue, setTargetValue] = useState('');
  const [targetUnit, setTargetUnit] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(true);

  const categories = [
    { label: 'Mindfulness', color: isDark ? '#5A3A42' : '#FFD1DC' },
    { label: 'Health', color: isDark ? '#2E3A55' : '#D4E2FF' },
    { label: 'Focus', color: isDark ? '#2E4A2E' : '#D5EDD0' },
  ];

  const units = ['steps', 'min', 'hours', 'count'];

  const renderBackdrop = React.useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    []
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.surfaceVariant }]} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={20} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={[styles.appTitle, { color: colors.primary }]}>Ethos</Text>
        <Image 
          source={{ uri: 'https://i.pravatar.cc/100?img=5' }} 
          style={styles.avatar} 
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.titleSection}>
          <Text style={[styles.pageTitle, { color: colors.onSurface }]}>New Ritual</Text>
          <Text style={[styles.pageSubtitle, { color: colors.onSurfaceVariant }]}>Design a habit that nourishes your daily life.</Text>
        </View>

        {/* Habit Identity Card */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardLabel, { color: colors.primary }]}>Habit Identity</Text>
          <View style={[styles.inputContainer, { backgroundColor: colors.surfaceVariant }]}>
            <TouchableOpacity onPress={() => bottomSheetModalRef.current?.present()} style={[styles.iconSelectorBadge, { backgroundColor: colors.primaryContainer }]}>
               <MaterialCommunityIcons name={selectedIcon} size={28} color={colors.primary} />
            </TouchableOpacity>
            <TextInput
              style={[styles.input, { color: colors.onSurface }]}
              placeholder="e.g., Morning Meditation"
              placeholderTextColor={colors.outlineVariant}
              value={name}
              onChangeText={setName}
            />
          </View>
          
          <View style={styles.chipsRow}>
            {categories.map((cat) => (
              <TouchableOpacity 
                key={cat.label} 
                style={[
                  styles.chip, 
                  { backgroundColor: cat.color },
                  selectedCategory === cat.label && { borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)' }
                ]}
                onPress={() => setSelectedCategory(cat.label)}
              >
                <Text style={[styles.chipText, { color: colors.onSurfaceVariant }]}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Frequency Card */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardLabel, { color: colors.primary }]}>Frequency</Text>
          <View style={[styles.segmentedControl, { backgroundColor: colors.surfaceVariant }]}>
            <TouchableOpacity 
              style={[styles.segment, frequency === 'Daily' && [styles.activeSegment, { backgroundColor: colors.surface }]]}
              onPress={() => setFrequency('Daily')}
            >
              <Text style={[styles.segmentText, { color: colors.outline }, frequency === 'Daily' && { color: colors.onSurface, fontWeight: theme.typography.weights.semibold }]}>Daily</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.segment, frequency === 'Weekly' && [styles.activeSegment, { backgroundColor: colors.surface }]]}
              onPress={() => setFrequency('Weekly')}
            >
              <Text style={[styles.segmentText, { color: colors.outline }, frequency === 'Weekly' && { color: colors.onSurface, fontWeight: theme.typography.weights.semibold }]}>Weekly</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.goalRow}>
            <Text style={[styles.goalText, { color: colors.onSurface }]}>Goal: {goal}x {frequency.toLowerCase()}</Text>
            <View style={styles.stepper}>
              <TouchableOpacity style={[styles.stepperButton, { backgroundColor: colors.surfaceVariant }]} onPress={() => setGoal(Math.max(1, goal - 1))}>
                <Feather name="minus" size={16} color={colors.onSurface} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.stepperButton, { backgroundColor: colors.surfaceVariant }]} onPress={() => setGoal(goal + 1)}>
                <Feather name="plus" size={16} color={colors.onSurface} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Target Card */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardLabel, { color: colors.primary }]}>Daily Target (Optional)</Text>
          <View style={styles.targetContainer}>
            <View style={[styles.targetInputWrapper, { backgroundColor: colors.surfaceVariant }]}>
              <TextInput
                style={[styles.targetInput, { color: colors.onSurface }]}
                placeholder="10000"
                placeholderTextColor={colors.outlineVariant}
                value={targetValue}
                onChangeText={setTargetValue}
                keyboardType="numeric"
              />
            </View>
            <Text style={[styles.targetDivider, { color: colors.outline }]}>✕</Text>
            <TouchableOpacity 
              style={[styles.targetInputWrapper, { flex: 1.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surfaceVariant }]}
              onPress={() => unitModalRef.current?.present()}
            >
              <Text style={[styles.targetInput, !targetUnit && { color: colors.outlineVariant }]}>
                {targetUnit || 'Select unit...'}
              </Text>
              <Feather name="chevron-down" size={20} color={colors.outline} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Gentle Reminder Card */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardLabel, { color: colors.primary }]}>Gentle Reminder</Text>
          <View style={styles.reminderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Feather name="bell" size={20} color={colors.primary} style={{ marginRight: 16 }} />
              <Text style={[styles.timeText, { color: colors.onSurface }]}>07:30 AM</Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.outline} />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.outlineVariant }]} />
          <View style={styles.toggleRow}>
            <Text style={[styles.toggleText, { color: colors.outline }]}>Notification enabled</Text>
            <Switch 
              value={reminderEnabled} 
              onValueChange={setReminderEnabled} 
              trackColor={{ false: colors.outlineVariant, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Visualizing Success Card */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.visualizingHeader}>
            <View>
              <Text style={[styles.visualizingTitle, { color: colors.onSurface }]}>Visualizing Success</Text>
              <Text style={[styles.visualizingSubtitle, { color: colors.primary }]}>Your journey starts with a single{'\n'}intent.</Text>
            </View>
            <View style={[styles.leafIconBadge, { borderColor: colors.outlineVariant }]}>
              <Feather name="feather" size={18} color={colors.primary} />
            </View>
          </View>
          
          <Image 
            source={require('@/assets/images/leaf_droplets.png')} 
            style={styles.successImage} 
            resizeMode="cover"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]} onPress={async () => {
          if (!name.trim()) {
            Alert.alert('Missing Name', 'Please enter a habit name.');
            return;
          }
          if (!user?.uid) return;
          try {
            await addHabit(user.uid, {
              ownerId: user.uid,
              name: name.trim(),
              icon: selectedIcon,
              iconName: selectedIcon,
              color: categories.find((c) => c.label === selectedCategory)?.color || '#D5EDD0',
              category: selectedCategory || 'Focus',
              frequency: frequency === 'Daily' ? 'daily' : 'weekly',
              targetCount: goal,
              targetValue: targetValue ? Number(targetValue) : null,
              targetUnit: targetUnit || null,
              isQuitHabit: false,
              reminderTime: reminderEnabled ? '08:00' : null,
              createdAt: Date.now(),
              archivedAt: null,
            });
            navigation.goBack();
          } catch (error) {
            Alert.alert('Error', 'Failed to save habit. Please try again.');
            console.error('[CreateHabit] save error:', error);
          }
        }}>
          <Text style={[styles.saveButtonText, { color: colors.onPrimary }]}>Save Habit</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Icon Picker Bottom Sheet */}
      <IconPickerModal ref={bottomSheetModalRef} onSelect={(icon) => setSelectedIcon(icon)} />

      {/* Unit Picker Bottom Sheet */}
      <BottomSheetModal
        ref={unitModalRef}
        index={0}
        snapPoints={['40%']}
        backdropComponent={renderBackdrop}
        backgroundStyle={[styles.bottomSheetBackground, { backgroundColor: colors.background }]}
      >
        <View style={styles.bottomSheetContainer}>
          <Text style={[styles.bottomSheetTitle, { color: colors.onSurface }]}>Select Unit</Text>
          {units.map((unit) => (
            <GHTouchableOpacity
              key={unit}
              style={[styles.unitOptionRow, { borderBottomColor: colors.outlineVariant }]}
              onPress={() => {
                setTargetUnit(unit);
                unitModalRef.current?.dismiss();
              }}
            >
              <Text style={[styles.unitOptionText, { color: colors.onSurface }, targetUnit === unit && { fontWeight: theme.typography.weights.semibold, color: colors.primary }]}>
                {unit}
              </Text>
              {targetUnit === unit && <Feather name="check" size={20} color={colors.primary} />}
            </GHTouchableOpacity>
          ))}
        </View>
      </BottomSheetModal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.containerPadding,
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 20,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fonts.primary,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.containerPadding,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 32,
  },
  pageTitle: {
    fontSize: theme.typography.sizes.h1,
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.typography.fonts.primary,
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 16,
    fontFamily: theme.typography.fonts.primary,
  },
  card: {
    borderRadius: theme.radius.lg,
    padding: 24,
    marginBottom: 16,
    ...theme.shadows.soft,
  },
  cardLabel: {
    fontSize: theme.typography.sizes.labelCaps,
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.fonts.primary,
    letterSpacing: theme.typography.letterSpacings.labelCaps,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: theme.radius.md,
    padding: 8,
  },
  iconSelectorBadge: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.default,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: theme.typography.sizes.h3,
    fontFamily: theme.typography.fonts.primary,
    paddingVertical: 12,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 12,
    fontFamily: theme.typography.fonts.primary,
    fontWeight: '500',
  },
  segmentedControl: {
    flexDirection: 'row',
    borderRadius: theme.radius.md,
    padding: 4,
    marginBottom: 24,
  },
  segment: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeSegment: {
    ...theme.shadows.soft,
  },
  segmentText: {
    fontSize: 15,
    fontFamily: theme.typography.fonts.primary,
    fontWeight: '500',
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalText: {
    fontSize: theme.typography.sizes.bodySm,
    fontFamily: theme.typography.fonts.primary,
  },
  stepper: {
    flexDirection: 'row',
    gap: 12,
  },
  stepperButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reminderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeText: {
    fontSize: theme.typography.sizes.h2,
    fontFamily: theme.typography.fonts.primary,
  },
  divider: {
    height: 1,
    marginBottom: 20,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 12,
    fontFamily: theme.typography.fonts.primary,
  },
  visualizingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  visualizingTitle: {
    fontSize: 20,
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.typography.fonts.primary,
    marginBottom: 8,
  },
  visualizingSubtitle: {
    fontSize: theme.typography.sizes.bodySm,
    fontFamily: theme.typography.fonts.primary,
    lineHeight: 20,
  },
  leafIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successImage: {
    width: '100%',
    height: 160,
    borderRadius: 16,
  },
  saveButton: {
    borderRadius: theme.radius.lg,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    ...theme.shadows.medium,
  },
  saveButtonText: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.typography.fonts.primary,
  },
  targetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  targetInputWrapper: {
    flex: 1,
    borderRadius: theme.radius.default,
    paddingHorizontal: 16,
  },
  targetInput: {
    fontSize: theme.typography.sizes.bodyMd,
    fontFamily: theme.typography.fonts.primary,
    paddingVertical: 14,
  },
  targetDivider: {
    marginHorizontal: 16,
    fontSize: theme.typography.sizes.bodyMd,
    fontFamily: theme.typography.fonts.primary,
  },
  bottomSheetBackground: {
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
  },
  bottomSheetContainer: {
    flex: 1,
    padding: theme.spacing.containerPadding,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fonts.primary,
    marginBottom: 20,
  },
  unitOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  unitOptionText: {
    fontSize: theme.typography.sizes.h3,
    fontFamily: theme.typography.fonts.primary,
  },
});

export default CreateHabitScreen;
