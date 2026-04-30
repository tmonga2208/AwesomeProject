import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SocialStackParamList } from '@/navigation/SocialStack';
import FriendCard from '@/components/FriendCard/FriendCard';
import { theme } from '@/theme';
import Feather from 'react-native-vector-icons/Feather';
import { useStore } from '@/store';

type NavigationProp = NativeStackNavigationProp<SocialStackParamList, 'Leaderboard'>;

const LeaderboardScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { friendProfiles, isLoadingSocial } = useStore();

  // Sort friends by completion percentage (streak as proxy for now)
  const sortedFriends = [...friendProfiles]
    .sort((a, b) => (b.streak || 0) - (a.streak || 0))
    .map((p) => ({
      id: p.uid,
      username: p.displayName || p.email,
      avatarUrl: p.avatarUrl || `https://i.pravatar.cc/150?u=${p.uid}`,
      completionPercentage: Math.min(100, (p.streak || 0) * 10), // Approximate
      streak: p.streak || 0,
    }));

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
        <Text style={styles.title}>Leaderboard</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddFriend')}
        >
          <Feather name="user-plus" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedFriends}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Feather name="users" size={48} color={theme.colors.outline} />
            <Text style={styles.emptyTitle}>No friends yet</Text>
            <Text style={styles.emptyText}>
              Add friends to see how you stack up against each other!
            </Text>
            <TouchableOpacity
              style={styles.addFriendBtn}
              onPress={() => navigation.navigate('AddFriend')}
            >
              <Text style={styles.addFriendBtnText}>Add Friends</Text>
            </TouchableOpacity>
          </View>
        )}
        renderItem={({ item, index }) => (
          <FriendCard friend={item} rank={index + 1} />
        )}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.containerPadding,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
  },
  title: {
    fontFamily: theme.typography.fonts.primary,
    fontSize: theme.typography.sizes.h2,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.onBackground,
  },
  addButton: {
    padding: theme.spacing.sm,
  },
  listContent: {
    paddingHorizontal: theme.spacing.containerPadding,
    paddingTop: theme.spacing.md,
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontFamily: theme.typography.fonts.primary,
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.onSurface,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: theme.typography.fonts.primary,
    fontSize: theme.typography.sizes.bodySm,
    color: theme.colors.outline,
    textAlign: 'center',
    marginBottom: 24,
  },
  addFriendBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: theme.radius.md,
  },
  addFriendBtnText: {
    fontFamily: theme.typography.fonts.primary,
    fontSize: theme.typography.sizes.bodyMd,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.onPrimary,
  },
});

export default LeaderboardScreen;
