import React, {useState} from 'react';
import {TouchableOpacity, StyleSheet, View, KeyboardAvoidingView} from 'react-native';
import {Text} from 'react-native-paper';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import {theme} from '../core/theme';
import {emailValidator} from '../helpers/emailValidator';
import {passwordValidator} from '../helpers/passwordValidator';
import axios from "axios";
import {BASE_URL} from "../config";

export default function LoginScreen({navigation}) {
    const [email, setEmail] = useState({value: null, error: ''});
    const [password, setPassword] = useState({value: null, error: ''});
    const [loginError, setLoginError] = useState('');

    const onLoginPressed = async () => {
        const emailError = emailValidator(email.value)
        const passwordError = passwordValidator(password.value)
        if (emailError || passwordError) {
            setEmail({...email, error: emailError})
            setPassword({...password, error: passwordError})
            return
        }
        try{
            const response = await axios.post(`${BASE_URL}/api/login`, {
                email: email.value,
                password: password.value,
            });
            if(response.status === 200) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Tabs'}],
                });
            }else if(response.status === 400 ) {
                setLoginError('Incorrect email or password.')
            }
        }  catch (error){
            console.error('Login Error', error);
            setLoginError('An error occurred while logging in')
        }
    }

    return (
        <Background>

            <View style={{left: 140}}>
                <Logo/>
            </View>

            <KeyboardAvoidingView
                style={{flex: 1, justifyContent: 'center'}}
                keyboardVerticalOffset={86}
                behavior={"height"}
                enabled
            >

                <View style={{top: 90}}>
                    <Header>Welcome back.</Header>
                    <TextInput
                        label="Email"
                        returnKeyType="next"
                        value={email.value}
                        onChangeText={(text) => setEmail({value: text, error: ''})}
                        error={!!email.error}
                        errorText={email.error}
                        autoCapitalize="none"
                        autoCompleteType="email"
                        textContentType="emailAddress"
                        keyboardType="email-address"
                    />
                    <TextInput
                        label="Password"
                        returnKeyType="done"
                        value={password.value}
                        onChangeText={(text) => setPassword({value: text, error: ''})}
                        error={!!password.error}
                        errorText={password.error}
                        secureTextEntry
                    />
                    <View style={styles.forgotPassword}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('ResetPasswordScreen')}
                        >
                            <Text style={styles.forgot}>Forgot your password?</Text>
                        </TouchableOpacity>
                    </View>
                    <Button mode="contained" onPress={onLoginPressed}>
                        Login
                    </Button>
                    <View style={styles.row}>
                        <Text>Don’t have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.link}>Sign up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Background>
    );
}

const styles = StyleSheet.create({
    forgotPassword: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    row: {
        flexDirection: 'row',
        marginTop: 4,
    },
    forgot: {
        fontSize: 13,
        color: theme.colors.secondary,
    },
    link: {
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
});