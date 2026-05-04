import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import FastImage from 'react-native-fast-image';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { SettingsStackParamList } from '@/navigation/SettingsStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme, useTheme } from '@/theme';
import { useStore } from '@/store';
import { useAuthStore } from '@/store/authStore';
import auth from '@react-native-firebase/auth';

const SettingsScreen = () => {
  const { colors, isDark } = useTheme();
  const { userProfile, themeMode, setThemeMode } = useStore();
  const { user } = useAuthStore();
  const navigation = useNavigation<NativeStackNavigationProp<SettingsStackParamList>>();
  
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: () => auth().signOut()
        },
      ]
    );
  };

  const displayName = userProfile?.displayName || user?.displayName || 'User';
  const email = userProfile?.email || user?.email || '';
  const avatarUrl = userProfile?.avatarUrl || user?.photoURL || 'https://i.pravatar.cc/150?u=me';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <FastImage
            source={{ uri: avatarUrl }}
            style={[styles.avatar, { borderColor: colors.surface }]}
          />
          <Text style={[styles.name, { color: colors.onSurface }]}>{displayName}</Text>
          <Text style={[styles.email, { color: colors.onSurfaceVariant }]}>{email}</Text>
          <TouchableOpacity 
            style={[styles.editProfileBtn, { backgroundColor: colors.surfaceVariant }]} 
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={[styles.editProfileText, { color: colors.onSurface }]}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Appearance Card */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionHeader, { color: colors.onSurfaceVariant }]}>APPEARANCE</Text>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Feather name="moon" size={20} color={colors.onSurface} style={styles.rowIcon} />
              <Text style={[styles.rowText, { color: colors.onSurface }]}>Dark Mode</Text>
            </View>
            <Switch
              value={themeMode === 'dark'}
              onValueChange={(value) => setThemeMode(value ? 'dark' : 'light')}
              trackColor={{ false: colors.surfaceDim, true: colors.primary }}
              thumbColor={'#FFFFFF'}
            />
          </View>
        </View>

        {/* Alerts Card */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionHeader, { color: colors.onSurfaceVariant }]}>ALERTS</Text>
          <View style={[styles.row, styles.rowBorder, { borderBottomColor: colors.outlineVariant }]}>
            <View style={styles.rowLeft}>
              <Feather name="bell" size={20} color={colors.onSurface} style={styles.rowIcon} />
              <Text style={[styles.rowText, { color: colors.onSurface }]}>Push Notifications</Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: colors.surfaceDim, true: colors.primary }}
              thumbColor={'#FFFFFF'}
            />
          </View>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Feather name="mail" size={20} color={colors.onSurface} style={styles.rowIcon} />
              <Text style={[styles.rowText, { color: colors.onSurface }]}>Email Digests</Text>
            </View>
            <Switch
              value={emailEnabled}
              onValueChange={setEmailEnabled}
              trackColor={{ false: colors.surfaceDim, true: colors.primary }}
              thumbColor={'#FFFFFF'}
            />
          </View>
        </View>

        {/* Dashboard Customization Card */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionHeader, { color: colors.onSurfaceVariant }]}>DASHBOARD CUSTOMIZATION</Text>
          <TouchableOpacity style={[styles.customizationBtn, { backgroundColor: colors.surfaceVariant }]}>
            <Feather name="grid" size={20} color={colors.onSurfaceVariant} style={styles.customizationIcon} />
            <Text style={[styles.customizationText, { color: colors.onSurface }]}>Widgets</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.customizationBtn, { backgroundColor: colors.surfaceVariant }]}>
            <Feather name="list" size={20} color={colors.onSurfaceVariant} style={styles.customizationIcon} />
            <Text style={[styles.customizationText, { color: colors.onSurface }]}>Layout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.customizationBtn, { backgroundColor: colors.surfaceVariant }]}>
            <Feather name="aperture" size={20} color={colors.onSurfaceVariant} style={styles.customizationIcon} />
            <Text style={[styles.customizationText, { color: colors.onSurface }]}>Themes</Text>
          </TouchableOpacity>
        </View>

        {/* Links Card */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <TouchableOpacity style={[styles.linkRow, styles.rowBorder, { borderBottomColor: colors.outlineVariant }]}>
            <View style={styles.rowLeft}>
              <Feather name="lock" size={20} color={colors.onSurface} style={styles.rowIcon} />
              <Text style={[styles.rowText, { color: colors.onSurface }]}>Privacy Policy</Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.outline} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.linkRow, styles.rowBorder, { borderBottomColor: colors.outlineVariant }]}>
            <View style={styles.rowLeft}>
              <Feather name="help-circle" size={20} color={colors.onSurface} style={styles.rowIcon} />
              <Text style={[styles.rowText, { color: colors.onSurface }]}>Help & Support</Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.outline} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow} onPress={handleSignOut}>
            <View style={styles.rowLeft}>
              <Feather name="log-out" size={20} color={colors.error} style={styles.rowIcon} />
              <Text style={[styles.rowText, { color: colors.error }]}>Sign Out</Text>
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.containerPadding,
    paddingBottom: 40,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    marginBottom: 16,
    ...theme.shadows.soft,
  },
  name: {
    fontSize: theme.typography.sizes.h2,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fonts.primary,
    marginBottom: 4,
  },
  email: {
    fontSize: theme.typography.sizes.bodySm,
    fontFamily: theme.typography.fonts.primary,
    marginBottom: 16,
  },
  editProfileBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editProfileText: {
    fontSize: theme.typography.sizes.bodySm,
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.typography.fonts.primary,
  },
  card: {
    borderRadius: theme.radius.md,
    padding: 20,
    marginBottom: 20,
    ...theme.shadows.soft,
  },
  sectionHeader: {
    fontSize: theme.typography.sizes.labelCaps,
    fontWeight: theme.typography.weights.bold,
    letterSpacing: theme.typography.letterSpacings.labelCaps,
    marginBottom: 16,
    fontFamily: theme.typography.fonts.primary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  rowBorder: {
    borderBottomWidth: 1,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIcon: {
    marginRight: 16,
  },
  rowText: {
    fontSize: theme.typography.sizes.bodyMd,
    fontFamily: theme.typography.fonts.primary,
  },
  customizationBtn: {
    borderRadius: theme.radius.default,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  customizationIcon: {
    marginBottom: 8,
  },
  customizationText: {
    fontSize: theme.typography.sizes.bodySm,
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.typography.fonts.primary,
  },
});

export default SettingsScreen;
