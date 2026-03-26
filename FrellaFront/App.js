import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StatusBar, View } from 'react-native';
import CreateServiceScreen from './src/services/screens/createServiceScreen';
import HomeScreen from './src/services/screens/homeScreen';
import LoginScreen from './src/services/screens/loginScreen';
import RegisterScreen from './src/services/screens/registerUserScreen';
import { getAccessToken, removeAccessToken } from './src/services/tokenService';
import { styles } from './src/services/styles/appStyle';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const goToHome = () => setCurrentScreen('home');
  const goToLogin = () => setCurrentScreen('login');
  const goToRegister = () => setCurrentScreen('register');
  const goToCreateService = () => setCurrentScreen('create-service');
  const handleLogout = async () => {
    await removeAccessToken();
    goToLogin();
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const accessToken = await getAccessToken();
        setCurrentScreen(accessToken ? 'home' : 'login');
      } finally {
        setIsCheckingSession(false);
      }
    };

    restoreSession();
  }, []);

  if (isCheckingSession) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8F9FE" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2C8C99" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FE" />
      {currentScreen === 'register' ? (
        <RegisterScreen
          onRegisterSuccess={goToLogin}
          onGoToLogin={goToLogin}
        />
      ) : currentScreen === 'login' ? (
        <LoginScreen
          onGoToRegister={goToRegister}
          onLoginSuccess={goToHome}
        />
      ) : currentScreen === 'home' ? (
        <HomeScreen
          onLogout={handleLogout}
          onGoToHome={goToHome}
          onGoToCreateService={goToCreateService}
        />
      ) : (
        <CreateServiceScreen
          onBackHome={goToHome}
          onLogout={handleLogout}
        />
      )}
    </SafeAreaView>
  );
}
