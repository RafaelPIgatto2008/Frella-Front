import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LateralBar from '../components/LateralBar';
import { candidateToService, getAllServices } from '../Services';
import { styles } from '../styles/homeStyle';

export default function HomeScreen({
  onLogout,
  onGoToCreateService,
  onGoToHome,
  onGoToNews,
  onGoToUserDetails,
  onGoToServiceDetails,
}) {
  const [services, setServices] = useState([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isApplyingToServiceId, setIsApplyingToServiceId] = useState('');
  const [servicesError, setServicesError] = useState('');
  const [serviceId, setServiceId] = useState('');

  const navigationItems = [
    { icon: 'H', label: 'Home', active: true, onPress: onGoToHome },
    { icon: 'N', label: 'News', onPress: onGoToNews },
    { icon: '+', label: 'New', onPress: onGoToCreateService },
  ];

  useEffect(() => {
    const loadServices = async () => {
      try {
        setIsLoadingServices(true);
        setServicesError('');
        const response = await getAllServices();
        const rawServices = Array.isArray(response) ? response : [];

        const normalizedServices = rawServices.map((service) => ({
          id: service.id ?? service.Id ?? service.serviceId ?? service.ServiceId ?? '',
          title: service.title ?? service.Title ?? '',
          description: service.description ?? service.Description ?? '',
          amount: service.amount ?? service.Amount ?? 0,
          serviceType: service.serviceType ?? service.ServiceType ?? '',
          status: service.status ?? service.Status ?? '',
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

  const handleCandidate = async (serviceItem) => {
    const targetId = serviceItem?.id;

    if (!targetId) {
      Alert.alert('Atencao', 'Este servico nao possui ID disponivel para candidatura.');
      return;
    }

    try {
      setIsApplyingToServiceId(String(targetId));
      await candidateToService(targetId);
      Alert.alert('Sucesso', 'Candidatura enviada com sucesso.');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Falha ao enviar candidatura.';
      Alert.alert('Erro', errorMsg);
    } finally {
      setIsApplyingToServiceId('');
    }
  };

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
        <Text style={styles.title}>Encontre e gerencie servicos</Text>
        <Text style={styles.subtitle}>
          Use a busca para encontrar um servico ou adicionar um novo ao seu catalogo.
        </Text>

        <View style={styles.searchCard}>
          <Text style={styles.searchLabel}>Acoes rapidas</Text>
          <View style={styles.searchRow}>
            <View style={styles.searchInputWrapper}>
              <View style={styles.searchIcon} accessible={false}>
                <View style={styles.searchLens} />
                <View style={styles.searchHandle} />
              </View>
              <TextInput
                style={styles.searchInput}
                placeholder="ID do servico para abrir detalhes"
                placeholderTextColor="#8B95A7"
                value={serviceId}
                onChangeText={setServiceId}
              />
            </View>

            <View style={styles.quickActionsRow}>
              <TouchableOpacity
                style={styles.addServiceButton}
                onPress={() => onGoToServiceDetails?.(serviceId.trim())}
              >
                <Text style={styles.addServiceButtonText}>Servico</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryActionButton} onPress={onGoToCreateService}>
                <Text style={styles.secondaryActionButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.searchRow}>
            <View style={styles.quickActionsRow}>
              <TouchableOpacity style={styles.secondaryActionButton} onPress={onGoToNews}>
                <Text style={styles.secondaryActionButtonText}>Noticias</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Novos endpoints</Text>
          <Text style={styles.infoText}>
            Clique em `Seu perfil` na barra lateral para ver seus dados, ou use os atalhos para noticias, servico por ID e candidatura.
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
                {service.status ? (
                  <Text style={styles.serviceStatus}>Status: {service.status}</Text>
                ) : null}

                <View style={styles.serviceActions}>
                  <TouchableOpacity
                    style={[styles.serviceActionButton, !service.id && styles.serviceActionButtonDisabled]}
                    onPress={() => onGoToServiceDetails?.(service.id)}
                    disabled={!service.id}
                  >
                    <Text style={styles.serviceActionButtonText}>
                      {service.id ? 'Ver detalhes' : 'Sem ID'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.serviceSecondaryButton,
                      (!service.id || isApplyingToServiceId === String(service.id)) &&
                        styles.serviceActionButtonDisabled,
                    ]}
                    onPress={() => handleCandidate(service)}
                    disabled={!service.id || isApplyingToServiceId === String(service.id)}
                  >
                    <Text style={styles.serviceSecondaryButtonText}>
                      {isApplyingToServiceId === String(service.id) ? 'Enviando...' : 'Candidatar-se'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
