import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import 'expo-dev-client';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth'
import React, { useState, useEffect } from 'react';
import Header from './Header';

export default function App() {


  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  GoogleSignin.configure({
    webClientId: '956609867281-noul2a7in03pnaqjump868sot204bani.apps.googleusercontent.com',
  });
 // Handle user state changes
 function onAuthStateChanged(user) {
  setUser(user);
  if (initializing) setInitializing(false);
}

useEffect(() => {
  const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
  return subscriber; // unsubscribe on unmount
}, []);

const onGoogleButtonPress = async () => {
  // Check if your device supports Google Play
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  // Get the users ID token
  const { idToken } = await GoogleSignin.signIn();

  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  // Sign-in the user with the credential
  const user_sign_in = auth().signInWithCredential(googleCredential);
    user_sign_in.then((user) => {
      console.log(user);
    })
    .catch((error) => {
      console.log(error);
    })
  
}

if (initializing) return null;

if (!user) {
  return (
    <View style={styles.container}>
      <Header />
      <GoogleSigninButton
        style={{ width:300, height:48, marginTop:50}}
        onPress={onGoogleButtonPress}

          />
    </View>
  )
}
return (
  <View style={ styles.container}>
    <Header />
    <View style={{marginTop:100, alignItems:'center'}}>
      <Text style={styles.text}> Bienvenido, {user.displayName}</Text>

    </View>
  </View>
)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 23,
    fontWeight: 'bold'
  }
});
