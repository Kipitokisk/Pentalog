import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { theme } from '../core/theme';
import { Provider } from 'react-native-paper';
import {
    LoginScreen,
    MainScreen,
    RegisterScreen,
    ProfileScreen,
    ParkingSlotScreen
} from '../app/defaultExport';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons} from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator(); // Use createStackNavigator instead of createNativeStackNavigator

const TabNavigator = () => {
    return (
        <Tab.Navigator initialRouteName={MainScreen}
        screenOptions={({ route}) => ({

            tabBarIcon: ({focused, color, size}) => {
                let iconName;
                let rn = route.name;

                if (rn === "Main"){
                    iconName = focused ? 'home' : 'home-outline';
                } else if (rn === "Profile"){
                    iconName = focused ? 'list' : 'list-outline';
                }

                return <Ionicons name={iconName} size={size} color={color}/>
            },

        })}
        >
            <Tab.Screen name="Main" component={MainScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
            <Tab.Screen name="Parking" component={ParkingSlotScreen} />
        </Tab.Navigator>
    );
};

export default function AppNavigation() {
    return (
        <Provider theme={theme}>
            <NavigationContainer independent={true}>
                <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
                    <Stack.Screen name="Login" component={LoginScreen}/>
                    <Stack.Screen name="Register" component={RegisterScreen}/>
                    <Stack.Screen name="Tabs" component={TabNavigator}/>
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
}
