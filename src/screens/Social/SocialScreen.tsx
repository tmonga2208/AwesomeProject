import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SocialStackParamList } from '@/navigation/SocialStack';
import FastImage from 'react-native-fast-image';
import Feather from 'react-native-vector-icons/Feather';
import { theme, useTheme } from '@/theme';
import { useStore } from '@/store';
import { useAuthStore } from '@/store/authStore';
import * as userService from '@/services/userService';
import { UserProfile } from '@/types/user';

type NavigationProp = NativeStackNavigationProp<SocialStackParamList, 'Social'>;

const SocialScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuthStore();
  const {
    friendRequests,
    feed,
    friendProfiles,
    isLoadingSocial,
    acceptFriendRequest,
    rejectFriendRequest,
  } = useStore();

  // Get profile info for friend requests
  const [requestProfiles, setRequestProfiles] = React.useState<Record<string, UserProfile>>({});

  React.useEffect(() => {
    const fetchRequestProfiles = async () => {
      const profiles: Record<string, UserProfile> = {};
      for (const req of friendRequests) {
        const otherUid = req.users.find((u) => u !== user?.uid);
        if (otherUid && !profiles[otherUid]) {
          const p = await userService.getUserProfile(otherUid);
          if (p) profiles[otherUid] = p;
        }
      }
      setRequestProfiles(profiles);
    };
    if (friendRequests.length > 0) fetchRequestProfiles();
  }, [friendRequests, user?.uid]);

  const avatarUrl = friendProfiles.length > 0 ? user?.photoURL : 'https://i.pravatar.cc/150?u=me';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Feather name="wind" size={24} color={colors.primary} />
        <Text style={[styles.headerTitle, { color: colors.primary }]}>Ethos</Text>
        <FastImage
          source={{ uri: user?.photoURL || 'https://i.pravatar.cc/150?u=me' }}
          style={styles.headerAvatar}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Search */}
        <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
          <Feather name="search" size={20} color={colors.outline} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.onSurface }]}
            placeholder="Find friends..."
            placeholderTextColor={colors.outline}
          />
        </View>

        {/* Global Leaderboard Button */}
        <TouchableOpacity 
          style={[styles.leaderboardBtn, { backgroundColor: colors.surfaceVariant, borderColor: colors.outlineVariant }]}
          onPress={() => navigation.navigate('Leaderboard')}
        >
          <View style={[styles.leaderboardIconContainer, { backgroundColor: colors.primaryContainer }]}>
            <Feather name="award" size={20} color={colors.primary} />
          </View>
          <Text style={[styles.leaderboardText, { color: colors.onSurface }]}>Global Leaderboard</Text>
          <Feather name="chevron-right" size={20} color={colors.outline} />
        </TouchableOpacity>

        {/* Friend Requests */}
        {friendRequests.length > 0 && (
          <>
            <Text style={[styles.sectionHeader, { color: colors.outline }]}>FRIEND REQUESTS</Text>
            {friendRequests.map((req) => {
              const otherUid = req.users.find((u) => u !== user?.uid) || '';
              const profile = requestProfiles[otherUid];
              return (
                <View key={req.id} style={[styles.requestCard, { backgroundColor: colors.surface }]}>
                  <FastImage
                    source={{ uri: profile?.avatarUrl || `https://i.pravatar.cc/150?u=${otherUid}` }}
                    style={styles.avatarLarge}
                  />
                  <View style={styles.requestInfo}>
                    <Text style={[styles.requestName, { color: colors.onSurface }]}>{profile?.displayName || 'Unknown'}</Text>
                    <Text style={[styles.requestMutual, { color: colors.outline }]}>Wants to connect</Text>
                  </View>
                  <View style={styles.requestActions}>
                    <TouchableOpacity
                      style={[styles.rejectBtn, { backgroundColor: colors.surfaceVariant }]}
                      onPress={() => rejectFriendRequest(req.id)}
                    >
                      <Feather name="x" size={20} color={colors.onSurface} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.acceptBtn, { backgroundColor: colors.primary }]}
                      onPress={() => acceptFriendRequest(req.id)}
                    >
                      <Feather name="check" size={20} color={colors.onPrimary} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </>
        )}

        {/* Ritual Circles / Feed */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionHeader, { color: colors.outline }]}>RITUAL CIRCLES</Text>
          <TouchableOpacity>
            <Text style={[styles.filterText, { color: colors.primary }]}>Filter</Text>
          </TouchableOpacity>
        </View>

        {feed.length > 0 ? (
          feed.map((item) => (
            <View key={item.id} style={[styles.feedCard, { backgroundColor: colors.surface }]}>
              <View style={styles.feedHeader}>
                <FastImage
                  source={{ uri: item.fromAvatar || `https://i.pravatar.cc/150?u=${item.fromUid}` }}
                  style={styles.avatarMedium}
                />
                <View style={styles.feedUserInfo}>
                  <Text style={[styles.feedName, { color: colors.onSurface }]}>{item.fromName}</Text>
                  <View style={styles.streakBadge}>
                    <Feather name="zap" size={12} color={colors.primary} />
                    <Text style={[styles.streakText, { color: colors.primary }]}>{item.streak} Day Streak</Text>
                  </View>
                </View>
                <Text style={[styles.timeAgo, { color: colors.outline }]}>
                  {getTimeAgo(item.timestamp)}
                </Text>
              </View>
              <View style={[styles.activityBox, { backgroundColor: colors.surfaceVariant }]}>
                <View style={[styles.activityIconWrapper, { backgroundColor: colors.primaryContainer }]}>
                  <Feather name={item.habitIcon || 'check-circle'} size={16} color={colors.primary} />
                </View>
                <View>
                  <Text style={[styles.activityLabel, { color: colors.outline }]}>JUST FINISHED</Text>
                  <Text style={[styles.activityName, { color: colors.onSurface }]}>{item.habitName}</Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={[styles.feedCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.activityBox, { backgroundColor: colors.surfaceVariant }]}>
              <View style={[styles.activityIconWrapper, { backgroundColor: colors.primaryContainer }]}>
                <Feather name="users" size={16} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.activityLabel, { color: colors.outline }]}>NO ACTIVITY YET</Text>
                <Text style={[styles.activityName, { color: colors.onSurface }]}>Add friends to see their rituals!</Text>
              </View>
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

const getTimeAgo = (timestamp: number): string => {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.containerPadding,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fonts.primary,
    letterSpacing: 1,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  scrollContent: {
    padding: theme.spacing.containerPadding,
    paddingBottom: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    ...theme.shadows.soft,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.sizes.bodyMd,
    fontFamily: theme.typography.fonts.primary,
  },
  leaderboardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radius.md,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
  },
  leaderboardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.default,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  leaderboardText: {
    flex: 1,
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fonts.primary,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 16,
  },
  sectionHeader: {
    fontSize: theme.typography.sizes.labelCaps,
    fontWeight: theme.typography.weights.bold,
    letterSpacing: theme.typography.letterSpacings.labelCaps,
    fontFamily: theme.typography.fonts.primary,
    marginBottom: 12,
  },
  filterText: {
    fontSize: theme.typography.sizes.bodySm,
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.typography.fonts.primary,
  },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radius.lg,
    padding: 16,
    marginBottom: 24,
    ...theme.shadows.soft,
  },
  avatarLarge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  requestInfo: {
    flex: 1,
  },
  requestName: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.typography.fonts.primary,
    marginBottom: 4,
  },
  requestMutual: {
    fontSize: theme.typography.sizes.caption,
    fontFamily: theme.typography.fonts.primary,
  },
  requestActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rejectBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedCard: {
    borderRadius: theme.radius.lg,
    padding: 20,
    marginBottom: 16,
    ...theme.shadows.soft,
  },
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarMedium: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  feedUserInfo: {
    flex: 1,
  },
  feedName: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.typography.fonts.primary,
    marginBottom: 4,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    fontSize: theme.typography.sizes.caption,
    fontFamily: theme.typography.fonts.primary,
    marginLeft: 4,
  },
  timeAgo: {
    fontSize: theme.typography.sizes.caption,
    fontFamily: theme.typography.fonts.primary,
  },
  activityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radius.md,
    padding: 16,
  },
  activityIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityLabel: {
    fontSize: 10,
    fontWeight: theme.typography.weights.bold,
    letterSpacing: theme.typography.letterSpacings.labelCaps,
    fontFamily: theme.typography.fonts.primary,
    marginBottom: 2,
  },
  activityName: {
    fontSize: theme.typography.sizes.bodySm,
    fontFamily: theme.typography.fonts.primary,
  },
});

export default SocialScreen;
