import React, { useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import HomeScreen from './src/services/screens/homeScreen';
import LoginScreen from './src/services/screens/loginScreen';
import RegisterScreen from './src/services/screens/registerUserScreen';
import { styles } from './src/services/styles/appStyle';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('register');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FE" />
      {currentScreen === 'register' ? (
        <RegisterScreen
          onRegisterSuccess={() => setCurrentScreen('login')}
          onGoToLogin={() => setCurrentScreen('login')}
        />
      ) : currentScreen === 'login' ? (
        <LoginScreen
          onGoToRegister={() => setCurrentScreen('register')}
          onLoginSuccess={() => setCurrentScreen('home')}
        />
      ) : (
        <HomeScreen onLogout={() => setCurrentScreen('login')} />
      )}
    </SafeAreaView>
  );
}
