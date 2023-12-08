import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, Text } from 'react-native';
import Middle from "../components/Middle";
import Sizes from '../constants/Sizes';
import Button from "../components/Button";
import {LoginScreen} from "../app/defaultExport";
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../config';

const ProfileDetail = ({ navigation }) => {
  const [userDataProfile, setUserDataProfile] = useState(null);
  const [serverDown, setServerDown] = useState(false);

  const fetchUserDataProfile = () => {
    axios.get(BASE_URL + '/api/user')
      .then(response => {
        setUserDataProfile(response.data);
        setServerDown(false);
      })
      .catch(error => {
        console.log('User error:', error);
      });
  };

  useEffect(() => {
    fetchUserDataProfile();
  }, []);

  const handleLogout = () => {
            axios.get(BASE_URL + '/api/logout')
            .then(response => {
            navigation.replace('Login');
            })
            .catch(error => {
            console.log("Error logging out:", error);
            });
          // If the server returns a success message, navigate to the login screen

    };

  return (
      <>
        <ImageBackground
          style={styles.backgroundImage}
          source={require('../components/Simple-Blue-Gradient-Background-Graphics-3147589-1-580x387.jpg')}
        >
          <Button style={{ width: 120, left: 240 }} mode="contained" onPress={handleLogout}>
            Logout
          </Button>

          <View style={styles.container}>
            <Middle userDataProfile={userDataProfile} />

            {/* Display a message if the server is down */}
            {serverDown && (
              <Text style={{ color: 'red' }}>Failed to fetch user data. Server is down.</Text>
            )}
          </View>
        </ImageBackground>
      </>
    );
  };

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    marginHorizontal: Sizes.medium,
    marginTop: Sizes.safe,
  },
});

export default ProfileDetail;
