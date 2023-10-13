import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MainScreen from "./MainScreen";
import ProfileScreen from "./ProfileScreen";
import SettingsScreen from "./SettingsScreen";
import {LoginScreen, RegisterScreen} from "../app/defaultExport";

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {

    return (

        <Tab.Navigator screenOptions={{
            headerShown: false,
        }}>

            <Tab.Screen name="LoginScreen" component={LoginScreen} />
            <Tab.Screen name="RegisterScreen" component={RegisterScreen} />
            <Tab.Screen name="MainScreen" component={MainScreen}/>
            <Tab.Screen name="ProfileScreen" component={ProfileScreen}/>
            <Tab.Screen name="SettingsScreen" component={SettingsScreen}/>
        </Tab.Navigator>

    );

}

export default BottomNavigation
