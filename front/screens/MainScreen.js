import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import axios from 'axios';
const MainScreen = () => {
  const [parkingData, setParkingData] = useState([]);
  const [jwtToken, setJwtToken] = useState(null);

    useEffect(() => {
      fetchData();

      const intervalID = setInterval(() => {
        fetchData()
      }, 1000);

      return () => clearInterval(intervalID);
    }, []);

  const fetchData = () => {

    axios.get('https://bbef-212-56-211-206.ngrok.io/api/parking-list')
      .then(response => {
        setParkingData(response.data);
      })
      .catch(error => {
        console.error('Error fetching parking data:', error);
      });
  };

const updateOccupiedStatus = (id, isOccupied, token) => {
  const newStatus = isOccupied ? 'free' : 'occupy';
  const apiUrl = 'https://bbef-212-56-211-206.ngrok.io/api/parking-list/' + id + '/' + newStatus;

  axios.put(apiUrl, null, {
    headers: {
      Authorization: 'Bearer ' + token,
      // Add any other required headers here
    },
  })
    .then(response => {
      fetchData();
    })
    .catch(error => {
      console.error('Error updating parking status:', error);
    });
};


  const tableHead = ['ID', 'Is Occupied'];

  const renderOccupiedButton = (id, isOccupied) => (
    <TouchableOpacity
      style={isOccupied ? styles.occupiedButton : styles.freeButton}
      onPress={() => updateOccupiedStatus(id, isOccupied)}
    >
      <Text style={styles.buttonText}>{isOccupied ? 'Occupied' : 'Free'}</Text>
    </TouchableOpacity>
  );

  const renderItem = (item, index) => (
    <Row
      key={index}
      data={[item.id.toString(), renderOccupiedButton(item.id, item.isOccupied)]}
      style={index % 2 === 0 ? styles.placeNrCell : styles.statusCell}
      textStyle={styles.text}
    />
  );

  return (
    <View style={styles.container}>
      <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
        <Row data={tableHead} style={styles.head} textStyle={styles.text} />
        {parkingData.map((item, index) => renderItem(item, index))}
      </Table>
    </View>
  );
};

const styles = StyleSheet.create({
  // ... other styles

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
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16, // Adjust the font size as needed
  },
});


export default MainScreen;
