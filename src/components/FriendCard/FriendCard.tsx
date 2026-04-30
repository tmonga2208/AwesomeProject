import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { theme } from '@/theme';
import Feather from 'react-native-vector-icons/Feather';
import Svg, { Circle } from 'react-native-svg';

interface FriendCardProps {
  friend: {
    id: string;
    username: string;
    avatarUrl: string;
    completionPercentage: number;
    streak: number;
  };
  onPress?: () => void;
  rank?: number;
}

const FriendCard: React.FC<FriendCardProps> = ({ friend, onPress, rank }) => {
  const radius = 24;
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (friend.completionPercentage / 100) * circumference;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.rankContainer}>
        {rank ? (
          <Text style={[styles.rankText, rank <= 3 && styles.topRank]}>#{rank}</Text>
        ) : null}
      </View>
      
      <View style={styles.avatarContainer}>
        <Svg width={radius * 2 + strokeWidth * 2} height={radius * 2 + strokeWidth * 2} style={styles.ring}>
          <Circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke={theme.colors.outlineVariant}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke={theme.colors.primary}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            transform={`rotate(-90 ${radius + strokeWidth} ${radius + strokeWidth})`}
          />
        </Svg>
        <FastImage
          style={styles.avatar}
          source={{
            uri: friend.avatarUrl,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.username}>@{friend.username}</Text>
        <Text style={styles.stats}>
          {friend.completionPercentage}% weekly
        </Text>
      </View>

      <View style={styles.streakContainer}>
        <Feather name="zap" size={16} color="#F59E0B" />
        <Text style={styles.streakText}>{friend.streak}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
  rankContainer: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  rankText: {
    fontFamily: theme.typography.fonts.primary,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurfaceVariant,
  },
  topRank: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  avatarContainer: {
    position: 'relative',
    width: 54,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  ring: {
    position: 'absolute',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  infoContainer: {
    flex: 1,
  },
  username: {
    fontFamily: theme.typography.fonts.primary,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  stats: {
    fontFamily: theme.typography.fonts.primary,
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  streakText: {
    fontFamily: theme.typography.fonts.primary,
    fontSize: 14,
    fontWeight: '700',
    color: '#F59E0B',
    marginLeft: 4,
  },
});

export default FriendCard;
