import React from 'react'
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { theme } from '../core/theme'
import {
    LoginScreen,
    RegisterScreen
} from '../app/defaultExport'

const Stack = createStackNavigator()

export default function Index() {
    return (
        <Provider theme={ theme }>
            <NavigationContainer independent={true}>
                <Stack.Navigator
                    initialRouteName="LoginScreen"
                    screenOptions={{
                        headerShown: false,
                    }}
                >
                    <Stack.Screen name="LoginScreen" component={LoginScreen} />
                    <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    )
}
