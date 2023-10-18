import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, Alert } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import axios from 'axios';
import { BASE_URL } from '../config.js';

const MainScreen = () => {
  const [parkingData, setParkingData] = useState([]);
  const [jwtToken, setJwtToken] = useState(null);
  const [userData, setUserData] = useState();

  useEffect(() => {
    fetchData();
    fetchUserData();
    const intervalID = setInterval(() => {
      fetchData();
    }, 1000);

    return () => clearInterval(intervalID);
  }, []);

  const fetchUserData = () => {
    axios.get(BASE_URL + '/api/user', {
      headers: {
        Cookie: 'jwt=' + jwtToken,
      },
    })
      .then(response => {
        setUserData(response.data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  };

  const fetchData = () => {
    axios.get(BASE_URL + '/api/parking-list')
      .then(response => {
        setParkingData(response.data);
      })
      .catch(error => {
        showMessage('An error occurred while fetching parking data. Please try again.');
        console.error('Error fetching parking data:', error);
      });
  };

  const updateOccupiedStatus = (id, isOccupied, token) => {
    const newStatus = isOccupied ? 'free' : 'occupy';
    const apiUrl = BASE_URL + '/api/parking-list/' + id + '/' + newStatus;

    // Show a confirmation alert only when freeing a parking lot
    if (isOccupied) {
      if (isCurrentUserOccupying(id)) {
        Alert.alert(
          'Confirm',
          'Are you sure you want to leave?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                axios
                  .put(apiUrl, null, {
                    headers: {
                      Authorization: 'Bearer ' + token,
                    },
                  })
                  .then((response) => {
                    fetchData();
                  })
                  .catch((error) => {
                    showMessage('An error occurred. Please try again.');
                    console.error('Error updating parking status:', error);
                  });
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        showMessage('You can only leave parking lots that you occupy.');
      }
    } else {
      // If the parking lot is not occupied, update the status directly without confirmation
      axios
        .put(apiUrl, null, {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        })
        .then((response) => {
          fetchData();
        })
        .catch((error) => {
          showMessage('An error occurred. Please try again.');
          console.error('Error updating parking status:', error);
        });
    }
  };

  const isCurrentUserOccupying = (parkingLotId) => {
    return userData?.id === parkingData.find((lot) => lot.id === parkingLotId)?.users?.id;
  };

  const tableHead = ['Parking Lot', 'Status'];

  const renderItem = (item, index) => (
    <Row
          key={index}
          data={[
            <Text style={[styles.boldText, styles.bigText, { textAlign: 'center' }]}>{item.id.toString()}</Text>,
            renderOccupiedButton(item.id, item.isOccupied, item.users ? item.users.id : null, userData?.id),
          ]}
          style={index % 2 === 0 ? styles.placeNrCell : styles.statusCell}
          textStyle={styles.boldText}
        />
  );

  const renderOccupiedButton = (parkingLotId, isOccupied, parkingUserId, userId) => (
    <TouchableOpacity
      style={isOccupied ? (userId === parkingUserId ? styles.userOccupiedButton : styles.occupiedButton) : styles.freeButton}
      onPress={() => updateOccupiedStatus(parkingLotId, isOccupied, jwtToken)}
    >
      <Text style={isOccupied && userId === parkingUserId ? styles.userOccupiedButtonText : styles.buttonText}>
        {isOccupied ? (userId === parkingUserId ? 'You Occupied' : 'Occupied') : 'Free'}
      </Text>
    </TouchableOpacity>
  );

  // Sort parkingData based on isOccupied property (occupied lots below free ones)
  // 'You Occupied' row should always come first
  const sortedParkingData = [...parkingData].sort((a, b) => {
    if (a.isOccupied && a.users && a.users.id === userData?.id) return -1; // 'You Occupied' row first
    if (b.isOccupied && b.users && b.users.id === userData?.id) return 1; // 'You Occupied' row first
    if (a.isOccupied && !b.isOccupied) return 1;
    if (!a.isOccupied && b.isOccupied) return -1;
    return 0;
  });

  const showMessage = (message) => {
    Alert.alert('Error', message, [{ text: 'OK' }]);
  };

  return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
            <Row data={tableHead} style={styles.head} textStyle={[styles.boldText, styles.whiteText, { textAlign: 'center' }]} />
            {sortedParkingData.map((item, index) => renderItem(item, index))}
          </Table>
        </View>
      </ScrollView>
    );
  };

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    marginBottom: 20,
  },
  freeButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  occupiedButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  userOccupiedButton: {
    backgroundColor: 'yellow',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userOccupiedButtonText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  boldText: {
    fontWeight: 'bold',
  },
  bigText: {
    fontSize: 18,
  },
  whiteText: {
    color: 'white',
  },
  placeNrCell: {
    backgroundColor: '#f2f2f2',
  },
  statusCell: {
    backgroundColor: 'white',
  },
  head: {
      height: 40,
      backgroundColor: '#537791',
      color:'white',
    },
});

export default MainScreen;
