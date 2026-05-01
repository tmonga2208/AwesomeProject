import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import HabitsStack from './HabitsStack';
import { theme } from '@/theme';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import InsightsScreen from '@/screens/Insights/InsightsScreen';
import SocialStack from './SocialStack';
import SettingsStack from './SettingsStack';

const Tab = createBottomTabNavigator<MainTabParamList>();

const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconName = '';
        let IconComponent: any = Feather;
        
        switch (route.name) {
          case 'Today':
            iconName = 'tv';
            break;
          case 'Insights':
            iconName = 'bar-chart-2';
            break;
          case 'Social':
            iconName = 'account-group-outline';
            IconComponent = MaterialCommunityIcons;
            break;
          case 'Settings':
            iconName = 'settings';
            break;
        }

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={(options as any).tabBarTestID}
            onPress={onPress}
            style={styles.tabItem}
            activeOpacity={0.8}
          >
            <View style={[styles.tabContent, isFocused && styles.tabContentActive]}>
              <IconComponent 
                name={iconName} 
                size={20} 
                color={isFocused ? theme.colors.primary : theme.colors.outline} 
              />
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                {route.name.toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Today" component={HabitsStack} />
      <Tab.Screen name="Insights" component={InsightsScreen} />
      <Tab.Screen name="Social" component={SocialStack} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    paddingBottom: Platform.OS === 'ios' ? 32 : 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.03)',
    ...theme.shadows.glass,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: theme.radius.full,
    gap: 4,
  },
  tabContentActive: {
    backgroundColor: theme.colors.primaryContainer,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.fonts.primary,
    color: theme.colors.outline,
    letterSpacing: 0.5,
  },
  tabLabelActive: {
    color: theme.colors.onPrimaryContainer,
  },
});

export default MainTabs;
