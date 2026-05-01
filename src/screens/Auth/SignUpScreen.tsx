import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '@/navigation/types';
import { theme } from '@/theme';
import { showMessage } from 'react-native-flash-message';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import * as userService from '@/services/userService';

const SignUpScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();

  const [displayName, setDisplayName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSignUpPress = async () => {
    if (!emailAddress || !password) return;
    if (password !== confirmPassword) {
      showMessage({
        message: 'Passwords do not match',
        description: 'Please make sure your passwords match.',
        type: 'danger',
      });
      return;
    }
    setLoading(true);
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(emailAddress, password);
      if (userCredential.user) {
        await userService.createUserProfile(userCredential.user.uid, {
          displayName: displayName || emailAddress.split('@')[0],
          email: emailAddress,
          avatarUrl: `https://i.pravatar.cc/150?u=${userCredential.user.uid}`,
        });
      }
    } catch (err: any) {
      console.error(err);
      showMessage({
        message: 'Sign Up Failed',
        description: err.message,
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Background Gradient */}
      <View style={StyleSheet.absoluteFill}>
        <Svg height="100%" width="100%">
          <Defs>
            <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#E9F2E3" stopOpacity="1" />
              <Stop offset="50%" stopColor="#F1EFEA" stopOpacity="1" />
              <Stop offset="100%" stopColor="#E2D6D3" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#grad)" />
        </Svg>
      </View>

      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoSquare}>
              <MaterialCommunityIcons name="leaf" size={24} color="#FFF" />
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Start your journey towards{'\n'}mindful productivity.
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            <View style={[StyleSheet.absoluteFill, { borderRadius: 32, overflow: 'hidden' }]}>
              <Svg height="100%" width="100%">
                <Defs>
                  <LinearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <Stop offset="0%" stopColor="rgba(255, 255, 255, 0.8)" stopOpacity="1" />
                    <Stop offset="100%" stopColor="rgba(241, 239, 234, 0.6)" stopOpacity="1" />
                  </LinearGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#cardGrad)" />
              </Svg>
            </View>

            <View style={{ position: 'relative', zIndex: 1 }}>
              <Text style={styles.inputLabel}>Display name</Text>
              <View style={styles.inputContainer}>
                <Feather name="user" size={18} color={theme.colors.outline} style={styles.inputIcon} />
                <TextInput
                  value={displayName}
                  placeholder="Your Name"
                  placeholderTextColor={theme.colors.outline}
                  onChangeText={setDisplayName}
                  style={styles.input}
                />
              </View>

              <Text style={styles.inputLabel}>Email address</Text>
              <View style={styles.inputContainer}>
                <Feather name="mail" size={18} color={theme.colors.outline} style={styles.inputIcon} />
                <TextInput
                  autoCapitalize="none"
                  value={emailAddress}
                  placeholder="name@example.com"
                  placeholderTextColor={theme.colors.outline}
                  onChangeText={setEmailAddress}
                  style={styles.input}
                  keyboardType="email-address"
                  autoComplete="email"
                />
              </View>

              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputContainer}>
                <Feather name="lock" size={18} color={theme.colors.outline} style={styles.inputIcon} />
                <TextInput
                  value={password}
                  placeholder="••••••••"
                  placeholderTextColor={theme.colors.outline}
                  secureTextEntry={!showPassword}
                  onChangeText={setPassword}
                  style={styles.input}
                  autoComplete="new-password"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Feather name={showPassword ? "eye-off" : "eye"} size={18} color={theme.colors.outline} />
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={styles.inputContainer}>
                <Feather name="shield" size={18} color={theme.colors.outline} style={styles.inputIcon} />
                <TextInput
                  value={confirmPassword}
                  placeholder="••••••••"
                  placeholderTextColor={theme.colors.outline}
                  secureTextEntry={!showConfirmPassword}
                  onChangeText={setConfirmPassword}
                  style={styles.input}
                  autoComplete="new-password"
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Feather name={showConfirmPassword ? "eye-off" : "eye"} size={18} color={theme.colors.outline} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.signUpButton, loading && styles.buttonDisabled]}
                onPress={onSignUpPress}
                disabled={loading}
              >
                <Text style={styles.signUpButtonText}>
                  {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer Link */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.signInText}>
                Already have an account? <Text style={styles.signInUnderline}>Sign in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1EFEA',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.containerPadding,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  
  // Header
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoSquare: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    ...theme.shadows.soft,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: theme.colors.onSurface,
    fontFamily: theme.typography.fonts.display,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.typography.fonts.display,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Card
  card: {
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    ...theme.shadows.soft,
    marginBottom: 32,
    overflow: 'hidden',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.onSurface,
    fontFamily: theme.typography.fonts.primary,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontFamily: theme.typography.fonts.primary,
    fontSize: 15,
    color: theme.colors.onSurface,
  },
  signUpButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    fontFamily: theme.typography.fonts.primary,
  },
  buttonDisabled: {
    opacity: 0.6,
  },

  // Footer
  footer: {
    alignItems: 'center',
  },
  signInText: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 15,
    fontFamily: theme.typography.fonts.primary,
  },
  signInUnderline: {
    color: theme.colors.primary,
    fontWeight: '500',
  },
});

export default SignUpScreen;
