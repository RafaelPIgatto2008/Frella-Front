import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import LateralBar from '../components/LateralBar';
import { getMyServices } from '../Services';
import { styles } from '../styles/detailScreenStyle';

const normalizeService = (service) => ({
  id: service?.id ?? service?.Id ?? service?.serviceId ?? service?.ServiceId ?? '',
  title: service?.title ?? service?.Title ?? '',
  description: service?.description ?? service?.Description ?? '',
  amount: service?.amount ?? service?.Amount ?? 0,
  serviceType: service?.serviceType ?? service?.ServiceType ?? '',
  status: service?.status ?? service?.Status ?? '',
});

const extractServicesList = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.services)) {
    return response.services;
  }

  if (Array.isArray(response?.Services)) {
    return response.Services;
  }

  return [];
};

export default function ServicesScreen({
  onLogout,
  onBackHome,
  onGoToCreateService,
  onGoToNews,
  onGoToServices,
  onGoToUserDetails,
  onOpenServiceDetails,
  onOpenServiceCandidates,
}) {
  const [services, setServices] = useState([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [servicesError, setServicesError] = useState('');

  const navigationItems = [
    { icon: 'H', label: 'Home', onPress: onBackHome },
    { icon: 'S', label: 'My Services', active: true, onPress: onGoToServices },
    { icon: 'N', label: 'News', onPress: onGoToNews },
    { icon: '+', label: 'New', onPress: onGoToCreateService },
  ];

  const loadServices = async () => {
    try {
      setIsLoadingServices(true);
      setServicesError('');
      const response = await getMyServices();
      const rawServices = extractServicesList(response);
      setServices(rawServices.map(normalizeService));
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Falha ao carregar os servicos.';
      setServicesError(errorMsg);
      setServices([]);
    } finally {
      setIsLoadingServices(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  return (
    <View style={styles.container}>
      <LateralBar
        profileInitials="RP"
        profileName="User"
        profileRole="Seu perfil"
        navigationItems={navigationItems}
        onProfilePress={onGoToUserDetails}
        onLogout={onLogout}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Meus servicos</Text>
        <Text style={styles.subtitle}>
          Consulte todos os servicos cadastrados pelo usuario autenticado e abra os detalhes de cada item.
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Lista dos meus servicos</Text>

          {isLoadingServices ? (
            <View style={styles.statusBox}>
              <ActivityIndicator size="large" color="#2C8C99" />
              <Text style={styles.statusText}>Carregando servicos...</Text>
            </View>
          ) : servicesError ? (
            <View style={styles.statusBox}>
              <Text style={styles.errorText}>{servicesError}</Text>
            </View>
          ) : services.length === 0 ? (
            <View style={styles.statusBox}>
              <Text style={styles.statusText}>Voce ainda nao cadastrou nenhum servico.</Text>
            </View>
          ) : (
            services.map((service, index) => (
              <View key={`${service.id || service.title}-${index}`} style={styles.itemCard}>
                <Text style={styles.itemTitle}>{service.title || 'Sem titulo'}</Text>
                <Text style={styles.itemDescription}>
                  {service.description || 'Sem descricao informada.'}
                </Text>
                <Text style={styles.metaText}>Valor: R$ {Number(service.amount || 0).toFixed(2)}</Text>
                {service.serviceType ? (
                  <Text style={styles.metaText}>Tipo: {String(service.serviceType)}</Text>
                ) : null}
                {service.status ? (
                  <Text style={styles.metaText}>Status: {service.status}</Text>
                ) : null}

                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={[styles.primaryButton, styles.flexButton, !service.id && styles.primaryButtonDisabled]}
                    onPress={() => onOpenServiceDetails?.(service.id)}
                    disabled={!service.id}
                  >
                    <Text style={styles.primaryButtonText}>
                      {service.id ? 'Ver detalhes' : 'ID indisponivel'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.secondaryButton, styles.flexButton, !service.id && styles.primaryButtonDisabled]}
                    onPress={() => onOpenServiceCandidates?.(service.id, service.title)}
                    disabled={!service.id}
                  >
                    <Text style={styles.secondaryButtonText}>
                      {service.id ? 'Ver candidatos' : 'ID indisponivel'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          <View style={styles.actionsRow}>
            <TouchableOpacity style={[styles.secondaryButton, styles.flexButton]} onPress={loadServices}>
              <Text style={styles.secondaryButtonText}>Atualizar lista</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.primaryButton, styles.flexButton]} onPress={onGoToCreateService}>
              <Text style={styles.primaryButtonText}>Criar servico</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
