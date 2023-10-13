import React from 'react'
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { theme } from '../core/theme'
import {
    LoginScreen,
    MainScreen,
    RegisterScreen,
    BottomNavigation
} from '../app/defaultExport'

const Stack = createStackNavigator()

export default function Index() {
    return (
        <Provider theme={ theme }>

            <NavigationContainer independent={true}>

                <BottomNavigation/>

            </NavigationContainer>

        </Provider>
    )
}
