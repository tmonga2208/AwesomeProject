import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import OnboardingScreen from '@/screens/Onboarding/OnboardingScreen';
import SignInScreen from '@/screens/Auth/SignInScreen';
import SignUpScreen from '@/screens/Auth/SignUpScreen';
import WelcomeScreen from '@/screens/Auth/WelcomeScreen';
import { storage, STORAGE_KEYS } from '../services/storage';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  const onboardingDone = storage.getBoolean(STORAGE_KEYS.ONBOARDING_DONE);

  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }}
      initialRouteName={onboardingDone ? 'Welcome' : 'Onboarding'}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;

