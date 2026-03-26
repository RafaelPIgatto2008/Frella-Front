import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LateralBar from '../components/LateralBar';
import { getAllServices } from '../Services';
import { styles } from '../styles/homeStyle';

export default function HomeScreen({ onLogout, onGoToCreateService, onGoToHome }) {
  const [services, setServices] = useState([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [servicesError, setServicesError] = useState('');

  const navigationItems = [
    { icon: 'H', label: 'Home', active: true, onPress: onGoToHome },
    { icon: '+', label: 'Services', onPress: onGoToCreateService },
    { icon: 'F', label: 'Favoritos' },
  ];

  useEffect(() => {
    const loadServices = async () => {
      try {
        setIsLoadingServices(true);
        setServicesError('');
        const response = await getAllServices();
        const rawServices = Array.isArray(response)
          ? response
          : Array.isArray(response?.value)
            ? response.value
            : [];

        const normalizedServices = rawServices.map((service) => ({
          title: service.title ?? service.Title ?? '',
          description: service.description ?? service.Description ?? '',
          amount: service.amount ?? service.Amount ?? 0,
          serviceType: service.serviceType ?? service.ServiceType ?? '',
        }));

        setServices(normalizedServices);
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Falha ao carregar os servicos.';
        setServicesError(errorMsg);
      } finally {
        setIsLoadingServices(false);
      }
    };

    loadServices();
  }, []);

  return (
    <View style={styles.container}>
      <LateralBar
        profileInitials="RP"
        profileName="User"
        profileRole="Seu perfil"
        navigationItems={navigationItems}
        onLogout={onLogout}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Encontre e gerencie servicos</Text>
        <Text style={styles.subtitle}>
          Use a busca para encontrar um servico ou adicionar um novo ao seu catalogo.
        </Text>

        <View style={styles.searchCard}>
          <Text style={styles.searchLabel}>Buscar para adicionar servico</Text>
          <View style={styles.searchRow}>
            <View style={styles.searchInputWrapper}>
              <View style={styles.searchIcon} accessible={false}>
                <View style={styles.searchLens} />
                <View style={styles.searchHandle} />
              </View>
              <TextInput
                style={styles.searchInput}
                placeholder="Pesquisar servicos"
                placeholderTextColor="#8B95A7"
              />
            </View>

            <TouchableOpacity style={styles.addServiceButton} onPress={onGoToCreateService}>
              <Text style={styles.addServiceButtonText}>Adicionar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Navegacao rapida</Text>
          <Text style={styles.infoText}>
            A barra lateral mantem seu perfil no topo e facilita acessar home, servicos e favoritos.
          </Text>
        </View>

        <View style={styles.servicesCard}>
          <Text style={styles.servicesTitle}>Servicos cadastrados</Text>

          {isLoadingServices ? (
            <View style={styles.servicesStatusBox}>
              <ActivityIndicator size="large" color="#2C8C99" />
              <Text style={styles.servicesStatusText}>Carregando servicos...</Text>
            </View>
          ) : servicesError ? (
            <View style={styles.servicesStatusBox}>
              <Text style={styles.servicesErrorText}>{servicesError}</Text>
            </View>
          ) : services.length === 0 ? (
            <View style={styles.servicesStatusBox}>
              <Text style={styles.servicesStatusText}>Nenhum servico encontrado.</Text>
            </View>
          ) : (
            services.map((service, index) => (
              <View key={`${service.title}-${index}`} style={styles.serviceItem}>
                <View style={styles.serviceHeader}>
                  <Text style={styles.serviceItemTitle}>{service.title}</Text>
                  <Text style={styles.serviceBadge}>{service.serviceType}</Text>
                </View>
                <Text style={styles.serviceDescription}>{service.description}</Text>
                <Text style={styles.serviceAmount}>R$ {Number(service.amount).toFixed(2)}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
