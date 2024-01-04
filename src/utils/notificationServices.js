import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {Platform} from 'react-native';
import notifee, {AndroidImportance} from '@notifee/react-native';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFcmToken();
  }
}

const ok = () => {
  Alert.alert('OK PRESSED');
};

const cancel = () => {
  Alert.alert('cancel PRESSED');
};

const getFcmToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  console.log('The Old fcm token is:', fcmToken);
  if (!fcmToken) {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log('The New Generated fcm token:', fcmToken);
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    } catch (error) {
      console.log('error raised in fcm token is:', error);
      Alert.alert('error raised in fcm token is:', error);
    }
  }
};

async function onDisplayNotification(data) {
  // Request permissions (required for iOS)
  //Alert.alert('onDisplayNotification function executing.');
  if (Platform.OS == 'ios') {
    await notifee.requestPermission();
  }
  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    /* id: 'default9',
    name: 'Default Channel 9', */
    id: data?.data?.channel_ID,
    name: data?.data?.channel_NAME,
    sound: 'default',
    importance: AndroidImportance.HIGH,
  });

  /*
  To pass above id: and name: inside Data TextInput box of https://testfcm.com/ site use this below syntax and change value everytime when 
  new channel has to be created

  {"channel_ID":"newID4","channel_NAME":"newCh243"}

  */

  // Display a Simple notification using below syntax for displayNotification()
  /* await notifee.displayNotification({
    title: 'Notification Title',
    body: 'Main body content of the notification',
    android: {
      channelId,

      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
    },
  }); */

  /*This block of code is for notifee notification with some styling

  await notifee.displayNotification({
    title:
      '<p style="color: #4caf50;"><b>Styled HTMLTitle</span></p></b></p> &#128576;',
    subtitle: '&#129395;',
    body: 'The <p style="text-decoration: line-through">body can</p> also be <p style="color: #ffffff; background-color: #9c27b0"><i>styled too</i></p> &#127881;!',
    android: {
      channelId,
      color: '#4caf50',
      actions: [
        {
          title: '<b>Dance</b> &#128111;',
          pressAction: {id: 'dance'},
        },
        {
          title: '<p style="color: #f44336;"><b>Cry</b> &#128557;</p>',
          pressAction: {id: 'cry'},
        },
      ],
    },
  }); */

  await notifee.displayNotification({
    title:
      '<p style="color: #4caf50;"><b>' +
      data?.notification.title +
      '</span></p></b></p> &#128576;',
    body:
      'The <p style="text-decoration: line-through">' +
      data?.notification.body +
      '</p>' +
      data?.notification.body +
      '<p style="color: #ffffff; background-color: #9c27b0"><i>' +
      data?.notification.body +
      '</i></p> &#127881;!',
    android: {
      channelId,
      color: '#4caf50',
    },
  });
}

export const notificationListener = async () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });

  messaging().onMessage(async remoteMessage => {
    console.log('Received in Foreground', remoteMessage.notification.title);
    /* Alert.alert(
      'Received in Foreground. Title is:' +
        remoteMessage.notification.title +
        'Body is:' +
        remoteMessage.notification.body,
    ); */
    onDisplayNotification(remoteMessage);

    Alert.alert(
      remoteMessage.notification.title + remoteMessage.notification.body,
    );
  });

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log(
      'Message handled in the background! Message from index js',
      remoteMessage,
    );
    //Alert.alert('Your app is not opened');
    //onDisplayNotification(remoteMessage);
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });
};
