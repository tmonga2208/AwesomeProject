import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import { theme, useTheme } from '@/theme';
import { useStore } from '@/store';
import { useAuthStore } from '@/store/authStore';
import auth from '@react-native-firebase/auth';
import * as userService from '@/services/userService';

const EditProfileScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const { userProfile } = useStore();
  const { user, setUser } = useAuthStore();
  
  const [name, setName] = useState(userProfile?.displayName || user?.displayName || '');
  const [isSaving, setIsSaving] = useState(false);

  const googleLinked = user?.providerData.some(p => p.providerId === 'google.com');
  const appleLinked = user?.providerData.some(p => p.providerId === 'apple.com');

  const handleSave = async () => {
    console.log('[EditProfile] handleSave called with name:', name);
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    if (!user?.uid) {
      console.error('[EditProfile] No user UID');
      return;
    }

    setIsSaving(true);
    try {
      console.log('[EditProfile] Saving to Firestore...');
      await userService.updateUserProfile(user.uid, {
        displayName: name.trim(),
      });
      console.log('[EditProfile] Firestore save success');

      // Try to update Auth profile too (non-blocking)
      try {
        await auth().currentUser?.updateProfile({
          displayName: name.trim(),
        });
        console.log('[EditProfile] Auth profile updated');
      } catch (authErr) {
        console.warn('[EditProfile] Auth profile update failed (non-critical):', authErr);
      }

      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error: any) {
      console.error('[EditProfile] Error updating profile:', error?.message || error);
      Alert.alert('Error', `Failed to update profile: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const avatarUrl = userProfile?.avatarUrl || user?.photoURL || 'https://i.pravatar.cc/150?u=me';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={[styles.header, { borderBottomColor: colors.outlineVariant }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={colors.onSurface} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.onSurface }]}>Edit Profile</Text>
          <TouchableOpacity onPress={handleSave} disabled={isSaving}>
            <Text style={[styles.saveText, { color: colors.primary }, isSaving && { opacity: 0.5 }]}>
              {isSaving ? '...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <FastImage source={{ uri: avatarUrl }} style={[styles.avatar, { backgroundColor: colors.surfaceVariant }]} />
              <TouchableOpacity style={[styles.editAvatarBadge, { backgroundColor: colors.primary, borderColor: colors.background }]}>
                <Feather name="camera" size={16} color={colors.onPrimary} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.changePhotoText, { color: colors.primary }]}>Change Profile Photo</Text>
          </View>

          {/* Form Section */}
          <View style={[styles.formCard, { backgroundColor: colors.surface }]}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.outline }]}>FULL NAME</Text>
              <TextInput
                style={[styles.input, { color: colors.onSurface }]}
                value={name}
                onChangeText={setName}
                placeholder="Your Name"
                placeholderTextColor={colors.outline}
              />
            </View>

            <View style={[styles.divider, { backgroundColor: colors.outlineVariant }]} />

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.outline }]}>EMAIL ADDRESS</Text>
              <View style={styles.disabledInputContainer}>
                <TextInput
                  style={[styles.input, styles.disabledInput, { color: colors.outline }]}
                  value={user?.email || ''}
                  editable={false}
                  selectTextOnFocus={false}
                />
                <Feather name="lock" size={16} color={colors.outline} />
              </View>
              <Text style={[styles.helperText, { color: colors.outline }]}>Email cannot be changed manually.</Text>
            </View>
          </View>

          {/* Connected Accounts Section */}
          <Text style={[styles.sectionHeader, { color: colors.onSurfaceVariant }]}>CONNECTED ACCOUNTS</Text>
          <View style={[styles.formCard, { backgroundColor: colors.surface }]}>
            <TouchableOpacity style={styles.socialRow}>
              <View style={styles.socialLeft}>
                <MaterialCommunityIcons name="google" size={24} color="#DB4437" />
                <View style={styles.socialInfo}>
                  <Text style={[styles.socialTitle, { color: colors.onSurface }]}>Google</Text>
                  <Text style={[styles.socialStatus, { color: googleLinked ? colors.primary : colors.outline }]}>
                    {googleLinked ? 'Connected' : 'Not connected'}
                  </Text>
                </View>
              </View>
              {googleLinked ? (
                <Feather name="check-circle" size={20} color={colors.primary} />
              ) : (
                <Text style={[styles.connectLink, { color: colors.primary }]}>Connect</Text>
              )}
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.outlineVariant }]} />

            <TouchableOpacity style={styles.socialRow}>
              <View style={styles.socialLeft}>
                <MaterialCommunityIcons name="apple" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
                <View style={styles.socialInfo}>
                  <Text style={[styles.socialTitle, { color: colors.onSurface }]}>Apple</Text>
                  <Text style={[styles.socialStatus, { color: appleLinked ? colors.primary : colors.outline }]}>
                    {appleLinked ? 'Connected' : 'Not connected'}
                  </Text>
                </View>
              </View>
              {appleLinked ? (
                <Feather name="check-circle" size={20} color={colors.primary} />
              ) : (
                <Text style={[styles.connectLink, { color: colors.primary }]}>Connect</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Save Button */}
          <TouchableOpacity 
            style={[styles.saveButton, { backgroundColor: colors.primary }, isSaving && { opacity: 0.6 }]} 
            onPress={handleSave} 
            disabled={isSaving}
            activeOpacity={0.7}
          >
            <Text style={[styles.saveButtonText, { color: colors.onPrimary }]}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteAccountBtn}>
            <Text style={[styles.deleteAccountText, { color: colors.error }]}>Delete Account</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 60,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fonts.primary,
  },
  saveText: {
    fontSize: 16,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fonts.primary,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  changePhotoText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.typography.fonts.primary,
  },
  formCard: {
    borderRadius: theme.radius.lg,
    padding: 20,
    ...theme.shadows.soft,
    marginBottom: 32,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: theme.typography.weights.bold,
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
    fontFamily: theme.typography.fonts.primary,
  },
  inputGroup: {
    marginVertical: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: theme.typography.weights.bold,
    letterSpacing: 0.5,
    marginBottom: 8,
    fontFamily: theme.typography.fonts.primary,
  },
  input: {
    fontSize: 16,
    fontFamily: theme.typography.fonts.primary,
    paddingVertical: 8,
  },
  disabledInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  disabledInput: {
    flex: 1,
  },
  helperText: {
    fontSize: 11,
    fontFamily: theme.typography.fonts.primary,
    marginTop: 4,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  socialLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialInfo: {
    marginLeft: 16,
  },
  socialTitle: {
    fontSize: 16,
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.typography.fonts.primary,
  },
  socialStatus: {
    fontSize: 12,
    fontFamily: theme.typography.fonts.primary,
  },
  connectLink: {
    fontSize: 14,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fonts.primary,
  },
  saveButton: {
    borderRadius: theme.radius.lg,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    ...theme.shadows.medium,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fonts.primary,
  },
  deleteAccountBtn: {
    alignItems: 'center',
    padding: 16,
  },
  deleteAccountText: {
    fontSize: 14,
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.typography.fonts.primary,
    textDecorationLine: 'underline',
  },
});

export default EditProfileScreen;
