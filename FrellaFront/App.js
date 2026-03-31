import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StatusBar, View } from 'react-native';
import CreateServiceScreen from './src/services/screens/createServiceScreen';
import CandidatesScreen from './src/services/screens/candidatesScreen';
import HomeScreen from './src/services/screens/homeScreen';
import LandingScreen from './src/services/screens/landingScreen';
import LoginScreen from './src/services/screens/loginScreen';
import NewsDetailsScreen from './src/services/screens/newsDetailsScreen';
import NewsScreen from './src/services/screens/newsScreen';
import RegisterScreen from './src/services/screens/registerUserScreen';
import ServiceDetailsScreen from './src/services/screens/serviceDetailsScreen';
import ServicesScreen from './src/services/screens/servicesScreen';
import UserDetailsScreen from './src/services/screens/userDetailsScreen';
import { getAccessToken, removeAccessToken } from './src/services/tokenService';
import { styles } from './src/services/styles/appStyle';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedServiceTitle, setSelectedServiceTitle] = useState('');
  const [selectedNewsId, setSelectedNewsId] = useState('');
  const goToLanding = () => setCurrentScreen('landing');
  const goToHome = () => setCurrentScreen('home');
  const goToLogin = () => setCurrentScreen('login');
  const goToRegister = () => setCurrentScreen('register');
  const goToCreateService = () => setCurrentScreen('create-service');
  const goToNews = () => setCurrentScreen('news');
  const goToServices = () => setCurrentScreen('services');
  const goToUserDetails = () => setCurrentScreen('user-details');
  const goToServiceDetails = (serviceId = '') => {
    setSelectedServiceId(serviceId);
    setCurrentScreen('service-details');
  };
  const goToServiceCandidates = (serviceId = '', serviceTitle = '') => {
    setSelectedServiceId(serviceId);
    setSelectedServiceTitle(serviceTitle);
    setCurrentScreen('service-candidates');
  };
  const goToNewsDetails = (newsId = '') => {
    setSelectedNewsId(newsId);
    setCurrentScreen('news-details');
  };
  const handleLogout = async () => {
    await removeAccessToken();
    goToLanding();
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const accessToken = await getAccessToken();
        setCurrentScreen(accessToken ? 'home' : 'landing');
      } finally {
        setIsCheckingSession(false);
      }
    };

    restoreSession();
  }, []);

  if (isCheckingSession) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F3F7FA" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2C8C99" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F7FA" />
      {currentScreen === 'landing' ? (
        <LandingScreen
          onGoToLogin={goToLogin}
          onGoToRegister={goToRegister}
        />
      ) : currentScreen === 'register' ? (
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
          onGoToServices={goToServices}
          onGoToUserDetails={goToUserDetails}
          onGoToServiceDetails={goToServiceDetails}
        />
      ) : currentScreen === 'services' ? (
        <ServicesScreen
          onLogout={handleLogout}
          onBackHome={goToHome}
          onGoToCreateService={goToCreateService}
          onGoToServices={goToServices}
          onGoToUserDetails={goToUserDetails}
          onOpenServiceDetails={goToServiceDetails}
          onOpenServiceCandidates={goToServiceCandidates}
        />
      ) : currentScreen === 'service-candidates' ? (
        <CandidatesScreen
          onLogout={handleLogout}
          initialServiceId={selectedServiceId}
          initialServiceTitle={selectedServiceTitle}
          onCandidateApproved={goToServiceDetails}
          navigationItems={[
            { icon: 'H', label: 'Home', onPress: goToHome },
            { icon: 'S', label: 'My Services', onPress: goToServices },
            { icon: 'C', label: 'Candidates', active: true, onPress: () => goToServiceCandidates(selectedServiceId, selectedServiceTitle) },
            { icon: '+', label: 'New', onPress: goToCreateService },
          ]}
          onProfilePress={goToUserDetails}
        />
      ) : currentScreen === 'news' ? (
        <NewsScreen
          onLogout={handleLogout}
          onBackHome={goToHome}
          onOpenNewsDetails={goToNewsDetails}
          navigationItems={[
            { icon: 'H', label: 'Home', onPress: goToHome },
            { icon: 'S', label: 'My Services', onPress: goToServices },
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
            { icon: 'S', label: 'My Services', onPress: goToServices },
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
            { icon: 'S', label: 'My Services', onPress: goToServices },
            { icon: 'D', label: 'Details', active: true, onPress: () => goToServiceDetails(selectedServiceId) },
          ]}
          onProfilePress={goToUserDetails}
        />
      ) : currentScreen === 'news-details' ? (
        <NewsDetailsScreen
          onLogout={handleLogout}
          initialNewsId={selectedNewsId}
          navigationItems={[
            { icon: 'H', label: 'Home', onPress: goToHome },
            { icon: 'S', label: 'My Services', onPress: goToServices },
            { icon: 'N', label: 'News', active: true, onPress: goToNews },
            { icon: '+', label: 'New', onPress: goToCreateService },
          ]}
          onProfilePress={goToUserDetails}
        />
      ) : (
        <CreateServiceScreen
          onBackHome={goToHome}
          onLogout={handleLogout}
          onGoToServices={goToServices}
          onGoToUserDetails={goToUserDetails}
        />
      )}
    </SafeAreaView>
  );
}
