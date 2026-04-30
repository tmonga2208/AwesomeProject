import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SocialScreen from '@/screens/Social/SocialScreen';
import LeaderboardScreen from '@/screens/Social/LeaderboardScreen';
import AddFriendScreen from '@/screens/Social/AddFriendScreen';
import ChallengesScreen from '@/screens/Social/ChallengesScreen';

export type SocialStackParamList = {
  Social: undefined;
  Leaderboard: undefined;
  AddFriend: undefined;
  Challenges: { habitId?: string };
};

const Stack = createNativeStackNavigator<SocialStackParamList>();

const SocialStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Social">
      <Stack.Screen name="Social" component={SocialScreen} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Stack.Screen name="AddFriend" component={AddFriendScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Challenges" component={ChallengesScreen} />
    </Stack.Navigator>
  );
};

export default SocialStack;
