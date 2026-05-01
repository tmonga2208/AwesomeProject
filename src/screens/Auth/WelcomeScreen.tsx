import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '@/navigation/types';
import { theme } from '@/theme';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

const WelcomeScreen = () => {
  const navigation = useNavigation<AuthNavigationProp>();

  return (
    <View style={styles.container}>
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

      <SafeAreaView style={[styles.safeArea, { backgroundColor: 'transparent' }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>E</Text>
          </View>
          <Text style={styles.brandName}>Ethos</Text>
          <Text style={styles.tagline}>
            Transform your daily habits into{'\n'}a serene ritual of progress.
          </Text>
        </View>

        {/* Action Card */}
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
            <TouchableOpacity style={[styles.button, styles.appleButton]}>
              <Ionicons name="logo-apple" size={18} color="#FFF" style={styles.buttonIcon} />
              <Text style={[styles.buttonText, { color: '#FFF' }]}>Continue with Apple</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.googleButton]}>
              <Ionicons name="logo-google" size={18} color="#000" style={styles.buttonIcon} />
              <Text style={[styles.buttonText, { color: '#000' }]}>Continue with Google</Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity 
              style={[styles.button, styles.emailButton]}
              onPress={() => navigation.navigate('SignIn')}
            >
              <Feather name="mail" size={18} color="#FFF" style={styles.buttonIcon} />
              <Text style={[styles.buttonText, { color: '#FFF' }]}>Sign in with email</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.createAccountLink}
              onPress={() => navigation.navigate('SignUp')}
            >
              <Text style={styles.createAccountText}>
                New to Ethos? <Text style={styles.createAccountUnderline}>Create account</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLinks}>
            <Text style={styles.footerText}>PRIVACY POLICY</Text>
            <Text style={styles.footerText}>TERMS OF SERVICE</Text>
          </View>
          <Text style={styles.copyrightText}>© 2024 ETHOS WELLNESS & PRODUCTIVITY</Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1EFEA',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.containerPadding,
    paddingVertical: 20,
  },
  
  // Header
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    ...theme.shadows.soft,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#073620',
    fontFamily: theme.typography.fonts.display,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '600',
    color: '#073620',
    fontFamily: theme.typography.fonts.display,
    marginBottom: 16,
  },
  tagline: {
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
    marginBottom: 20,
    overflow: 'hidden',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  appleButton: {
    backgroundColor: '#1C1C1C',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  emailButton: {
    backgroundColor: '#6A7D64',
    marginBottom: 24,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: theme.typography.fonts.primary,
  },
  
  // Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    color: theme.colors.outline,
    fontFamily: theme.typography.fonts.primary,
  },

  // Links
  createAccountLink: {
    alignItems: 'center',
  },
  createAccountText: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 15,
    fontFamily: theme.typography.fonts.primary,
  },
  createAccountUnderline: {
    color: '#6A7D64',
    textDecorationLine: 'underline',
  },

  // Footer
  footer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  footerLinks: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 12,
  },
  footerText: {
    fontSize: 11,
    color: theme.colors.outline,
    letterSpacing: 0.5,
    fontFamily: theme.typography.fonts.primary,
  },
  copyrightText: {
    fontSize: 10,
    color: 'rgba(0, 0, 0, 0.3)',
    letterSpacing: 0.5,
    fontFamily: theme.typography.fonts.primary,
  },
});

export default WelcomeScreen;
