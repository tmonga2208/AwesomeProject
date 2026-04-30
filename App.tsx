import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigator from './src/navigation/RootNavigator';
import { theme } from './src/theme';
import { useAuthStore } from './src/store/authStore';
import { useStore } from './src/store';

function App() {
  const { setUser, setLoading, user } = useAuthStore();
  const {
    subscribeHabits,
    unsubscribeHabits,
    subscribeCompletions,
    unsubscribeCompletions,
    subscribeProfile,
    unsubscribeProfile,
    subscribeSocial,
    unsubscribeSocial,
  } = useStore();

  // Auth state listener
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return subscriber;
  }, [setUser, setLoading]);

  // Data subscriptions — fire when user signs in, clean up on sign out
  useEffect(() => {
    if (user?.uid) {
      subscribeHabits(user.uid);
      subscribeCompletions(user.uid);
      subscribeProfile(user.uid);
      subscribeSocial(user.uid);
    } else {
      unsubscribeHabits();
      unsubscribeCompletions();
      unsubscribeProfile();
      unsubscribeSocial();
    }

    return () => {
      unsubscribeHabits();
      unsubscribeCompletions();
      unsubscribeProfile();
      unsubscribeSocial();
    };
  }, [user?.uid]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <StatusBar 
            barStyle="dark-content" 
            backgroundColor={theme.colors.background} 
          />
          <RootNavigator />
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
