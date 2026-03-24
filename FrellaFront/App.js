import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import LoginScreen from './src/services/screens/loginScreen';
import RegisterScreen from './src/services/screens/registerUserScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('register');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FE" />
      {currentScreen === 'register' ? (
        <RegisterScreen onRegisterSuccess={() => setCurrentScreen('login')} />
      ) : (
        <LoginScreen onGoToRegister={() => setCurrentScreen('register')} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
});
