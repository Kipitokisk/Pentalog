import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, Alert } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import axios from 'axios';
import { BASE_URL } from '../config';

const MainScreen = () => {
  const [parkingData, setParkingData] = useState([]);
  const [parkingReports, setParkingReports] = useState([]);
  const [jwtToken, setJwtToken] = useState(null);
  const [userData, setUserData] = useState();
  const [serverDown, setServerDown] = useState(false);
  const [pressedReportButtonId, setPressedReportButtonId] = useState(null);

  useEffect(() => {
    fetchUserData();

    const intervalID = setInterval(() => {
      fetchData();
      setTimeout(() => {
        fetchReports();
      }, 1000);
    }, 2000); // Increased interval to 2 seconds to accommodate fetchData and the delay for fetchReports

    return () => clearInterval(intervalID); // Cleanup on component unmount
  }, []);
  const fetchUserData = () => {
    axios.get(BASE_URL + '/api/user')
      .then(response => {
        setUserData(response.data);
        setServerDown(false);
      })
      .catch(error => {
        console.log("user error")
      });
  };

 const fetchData = () => {
   axios.get(BASE_URL + '/api/parking-list')
     .then(response => {
       setParkingData(response.data);
       setServerDown(false);
     })
     .catch(error => {
       if (error.response && error.response.status === 502) {
         setServerDown(true);
       } else {
         console.log("parking list error")
       }
     });
 };

 const fetchReports = () => {
   axios.get(BASE_URL + '/api/parking-list-report')
     .then(response => {
       setParkingReports(response.data);
     })
     .catch(error => {
       console.log("parking reports error")
     });
 };

  const updateOccupiedStatus = (id, isOccupied, token) => {
    const newStatus = isOccupied ? 'free' : 'occupy';
    const apiUrl = BASE_URL + '/api/parking-list/' + id + '/' + newStatus;

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

                  })
                  .then(() => {
                    fetchData();
                  })
                  .catch((error) => {
                    Alert.alert('Error','Something went wrong when occupying a parking lot.');
                    console.error('Error updating parking status:', error);
                  });
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert('Error','You can only leave parking lots that you occupied.');
      }
    } else {
      axios
        .put(apiUrl, null, {
        })
        .then(() => {
          fetchData();
          fetchReports();
        })
        .catch((error) => {
          Alert.alert('Error','You can only occupy one parking lot.');
          console.error('Error updating parking status:', error);
        });
    }
  };

  const isCurrentUserOccupying = (parkingLotId) => {
    return userData?.id === parkingData.find((lot) => lot.id === parkingLotId)?.users?.id;
  };

  const submitReport = async (parkingLotId) => {
    try {
      await axios.post(`${BASE_URL}/api/parking-list/${parkingLotId}/report`);
      await fetchData();
      Alert.alert('Success', 'Report submitted successfully');
    } catch (error) {
      console.error('Error submitting report:', error);
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    } finally {
      setPressedReportButtonId(parkingLotId);
    }
  };

  const handleReport = async (parkingLotId) => {
    const isAlreadyReported = pressedReportButtonId === parkingLotId || parkingReports.some(report => report.parkingLot.id === parkingLotId);
    const isOccupiedByCurrentUser = isCurrentUserOccupying(parkingLotId);

    if (isOccupiedByCurrentUser) {
      Alert.alert('Cannot Report', 'You cannot report a parking lot that is occupied by you.');
      return;
    }

    if (isAlreadyReported) {
      Alert.alert(
        'Confirm Report',
        'You have already reported this parking lot. Do you want to report it again?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Report Again',
            onPress: async () => {
              await submitReport(parkingLotId);
              fetchData();
            },
          },
        ],
      );
    } else {
      await submitReport(parkingLotId);
      fetchData();
    }
  };

  const resolveReport = async (parkingLotId) => {
    try {
      await axios.delete(`${BASE_URL}/api/parking-list/${parkingLotId}/report-delete`);
      fetchData();
      fetchReports();
      Alert.alert('Success', 'Report deleted successfully');
    } catch (error) {
      console.error('Error deleting report:', error);
      Alert.alert('Error', 'Failed to delete report. Please try again.');
    } finally {
      setPressedReportButtonId(null); // Reset the pressedReportButtonId
    }
  };

  const renderOccupiedButton = (parkingLotId, isOccupied, parkingUserId, userId) => {
    const hasReports = parkingReports.some(report => report.parkingLot.id === parkingLotId);

    if (isOccupied && userId === parkingUserId && hasReports) {
      return (
        <TouchableOpacity
          style={styles.resolveButton}
          onPress={() => resolveReport(parkingLotId)}
        >
          <Text style={styles.resolveButtonText}>Hold to Resolve</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={isOccupied ? (userId === parkingUserId ? styles.userOccupiedButton : styles.occupiedButton) : styles.freeButton}
        onPress={() => updateOccupiedStatus(parkingLotId, isOccupied, jwtToken)}
      >
        <Text style={isOccupied && userId === parkingUserId ? styles.userOccupiedButtonText : styles.buttonText}>
          {isOccupied ? (userId === parkingUserId ? 'You Occupied' : 'Occupied') : 'Free'}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderItem = (item, index) => {
    const hasReports = parkingReports.some(report => report.parkingLot.id === item.id);
    const isOccupiedByCurrentUser = item.isOccupied && item.users && item.users.id === userData?.id;

    if (isOccupiedByCurrentUser && hasReports) {
      return (
        <Row
          key={index}
          data={[
            <Text style={[styles.boldText, styles.bigText, { textAlign: 'center' }]}>{item.id.toString()}</Text>,
            <TouchableOpacity
              style={styles.resolveButton}
              onPress={() => resolveReport(item.id)}
            >
              <Text style={styles.resolveButtonText}>Hold to Resolve</Text>
            </TouchableOpacity>,
          ]}
          style={index % 2 === 0 ? styles.placeNrCell : styles.statusCell}
          textStyle={styles.boldText}
        />
      );
    }

    return (
      <Row
        key={index}
        data={[
          <Text style={[styles.boldText, styles.bigText, { textAlign: 'center' }]}>{item.id.toString()}</Text>,
          renderOccupiedButton(item.id, item.isOccupied, item.users ? item.users.id : null, userData?.id),
          <TouchableOpacity
            style={[
              styles.reportButton,
              { backgroundColor: hasReports ? 'purple' : 'grey' },
            ]}
            onPress={() => handleReport(item.id)}
          >
            <Text style={styles.buttonText}>Report</Text>
          </TouchableOpacity>,
        ]}
        style={index % 2 === 0 ? styles.placeNrCell : styles.statusCell}
        textStyle={styles.boldText}
      />
    );
  };

  const sortedParkingData = [...parkingData].sort((a, b) => {
    if (a.isOccupied && a.users && a.users.id === userData?.id) return -1;
    if (b.isOccupied && b.users && b.users.id === userData?.id) return 1;
    if (a.isOccupied && !b.isOccupied) return 1;
    if (!a.isOccupied && b.isOccupied) return -1;
    return 0;
  });

  if (serverDown) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Server is Down. Please try again later.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
          <Row data={['Parking Lot', 'Status', 'Report']} style={styles.head} textStyle={[styles.boldText, styles.whiteText, { textAlign: 'center' }]} />
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
  resolveButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resolveButtonText: {
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
    color: 'white',
  },
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  },
  reportButton: {
    backgroundColor: 'grey',
    padding: 10,
    borderRadius: 5,
  },
});

export default MainScreen;
