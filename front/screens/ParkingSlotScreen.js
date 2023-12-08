import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';
import { BASE_URL } from '../config';
import { decode as atob } from 'base-64';
import Button from '../components/Button';

const ParkingSlotScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const [assignedSpot, setAssignedSpot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserOccupancy = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');

      try {
        const response = await axios.get(BASE_URL + '/api/user-occupy');
        const isOccupied = response.data;
        const response2 = await axios.get(BASE_URL + '/api/user-occupy-id');
        const spotId = response2.data;

        // Loading state ends after fetching the user occupancy status
        setLoading(false);

        // Handle the occupancy status and update state here
        setScanned(isOccupied);
        setAssignedSpot(spotId);

        console.log(isOccupied);
      } catch (error) {
        console.error('Error fetching user occupancy status:', error);
        setLoading(false); // If there's an error, still end the loading state
      }
    };

    // Check user occupancy on component mount
    checkUserOccupancy();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    try {
      console.log('Scanned Data:', data);

      // Check if the scanned QR code matches the expected value
      const expectedQRCode = 'Default content'; // Change this to your expected QR code
      if (data === expectedQRCode) {
        console.log('Valid QR Code');

        // Fetch information or perform actions specific to your QR code
        const response = await axios.get(BASE_URL + '/api/qr-code/1');
        const result = response.data;

        if (result.qrcodeImage) {
          const decodedImage = atob(result.qrcodeImage);
          setQrCodeImage(`data:image/png;base64,${decodedImage}`);
        } else {
          alert('No image found for the scanned QR Code');
        }

        // Perform the occupancy-related actions
        const occupyResponse = await axios.put(BASE_URL + '/api/occupy');
        console.log('Occupied:', occupyResponse.data);

        const spotId = occupyResponse.data.id;
        setAssignedSpot(spotId);

        setScanned(true);
      } else {
        console.log('Invalid QR Code');
        alert('Invalid QR Code');
      }
    } catch (error) {
      console.error('Error handling scanned QR code:', error);
    }
  };


  const handleButtonClick = () => {
    axios.put(BASE_URL + '/api/free')
      .then(response => {
        setAssignedSpot(null);
        setScanned(false);
      })
      .catch(error => {
        console.log('Error freeing up the space', error);
      });
  };

  if (loading) {
    return <Text style={styles.permissionText}>Loading...</Text>;
  }

  if (hasPermission === null) {
    return <Text style={styles.permissionText}>Requesting camera permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text style={styles.permissionText}>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {!scanned && (
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={styles.scanner}
        />
      )}
      {scanned && assignedSpot && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Your assigned Parking Spot Is</Text>
          <Text style={styles.resultSpot}>{assignedSpot}</Text>
          <Button mode="contained" onPress={handleButtonClick}> Free </Button>
        </View>
      )}
      {scanned && qrCodeImage && (
        <View style={styles.imageContainer}>
          <Image style={styles.qrCodeImage} source={{ uri: qrCodeImage }} />
        </View>
      )}
      {!scanned && (
        <View style={styles.cornerContainer}>
          <View style={styles.cornerTopLeft} />
          <View style={styles.cornerTopRight} />
          <View style={styles.cornerBottomLeft} />
          <View style={styles.cornerBottomRight} />
        </View>
      )}
    </View>
  );
};

const overlayBackgroundColor = 'rgba(0, 0, 0, 0.7)';
const cornerColor = 'white';
const cornerSize = 40;
const cornerBorderRadius = 10;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  scanner: {
    ...StyleSheet.absoluteFillObject,
  },
  resultContainer: {
    position: 'absolute',
    top: '25%',
    width: '100%',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 24,
    color: 'black',
    marginTop: 0,
  },
  resultSpot: {
    fontSize: 144,
    color: 'black',
    fontWeight: 'bold',
    marginTop: 10,
  },
  cornerContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cornerTopLeft: {
    width: cornerSize,
    height: cornerSize,
    borderTopLeftRadius: cornerBorderRadius,
    borderLeftWidth: 3,
    borderTopWidth: 3,
    borderColor: cornerColor,
    position: 'absolute',
    top: '30%',
    left: '20%',
  },
  cornerTopRight: {
    width: cornerSize,
    height: cornerSize,
    borderTopRightRadius: cornerBorderRadius,
    borderRightWidth: 3,
    borderTopWidth: 3,
    borderColor: cornerColor,
    position: 'absolute',
    top: '30%',
    right: '20%',
  },
  cornerBottomLeft: {
    width: cornerSize,
    height: cornerSize,
    borderBottomLeftRadius: cornerBorderRadius,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: cornerColor,
    position: 'absolute',
    bottom: '30%',
    left: '20%',
  },
  cornerBottomRight: {
    width: cornerSize,
    height: cornerSize,
    borderBottomRightRadius: cornerBorderRadius,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderColor: cornerColor,
    position: 'absolute',
    bottom: '30%',
    right: '20%',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  qrCodeImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  permissionText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default ParkingSlotScreen;
