//App.js                                                                                                                                                                   //import liraries
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Button,
} from 'react-native';
import {
  notificationListener,
  requestUserPermission,
} from './src/utils/notificationServices';

// create a component
const App = () => {
  useEffect(() => {
    if (Platform.OS == 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      )
        .then(res => {
          console.log('res+++++', res);
          if (!!res && res == 'granted') {
            requestUserPermission();
            notificationListener();
          }
        })
        .catch(error => {
          alert('something wrong');
        });
    } else {
    }
  }, []);
  /* useEffect(() => {
    requestUserPermission();
    notificationListener();
  }, []); */
  return (
    <View style={styles.container}>
      <Text>App</Text>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
export default App;
