import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import FastImage from 'react-native-fast-image';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { SettingsStackParamList } from '@/navigation/SettingsStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '@/theme';
import { useStore } from '@/store';
import { useAuthStore } from '@/store/authStore';
import auth from '@react-native-firebase/auth';

const SettingsScreen = () => {
  const { userProfile } = useStore();
  const { user } = useAuthStore();
  const navigation = useNavigation<NativeStackNavigationProp<SettingsStackParamList>>();
  
  const [darkMode, setDarkMode] = useState(false);
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <FastImage
            source={{ uri: avatarUrl }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{email}</Text>
          <TouchableOpacity 
            style={styles.editProfileBtn} 
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Appearance Card */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>APPEARANCE</Text>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Feather name="moon" size={20} color={theme.colors.onSurface} style={styles.rowIcon} />
              <Text style={styles.rowText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: theme.colors.surfaceDim, true: theme.colors.primary }}
              thumbColor={theme.colors.onPrimary}
            />
          </View>
        </View>

        {/* Alerts Card */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>ALERTS</Text>
          <View style={[styles.row, styles.rowBorder]}>
            <View style={styles.rowLeft}>
              <Feather name="bell" size={20} color={theme.colors.onSurface} style={styles.rowIcon} />
              <Text style={styles.rowText}>Push Notifications</Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: theme.colors.surfaceDim, true: theme.colors.primary }}
              thumbColor={theme.colors.onPrimary}
            />
          </View>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Feather name="mail" size={20} color={theme.colors.onSurface} style={styles.rowIcon} />
              <Text style={styles.rowText}>Email Digests</Text>
            </View>
            <Switch
              value={emailEnabled}
              onValueChange={setEmailEnabled}
              trackColor={{ false: theme.colors.surfaceDim, true: theme.colors.primary }}
              thumbColor={theme.colors.onPrimary}
            />
          </View>
        </View>

        {/* Dashboard Customization Card */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>DASHBOARD CUSTOMIZATION</Text>
          <TouchableOpacity style={styles.customizationBtn}>
            <Feather name="grid" size={20} color={theme.colors.onSurfaceVariant} style={styles.customizationIcon} />
            <Text style={styles.customizationText}>Widgets</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.customizationBtn}>
            <Feather name="list" size={20} color={theme.colors.onSurfaceVariant} style={styles.customizationIcon} />
            <Text style={styles.customizationText}>Layout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.customizationBtn}>
            <Feather name="aperture" size={20} color={theme.colors.onSurfaceVariant} style={styles.customizationIcon} />
            <Text style={styles.customizationText}>Themes</Text>
          </TouchableOpacity>
        </View>

        {/* Links Card */}
        <View style={styles.card}>
          <TouchableOpacity style={[styles.linkRow, styles.rowBorder]}>
            <View style={styles.rowLeft}>
              <Feather name="lock" size={20} color={theme.colors.onSurface} style={styles.rowIcon} />
              <Text style={styles.rowText}>Privacy Policy</Text>
            </View>
            <Feather name="chevron-right" size={20} color={theme.colors.outline} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.linkRow, styles.rowBorder]}>
            <View style={styles.rowLeft}>
              <Feather name="help-circle" size={20} color={theme.colors.onSurface} style={styles.rowIcon} />
              <Text style={styles.rowText}>Help & Support</Text>
            </View>
            <Feather name="chevron-right" size={20} color={theme.colors.outline} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow} onPress={handleSignOut}>
            <View style={styles.rowLeft}>
              <Feather name="log-out" size={20} color={theme.colors.error} style={styles.rowIcon} />
              <Text style={[styles.rowText, { color: theme.colors.error }]}>Sign Out</Text>
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
    backgroundColor: theme.colors.background,
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
    borderColor: theme.colors.surface,
    marginBottom: 16,
    ...theme.shadows.soft,
  },
  name: {
    fontSize: theme.typography.sizes.h2,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.onSurface,
    fontFamily: theme.typography.fonts.primary,
    marginBottom: 4,
  },
  email: {
    fontSize: theme.typography.sizes.bodySm,
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.typography.fonts.primary,
    marginBottom: 16,
  },
  editProfileBtn: {
    backgroundColor: theme.colors.surfaceVariant,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editProfileText: {
    fontSize: theme.typography.sizes.bodySm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.onSurface,
    fontFamily: theme.typography.fonts.primary,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: 20,
    marginBottom: 20,
    ...theme.shadows.soft,
  },
  sectionHeader: {
    fontSize: theme.typography.sizes.labelCaps,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.onSurfaceVariant,
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
    borderBottomColor: theme.colors.outlineVariant,
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
    color: theme.colors.onSurface,
    fontFamily: theme.typography.fonts.primary,
  },
  customizationBtn: {
    backgroundColor: theme.colors.surfaceVariant,
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
    color: theme.colors.onSurface,
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.typography.fonts.primary,
  },
});

export default SettingsScreen;
