import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '@/theme';
import Feather from 'react-native-vector-icons/Feather';
import FastImage from 'react-native-fast-image';
import { useStore } from '@/store';
import { useAuthStore } from '@/store/authStore';

const ChallengesScreen = () => {
  const navigation = useNavigation();
  const { challenges, isLoadingSocial } = useStore();
  const { user } = useAuthStore();

  if (isLoadingSocial) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.title}>Challenges</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {challenges.length > 0 ? (
          challenges.map((challenge) => (
            <View key={challenge.id} style={styles.activeChallengeCard}>
              <View style={styles.challengeHeader}>
                <Text style={styles.challengeTitle}>{challenge.title}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{challenge.isActive ? 'Active' : 'Ended'}</Text>
                </View>
              </View>
              
              <Text style={styles.challengeDesc}>
                {challenge.description}
              </Text>

              <View style={styles.participantsContainer}>
                {challenge.participants.map((pUid, idx) => (
                  <View key={pUid} style={[styles.participant, { zIndex: 10 - idx }]}>
                    <FastImage 
                      source={{ uri: `https://i.pravatar.cc/150?u=${pUid}` }} 
                      style={styles.avatar} 
                    />
                  </View>
                ))}
              </View>

              <View style={styles.streakFooter}>
                <Text style={styles.streakText}>
                  Shared Streak: <Text style={{fontWeight: '700'}}>{challenge.sharedStreak} Days</Text>
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Feather name="award" size={64} color={theme.colors.outline} />
            <Text style={styles.emptyTitle}>No Active Challenges</Text>
            <Text style={styles.emptyText}>
              Challenges are better together. Start one with your friends!
            </Text>
          </View>
        )}

        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => {
            // navigation.navigate('CreateChallenge'); // To be implemented if needed
            Alert.alert('Coming Soon', 'Challenge creation will be available in the next update!');
          }}
        >
          <Feather name="plus" size={20} color={theme.colors.onPrimary} />
          <Text style={styles.createButtonText}>Start New Challenge</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

// Import Alert from react-native
import { Alert } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.containerPadding,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.onSurface,
    fontFamily: theme.typography.fonts.primary,
  },
  content: {
    padding: theme.spacing.containerPadding,
    flexGrow: 1,
  },
  activeChallengeCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    marginBottom: 24,
    ...theme.shadows.soft,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeTitle: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.onSurface,
    fontFamily: theme.typography.fonts.primary,
  },
  statusBadge: {
    backgroundColor: theme.colors.primaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.primary,
  },
  challengeDesc: {
    fontSize: theme.typography.sizes.bodySm,
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.typography.fonts.primary,
    marginBottom: 20,
    lineHeight: theme.typography.lineHeights.bodySm,
  },
  participantsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    height: 48,
  },
  participant: {
    marginRight: -12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  streakFooter: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.outlineVariant,
    paddingTop: 16,
    alignItems: 'center',
  },
  streakText: {
    fontSize: theme.typography.sizes.bodySm,
    color: theme.colors.onSurface,
    fontFamily: theme.typography.fonts.primary,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: theme.radius.md,
    marginTop: 'auto',
    marginBottom: 20,
  },
  createButtonText: {
    color: theme.colors.onPrimary,
    fontSize: theme.typography.sizes.bodyMd,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fonts.primary,
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingBottom: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onSurface,
    fontFamily: theme.typography.fonts.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.outline,
    fontFamily: theme.typography.fonts.primary,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default ChallengesScreen;
