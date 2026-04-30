import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '@/theme';
import Feather from 'react-native-vector-icons/Feather';
import FriendCard from '@/components/FriendCard/FriendCard';
import * as userService from '@/services/userService';
import { useStore } from '@/store';
import { useAuthStore } from '@/store/authStore';
import { UserProfile } from '@/types/user';

const AddFriendScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { sendFriendRequest, friends, friendRequests } = useStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setIsLoading(true);
        try {
          const results = await userService.searchUsers(searchQuery);
          // Filter out current user and existing friends
          setSearchResults(results.filter(r => r.uid !== user?.uid));
        } catch (error) {
          console.error('[AddFriend] search error:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, user?.uid]);

  const handleAddFriend = async (otherUser: UserProfile) => {
    if (!user?.uid) return;
    
    // Check if already friends or request pending
    const isAlreadyFriend = friends.some(f => f.users.includes(otherUser.uid));
    const isPending = friendRequests.some(r => r.users.includes(otherUser.uid));
    
    if (isAlreadyFriend) {
      Alert.alert('Already Friends', `You are already friends with ${otherUser.displayName}.`);
      return;
    }
    
    if (isPending) {
      Alert.alert('Request Pending', `A friend request to ${otherUser.displayName} is already pending.`);
      return;
    }

    try {
      await sendFriendRequest(user.uid, otherUser.uid);
      Alert.alert('Success', `Friend request sent to ${otherUser.displayName}!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to send friend request.');
      console.error('[AddFriend] send error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add Friend</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color={theme.colors.outline} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search username..."
          placeholderTextColor={theme.colors.outline}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {(searchQuery.length > 0 || isLoading) && (
          <TouchableOpacity onPress={() => setSearchQuery('')} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <Feather name="x-circle" size={20} color={theme.colors.outline} />
            )}
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.qrContainer}>
        <TouchableOpacity style={styles.qrButton}>
          <Feather name="maximize" size={20} color={theme.colors.primary} />
          <Text style={styles.qrText}>Scan QR Code</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.uid}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery.length > 2 
                ? (isLoading ? 'Searching...' : 'No users found') 
                : 'Search for friends by their display name'}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            <View style={{ flex: 1 }}>
              <FriendCard friend={{
                id: item.uid,
                username: item.displayName,
                avatarUrl: item.avatarUrl || `https://i.pravatar.cc/150?u=${item.uid}`,
                completionPercentage: 0, // Not applicable here
                streak: item.streak || 0,
              }} />
            </View>
            <TouchableOpacity 
              style={styles.addBtn}
              onPress={() => handleAddFriend(item)}
            >
              <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>
          </View>
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
  backButton: {
    padding: theme.spacing.sm,
  },
  cancelText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontFamily: theme.typography.fonts.primary,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onBackground,
    fontFamily: theme.typography.fonts.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    marginHorizontal: theme.spacing.containerPadding,
    marginTop: theme.spacing.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: theme.typography.fonts.primary,
    color: theme.colors.onSurface,
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(125, 146, 125, 0.1)', // theme.colors.primary with opacity
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  qrText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
    fontFamily: theme.typography.fonts.primary,
  },
  listContent: {
    paddingHorizontal: theme.spacing.containerPadding,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.outline,
    fontFamily: theme.typography.fonts.primary,
    textAlign: 'center',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 12,
  },
  addBtnText: {
    color: theme.colors.onPrimary,
    fontWeight: '600',
    fontFamily: theme.typography.fonts.primary,
  },
});

export default AddFriendScreen;
