import React, { useRef } from 'react';
import { View, Text, Dimensions, Animated } from 'react-native'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import tw from 'twrnc'

import LinearGradient from 'react-native-linear-gradient'
import * as Solid from 'react-native-heroicons/solid'
import * as Outline from 'react-native-heroicons/outline'

import HomeScreen from './screens/HomeScreen';
import HistoryScreen from './screens/HistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import SortingScreen from './screens/SortingScreen';
import ProcessingScreen from './screens/ProcessingScreen';
import ManageAccountScreen from './screens/ManageAccountScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import OTPScreen from './screens/OTPScreen';
import PINScreen from './screens/PINScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import ReportScreen from './screens/ReportScreen';
import DetailSectorScreen from './screens/DetailSectorScreen';
import SplashScreen from './screens/SplashScreen';

const Stack = createNativeStackNavigator()
const Tabs  = createBottomTabNavigator()

function getWidth() {
  let width = Dimensions.get('window').width
  width = width - 30
  return width / 2
}

function HomeStack(): JSX.Element {
  return(
    <Stack.Navigator
      initialRouteName='Home'
    >
      <Stack.Screen name='Home' component={HomeScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

function ReportStack(): JSX.Element {
  return(
    <Stack.Navigator
      initialRouteName='Leaderboard'
    >
      <Stack.Screen name='Leaderboard' component={ReportScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

function ProfileStack(): JSX.Element {
  return(
    <Stack.Navigator
      initialRouteName='Profile'
    >
      <Stack.Screen name='Profile' component={ProfileScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

function BottomNav(): JSX.Element {
  const tabOffsetValue = useRef(new Animated.Value(0)).current;
  return(
    <>
      <Tabs.Navigator
        initialRouteName='HomeStack'
        screenOptions={{
          tabBarStyle: {
            height: 97,
            paddingHorizontal: 15,
          }
        }}
      >
        <Tabs.Screen
          name='HomeStack'
          component={HomeStack}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({focused}) => (
              <View style={tw`w-full h-full items-center justify-center`}>
                <View style={tw`w-20 rounded-xl py-4 items-center`}>
                  {
                    focused ?
                    <Solid.HomeIcon style={tw`text-green-600`} />
                    :
                    <Outline.HomeIcon style={tw`text-zinc-400`}/>
                  }
                  <Text style={tw`mt-1 text-xs ${focused ? "text-zinc-600 font-bold" : "text-zinc-400"} `}>Home</Text>
                </View>
              </View>
            )
          }} listeners={({navigation, route}) => ({
            tabPress: e => {
              Animated.spring(tabOffsetValue, {
                toValue: 0,
                useNativeDriver: true,
              }).start();
            }
          })}
        />
        <Tabs.Screen
          name='ReportStack'
          component={ReportStack}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({focused}) => (
              <View style={tw`w-full h-full items-center justify-center`}>
                <View style={tw`w-20 rounded-xl py-4 items-center`}>
                  {
                    focused ?
                    <Solid.PresentationChartBarIcon style={tw`text-green-600`} />
                    :
                    <Outline.PresentationChartBarIcon style={tw`text-zinc-400`}/>
                  }
                  <Text style={tw`mt-1 text-xs ${focused ? "text-zinc-600 font-bold" : "text-zinc-400"} `}>Laporan</Text>
                </View>
              </View>
            )
          }} listeners={({navigation, route}) => ({
            tabPress: e => {
              Animated.spring(tabOffsetValue, {
                toValue: getWidth(),
                useNativeDriver: true
              }).start()
            }
          })}
        />
      </Tabs.Navigator>
      <View style={tw`flex h-4.5 bottom-20 absolute left-7`}>
        <Animated.View
          style={{ 
            width: getWidth() - 25,
            height: 5,
            backgroundColor: '#16a34a',
            transform: [
              { translateX: tabOffsetValue }
            ],
            borderBottomLeftRadius: 60,
            borderBottomRightRadius: 60
          }}
        >
          <LinearGradient start={{x: 0, y: 0}} end={{x: 0, y: 1}} colors={['rgba(52, 223, 132, 0.2)', 'rgba(0, 146, 69, 0)']} style={tw`p-6`}></LinearGradient>
        </Animated.View>
      </View>
    </>
  )
}

function App(): JSX.Element {
  return(
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Splash'>
          <Stack.Screen name='Splash' component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name='Home' component={BottomNav} options={{ headerShown: false }} />
          <Stack.Screen name='Welcome' component={WelcomeScreen} options={{ gestureEnabled: false, headerShown: false, headerLeft: () => null }} />
          <Stack.Screen name='Sorting' component={SortingScreen} options={{ headerShown: false }} />
          <Stack.Screen name='Processing' component={ProcessingScreen} options={{ headerShown: false }} />
          <Stack.Screen name='ManageAccount' component={ManageAccountScreen} options={{ headerShown: false }} />
          <Stack.Screen name='DetailSector' component={DetailSectorScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}

export default App;