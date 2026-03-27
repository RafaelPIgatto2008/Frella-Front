import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StatusBar, View } from 'react-native';
import CreateServiceScreen from './src/services/screens/createServiceScreen';
import HomeScreen from './src/services/screens/homeScreen';
import LoginScreen from './src/services/screens/loginScreen';
import NewsDetailsScreen from './src/services/screens/newsDetailsScreen';
import NewsScreen from './src/services/screens/newsScreen';
import RegisterScreen from './src/services/screens/registerUserScreen';
import ServiceDetailsScreen from './src/services/screens/serviceDetailsScreen';
import UserDetailsScreen from './src/services/screens/userDetailsScreen';
import { getAccessToken, removeAccessToken } from './src/services/tokenService';
import { styles } from './src/services/styles/appStyle';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedNewsId, setSelectedNewsId] = useState('');
  const goToHome = () => setCurrentScreen('home');
  const goToLogin = () => setCurrentScreen('login');
  const goToRegister = () => setCurrentScreen('register');
  const goToCreateService = () => setCurrentScreen('create-service');
  const goToNews = () => setCurrentScreen('news');
  const goToUserDetails = () => setCurrentScreen('user-details');
  const goToServiceDetails = (serviceId = '') => {
    setSelectedServiceId(serviceId);
    setCurrentScreen('service-details');
  };
  const goToNewsDetails = (newsId = '') => {
    setSelectedNewsId(newsId);
    setCurrentScreen('news-details');
  };
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
          onGoToNews={goToNews}
          onGoToUserDetails={goToUserDetails}
          onGoToServiceDetails={goToServiceDetails}
        />
      ) : currentScreen === 'news' ? (
        <NewsScreen
          onLogout={handleLogout}
          onBackHome={goToHome}
          onOpenNewsDetails={goToNewsDetails}
          navigationItems={[
            { icon: 'H', label: 'Home', onPress: goToHome },
            { icon: 'N', label: 'News', active: true, onPress: goToNews },
            { icon: '+', label: 'New', onPress: goToCreateService },
          ]}
          onProfilePress={goToUserDetails}
        />
      ) : currentScreen === 'user-details' ? (
        <UserDetailsScreen
          onLogout={handleLogout}
          navigationItems={[
            { icon: 'H', label: 'Home', onPress: goToHome },
            { icon: 'N', label: 'News', onPress: goToNews },
            { icon: '+', label: 'New', onPress: goToCreateService },
          ]}
          onProfilePress={goToUserDetails}
        />
      ) : currentScreen === 'service-details' ? (
        <ServiceDetailsScreen
          onLogout={handleLogout}
          initialServiceId={selectedServiceId}
          navigationItems={[
            { icon: 'H', label: 'Home', onPress: goToHome },
            { icon: 'N', label: 'News', onPress: goToNews },
            { icon: 'S', label: 'Serv', active: true, onPress: () => goToServiceDetails(selectedServiceId) },
          ]}
          onProfilePress={goToUserDetails}
        />
      ) : currentScreen === 'news-details' ? (
        <NewsDetailsScreen
          onLogout={handleLogout}
          initialNewsId={selectedNewsId}
          navigationItems={[
            { icon: 'H', label: 'Home', onPress: goToHome },
            { icon: 'N', label: 'News', active: true, onPress: goToNews },
            { icon: '+', label: 'New', onPress: goToCreateService },
          ]}
          onProfilePress={goToUserDetails}
        />
      ) : (
        <CreateServiceScreen
          onBackHome={goToHome}
          onLogout={handleLogout}
          onGoToNews={goToNews}
          onGoToUserDetails={goToUserDetails}
        />
      )}
    </SafeAreaView>
  );
}
