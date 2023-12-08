import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';
import { BASE_URL } from '../config'
import { decode as atob } from 'base-64';

const ParkingSlotScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [qrCodeImage, setQrCodeImage] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    try {
      if (data === '1') {
        // If scanned QR code is '1', make a request to '/api/qr-code/1'
        const response = await axios.get(BASE_URL + '/api/qr-code/1');
        const result = response.data;

        if (result.qrcodeImage) {
          // Decode Base64 image string
          const decodedImage = atob(result.qrcodeImage);

          // Set the decoded image to the state
          setQrCodeImage(`data:image/png;base64,${decodedImage}`);
        } else {
          alert('No image found for the scanned QR Code');
        }
      }

      // Regardless of the result, proceed to call the '/occupy' endpoint
      const occupyResponse = await axios.put(BASE_URL + '/api/occupy');
      console.log('Occupied:', occupyResponse.data);

      setScanned(true);
    } catch (error) {
      console.error('Error fetching QR code information or occupying parking slot:', error);
    }
  };

  if (hasPermission === null) {
    return <Text style={styles.permissionText}>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text style={styles.permissionText}>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.scanner}
      />
      <View style={styles.cornerContainer}>
        <View style={styles.cornerTopLeft} />
        <View style={styles.cornerTopRight} />
        <View style={styles.cornerBottomLeft} />
        <View style={styles.cornerBottomRight} />
      </View>
      {scanned && qrCodeImage && (
        <View style={styles.imageContainer}>
          <Image style={styles.qrCodeImage} source={{ uri: qrCodeImage }} />
        </View>
      )}
    </View>
  );
};

// ... (styles and other constants remain unchanged)


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
