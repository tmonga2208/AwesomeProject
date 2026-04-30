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
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

const SignInScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSignInPress = async () => {
    if (!emailAddress || !password) return;
    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(emailAddress, password);
    } catch (err: any) {
      console.error(err);
      showMessage({
        message: 'Sign In Failed',
        description: err.message,
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  const onGooglePress = async () => {
    console.log('Google Sign-In pressed');
  };

  const onApplePress = async () => {
    console.log('Apple Sign-In pressed');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoSquare}>
              <MaterialCommunityIcons name="leaf" size={24} color="#FFF" />
            </View>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>
              Continue your journey towards{'\n'}mindful productivity.
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
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

            <View style={styles.passwordHeader}>
              <Text style={styles.inputLabel}>Password</Text>
              <TouchableOpacity>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <Feather name="lock" size={18} color={theme.colors.outline} style={styles.inputIcon} />
              <TextInput
                value={password}
                placeholder="••••••••"
                placeholderTextColor={theme.colors.outline}
                secureTextEntry={!showPassword}
                onChangeText={setPassword}
                style={styles.input}
                autoComplete="password"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Feather name={showPassword ? "eye-off" : "eye"} size={18} color={theme.colors.outline} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.signInButton, loading && styles.buttonDisabled]}
              onPress={onSignInPress}
              disabled={loading}
            >
              <Text style={styles.signInButtonText}>
                {loading ? 'SIGNING IN...' : 'SIGN IN'}
              </Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={styles.socialButton} onPress={onGooglePress}>
                <Ionicons name="logo-google" size={16} color="#000" style={styles.socialIcon} />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.socialButton} onPress={onApplePress}>
                <Ionicons name="logo-apple" size={16} color="#000" style={styles.socialIcon} />
                <Text style={styles.socialButtonText}>Apple</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.signUpText}>
                Don't have an account? <Text style={styles.signUpUnderline}>Sign up for Ethos</Text>
              </Text>
            </TouchableOpacity>
            <View style={styles.secureContainer}>
              <Feather name="shield" size={12} color="rgba(0,0,0,0.3)" />
              <Text style={styles.secureText}>END-TO-END ENCRYPTED & SECURE</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontFamily: theme.typography.fonts.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.typography.fonts.primary,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Card
  card: {
    backgroundColor: 'rgba(245, 244, 240, 0.6)',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    ...theme.shadows.soft,
    marginBottom: 32,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
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
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotPassword: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary,
    fontFamily: theme.typography.fonts.primary,
    marginBottom: 8,
    marginRight: 4,
  },
  signInButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 24,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    fontFamily: theme.typography.fonts.primary,
  },
  buttonDisabled: {
    opacity: 0.6,
  },

  // Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: theme.colors.outline,
    fontFamily: theme.typography.fonts.primary,
  },

  // Social Buttons
  socialButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF9F6',
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  socialIcon: {
    marginRight: 8,
  },
  socialButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.onSurface,
    fontFamily: theme.typography.fonts.primary,
  },

  // Footer
  footer: {
    alignItems: 'center',
  },
  signUpText: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 15,
    fontFamily: theme.typography.fonts.primary,
    marginBottom: 24,
  },
  signUpUnderline: {
    color: theme.colors.primary,
    fontWeight: '500',
  },
  secureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  secureText: {
    fontSize: 10,
    color: 'rgba(0, 0, 0, 0.3)',
    letterSpacing: 0.5,
    fontWeight: '600',
    fontFamily: theme.typography.fonts.primary,
  },
});

export default SignInScreen;
