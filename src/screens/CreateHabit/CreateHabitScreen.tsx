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
import { theme } from '@/theme';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IconPickerModal from '@/components/IconPickerModal/IconPickerModal';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { TouchableOpacity as GHTouchableOpacity } from 'react-native-gesture-handler';
import { useStore } from '@/store';
import { useAuthStore } from '@/store/authStore';

const CreateHabitScreen = () => {
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
    { label: 'Mindfulness', color: '#FFD1DC' }, // light pink
    { label: 'Health', color: '#D4E2FF' }, // light blue
    { label: 'Focus', color: '#D5EDD0' }, // light green
  ];

  const units = ['steps', 'min', 'hours', 'count'];

  const renderBackdrop = React.useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={20} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.appTitle}>Ethos</Text>
        <Image 
          source={{ uri: 'https://i.pravatar.cc/100?img=5' }} 
          style={styles.avatar} 
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>New Ritual</Text>
          <Text style={styles.pageSubtitle}>Design a habit that nourishes your daily life.</Text>
        </View>

        {/* Habit Identity Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Habit Identity</Text>
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => bottomSheetModalRef.current?.present()} style={styles.iconSelectorBadge}>
               <MaterialCommunityIcons name={selectedIcon} size={28} color={theme.colors.primary} />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="e.g., Morning Meditation"
              placeholderTextColor={theme.colors.outlineVariant}
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
                  selectedCategory === cat.label && { borderWidth: 1, borderColor: 'rgba(0,0,0,0.2)' }
                ]}
                onPress={() => setSelectedCategory(cat.label)}
              >
                <Text style={styles.chipText}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Frequency Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Frequency</Text>
          <View style={styles.segmentedControl}>
            <TouchableOpacity 
              style={[styles.segment, frequency === 'Daily' && styles.activeSegment]}
              onPress={() => setFrequency('Daily')}
            >
              <Text style={[styles.segmentText, frequency === 'Daily' && styles.activeSegmentText]}>Daily</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.segment, frequency === 'Weekly' && styles.activeSegment]}
              onPress={() => setFrequency('Weekly')}
            >
              <Text style={[styles.segmentText, frequency === 'Weekly' && styles.activeSegmentText]}>Weekly</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.goalRow}>
            <Text style={styles.goalText}>Goal: {goal}x {frequency.toLowerCase()}</Text>
            <View style={styles.stepper}>
              <TouchableOpacity style={styles.stepperButton} onPress={() => setGoal(Math.max(1, goal - 1))}>
                <Feather name="minus" size={16} color={theme.colors.onSurface} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.stepperButton} onPress={() => setGoal(goal + 1)}>
                <Feather name="plus" size={16} color={theme.colors.onSurface} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Target Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Daily Target (Optional)</Text>
          <View style={styles.targetContainer}>
            <View style={styles.targetInputWrapper}>
              <TextInput
                style={styles.targetInput}
                placeholder="10000"
                placeholderTextColor={theme.colors.outlineVariant}
                value={targetValue}
                onChangeText={setTargetValue}
                keyboardType="numeric"
              />
            </View>
            <Text style={styles.targetDivider}>✕</Text>
            <TouchableOpacity 
              style={[styles.targetInputWrapper, { flex: 1.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
              onPress={() => unitModalRef.current?.present()}
            >
              <Text style={[styles.targetInput, !targetUnit && { color: theme.colors.outlineVariant }]}>
                {targetUnit || 'Select unit...'}
              </Text>
              <Feather name="chevron-down" size={20} color={theme.colors.outline} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Gentle Reminder Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Gentle Reminder</Text>
          <View style={styles.reminderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Feather name="bell" size={20} color={theme.colors.primary} style={{ marginRight: 16 }} />
              <Text style={styles.timeText}>07:30 AM</Text>
            </View>
            <Feather name="chevron-right" size={20} color={theme.colors.outline} />
          </View>
          <View style={styles.divider} />
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>Notification enabled</Text>
            <Switch 
              value={reminderEnabled} 
              onValueChange={setReminderEnabled} 
              trackColor={{ false: theme.colors.outlineVariant, true: theme.colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Visualizing Success Card */}
        <View style={styles.card}>
          <View style={styles.visualizingHeader}>
            <View>
              <Text style={styles.visualizingTitle}>Visualizing Success</Text>
              <Text style={styles.visualizingSubtitle}>Your journey starts with a single{'\n'}intent.</Text>
            </View>
            <View style={styles.leafIconBadge}>
              <Feather name="feather" size={18} color={theme.colors.primary} />
            </View>
          </View>
          
          <Image 
            source={require('@/assets/images/leaf_droplets.png')} 
            style={styles.successImage} 
            resizeMode="cover"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={async () => {
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
          <Text style={styles.saveButtonText}>Save Habit</Text>
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
        backgroundStyle={styles.bottomSheetBackground}
      >
        <View style={styles.bottomSheetContainer}>
          <Text style={styles.bottomSheetTitle}>Select Unit</Text>
          {units.map((unit) => (
            <GHTouchableOpacity
              key={unit}
              style={styles.unitOptionRow}
              onPress={() => {
                setTargetUnit(unit);
                unitModalRef.current?.dismiss();
              }}
            >
              <Text style={[styles.unitOptionText, targetUnit === unit && styles.unitOptionTextActive]}>
                {unit}
              </Text>
              {targetUnit === unit && <Feather name="check" size={20} color={theme.colors.primary} />}
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
    backgroundColor: theme.colors.background,
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
    backgroundColor: theme.colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 20,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.primary,
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
    color: theme.colors.onSurface,
    fontFamily: theme.typography.fonts.primary,
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.typography.fonts.primary,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: 24,
    marginBottom: 16,
    ...theme.shadows.soft,
  },
  cardLabel: {
    fontSize: theme.typography.sizes.labelCaps,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary,
    fontFamily: theme.typography.fonts.primary,
    letterSpacing: theme.typography.letterSpacings.labelCaps,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.radius.md,
    padding: 8,
  },
  iconSelectorBadge: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.default,
    backgroundColor: theme.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: theme.typography.sizes.h3,
    color: theme.colors.onSurface,
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
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.typography.fonts.primary,
    fontWeight: '500',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceVariant,
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
    backgroundColor: theme.colors.surface,
    ...theme.shadows.soft,
  },
  segmentText: {
    fontSize: 15,
    color: theme.colors.outline,
    fontFamily: theme.typography.fonts.primary,
    fontWeight: '500',
  },
  activeSegmentText: {
    color: theme.colors.onSurface,
    fontWeight: theme.typography.weights.semibold,
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalText: {
    fontSize: theme.typography.sizes.bodySm,
    color: theme.colors.onSurface,
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
    backgroundColor: theme.colors.surfaceVariant,
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
    color: theme.colors.onSurface,
    fontFamily: theme.typography.fonts.primary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.outlineVariant,
    marginBottom: 20,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 12,
    color: theme.colors.outline,
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
    color: theme.colors.onSurface,
    fontFamily: theme.typography.fonts.primary,
    marginBottom: 8,
  },
  visualizingSubtitle: {
    fontSize: theme.typography.sizes.bodySm,
    color: theme.colors.primary,
    fontFamily: theme.typography.fonts.primary,
    lineHeight: 20,
  },
  leafIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successImage: {
    width: '100%',
    height: 160,
    borderRadius: 16,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    ...theme.shadows.medium,
  },
  saveButtonText: {
    color: theme.colors.onPrimary,
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.typography.fonts.primary,
  },
  saveButtonDecoration: {
    color: theme.colors.onPrimary,
    fontSize: theme.typography.sizes.h3,
    fontWeight: '300',
    fontFamily: theme.typography.fonts.primary,
  },
  targetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  targetInputWrapper: {
    flex: 1,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.radius.default,
    paddingHorizontal: 16,
  },
  targetInput: {
    fontSize: theme.typography.sizes.bodyMd,
    color: theme.colors.onSurface,
    fontFamily: theme.typography.fonts.primary,
    paddingVertical: 14,
  },
  targetDivider: {
    marginHorizontal: 16,
    fontSize: theme.typography.sizes.bodyMd,
    color: theme.colors.outline,
    fontFamily: theme.typography.fonts.primary,
  },
  bottomSheetBackground: {
    backgroundColor: theme.colors.background,
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
    color: theme.colors.onSurface,
    fontFamily: theme.typography.fonts.primary,
    marginBottom: 20,
  },
  unitOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
  },
  unitOptionText: {
    fontSize: theme.typography.sizes.h3,
    color: theme.colors.onSurface,
    fontFamily: theme.typography.fonts.primary,
  },
  unitOptionTextActive: {
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.primary,
  },
});

export default CreateHabitScreen;
