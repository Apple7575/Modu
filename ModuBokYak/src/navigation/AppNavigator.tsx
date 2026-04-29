import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import VoiceMedicationScreen from '../screens/VoiceMedicationScreen';
import HealthCheckScreen from '../screens/HealthCheckScreen';
import CompletionScreen from '../screens/CompletionScreen';
import AlarmSetupScreen from '../screens/AlarmSetupScreen';

export type RootStackParamList = {
  Home: undefined;
  VoiceMedication: undefined;
  HealthCheck: {tookMedicine: boolean};
  Completion: {tookMedicine: boolean; healthStatus: string};
  AlarmSetup: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="VoiceMedication" component={VoiceMedicationScreen} />
        <Stack.Screen name="HealthCheck" component={HealthCheckScreen} />
        <Stack.Screen name="Completion" component={CompletionScreen} />
        <Stack.Screen name="AlarmSetup" component={AlarmSetupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
