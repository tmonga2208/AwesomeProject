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
import { theme } from '@/theme';
import { useStore } from '@/store';
import { useAuthStore } from '@/store/authStore';
import auth from '@react-native-firebase/auth';
import * as userService from '@/services/userService';

const EditProfileScreen = () => {
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={theme.colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity onPress={handleSave} disabled={isSaving}>
            <Text style={[styles.saveText, isSaving && { opacity: 0.5 }]}>
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
              <FastImage source={{ uri: avatarUrl }} style={styles.avatar} />
              <TouchableOpacity style={styles.editAvatarBadge}>
                <Feather name="camera" size={16} color={theme.colors.onPrimary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.changePhotoText}>Change Profile Photo</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>FULL NAME</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Your Name"
                placeholderTextColor={theme.colors.outline}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <View style={styles.disabledInputContainer}>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value={user?.email || ''}
                  editable={false}
                  selectTextOnFocus={false}
                />
                <Feather name="lock" size={16} color={theme.colors.outline} />
              </View>
              <Text style={styles.helperText}>Email cannot be changed manually.</Text>
            </View>
          </View>

          {/* Connected Accounts Section */}
          <Text style={styles.sectionHeader}>CONNECTED ACCOUNTS</Text>
          <View style={styles.formCard}>
            <TouchableOpacity style={styles.socialRow}>
              <View style={styles.socialLeft}>
                <MaterialCommunityIcons name="google" size={24} color="#DB4437" />
                <View style={styles.socialInfo}>
                  <Text style={styles.socialTitle}>Google</Text>
                  <Text style={[styles.socialStatus, !googleLinked && { color: theme.colors.outline }]}>
                    {googleLinked ? 'Connected' : 'Not connected'}
                  </Text>
                </View>
              </View>
              {googleLinked ? (
                <Feather name="check-circle" size={20} color={theme.colors.primary} />
              ) : (
                <Text style={styles.connectLink}>Connect</Text>
              )}
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.socialRow}>
              <View style={styles.socialLeft}>
                <MaterialCommunityIcons name="apple" size={24} color="#000000" />
                <View style={styles.socialInfo}>
                  <Text style={styles.socialTitle}>Apple</Text>
                  <Text style={[styles.socialStatus, !appleLinked && { color: theme.colors.outline }]}>
                    {appleLinked ? 'Connected' : 'Not connected'}
                  </Text>
                </View>
              </View>
              {appleLinked ? (
                <Feather name="check-circle" size={20} color={theme.colors.primary} />
              ) : (
                <Text style={styles.connectLink}>Connect</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Save Button */}
          <TouchableOpacity 
            style={[styles.saveButton, isSaving && { opacity: 0.6 }]} 
            onPress={handleSave} 
            disabled={isSaving}
            activeOpacity={0.7}
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteAccountBtn}>
            <Text style={styles.deleteAccountText}>Delete Account</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.onSurface,
    fontFamily: theme.typography.fonts.primary,
  },
  saveText: {
    fontSize: 16,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.primary,
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
    backgroundColor: theme.colors.surfaceVariant,
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.colors.background,
  },
  changePhotoText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.primary,
    fontFamily: theme.typography.fonts.primary,
  },
  formCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: 20,
    ...theme.shadows.soft,
    marginBottom: 32,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.onSurfaceVariant,
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
    color: theme.colors.outline,
    letterSpacing: 0.5,
    marginBottom: 8,
    fontFamily: theme.typography.fonts.primary,
  },
  input: {
    fontSize: 16,
    color: theme.colors.onSurface,
    fontFamily: theme.typography.fonts.primary,
    paddingVertical: 8,
  },
  disabledInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  disabledInput: {
    color: theme.colors.outline,
    flex: 1,
  },
  helperText: {
    fontSize: 11,
    color: theme.colors.outline,
    fontFamily: theme.typography.fonts.primary,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.outlineVariant,
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
    color: theme.colors.onSurface,
    fontFamily: theme.typography.fonts.primary,
  },
  socialStatus: {
    fontSize: 12,
    color: theme.colors.primary,
    fontFamily: theme.typography.fonts.primary,
  },
  connectLink: {
    fontSize: 14,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.primary,
    fontFamily: theme.typography.fonts.primary,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    ...theme.shadows.medium,
  },
  saveButtonText: {
    color: theme.colors.onPrimary,
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
    color: theme.colors.error,
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.typography.fonts.primary,
    textDecorationLine: 'underline',
  },
});

export default EditProfileScreen;
