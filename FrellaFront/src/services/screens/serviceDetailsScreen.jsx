import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import LateralBar from '../components/LateralBar';
import { candidateToService, getServiceById } from '../Services';
import { styles } from '../styles/detailScreenStyle';

const normalizeService = (service) => ({
  id: service?.id ?? service?.Id ?? '',
  title: service?.title ?? service?.Title ?? '',
  description: service?.description ?? service?.Description ?? '',
  amount: service?.amount ?? service?.Amount ?? 0,
  serviceType: service?.serviceType ?? service?.ServiceType ?? '',
  status: service?.status ?? service?.Status ?? '',
  telephone: service?.telephone ?? service?.Telephone ?? '',
  userName: service?.userName ?? service?.UserName ?? '',
  publishAt: service?.publishAt ?? service?.PublishAt ?? '',
});

export default function ServiceDetailsScreen({
  onLogout,
  navigationItems,
  initialServiceId = '',
  onProfilePress,
}) {
  const [serviceData, setServiceData] = useState(null);
  const [isLoadingService, setIsLoadingService] = useState(Boolean(initialServiceId));
  const [isApplying, setIsApplying] = useState(false);
  const [serviceError, setServiceError] = useState('');

  const loadService = async (targetId) => {
    if (!targetId.trim()) {
      setServiceError('Informe um ID de servico.');
      setServiceData(null);
      return;
    }

    try {
      setIsLoadingService(true);
      setServiceError('');
      const response = await getServiceById(targetId.trim());
      const normalizedService = normalizeService(response);
      setServiceData(normalizedService);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Falha ao carregar o servico.';
      setServiceError(errorMsg);
      setServiceData(null);
    } finally {
      setIsLoadingService(false);
    }
  };

  useEffect(() => {
    if (initialServiceId) {
      loadService(String(initialServiceId));
    }
  }, [initialServiceId]);

  const handleCandidate = async () => {
    const targetId = initialServiceId;

    if (!targetId) {
      Alert.alert('Atencao', 'Carregue um servico antes de se candidatar.');
      return;
    }

    try {
      setIsApplying(true);
      await candidateToService(targetId);
      Alert.alert('Sucesso', 'Candidatura enviada com sucesso.');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Falha ao enviar candidatura.';
      Alert.alert('Erro', errorMsg);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <View style={styles.container}>
      <LateralBar
        profileInitials="RP"
        profileName="User"
        profileRole="Seu perfil"
        navigationItems={navigationItems}
        onProfilePress={onProfilePress}
        onLogout={onLogout}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Detalhes do servico</Text>
        <Text style={styles.subtitle}>
          Consulte os dados completos do servico e dispare a candidatura a partir da tela de detalhes.
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Dados do servico</Text>

          {isLoadingService ? (
            <View style={styles.statusBox}>
              <ActivityIndicator size="large" color="#2C8C99" />
              <Text style={styles.statusText}>Carregando servico...</Text>
            </View>
          ) : serviceError ? (
            <View style={styles.statusBox}>
              <Text style={styles.errorText}>{serviceError}</Text>
            </View>
          ) : !serviceData ? (
            <View style={styles.statusBox}>
              <Text style={styles.statusText}>Nenhum servico carregado.</Text>
            </View>
          ) : (
            <>
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>Titulo</Text>
                <Text style={styles.fieldValue}>{serviceData.title || 'Nao informado'}</Text>
              </View>
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>Descricao</Text>
                <Text style={styles.fieldValue}>{serviceData.description || 'Nao informado'}</Text>
              </View>
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>Valor</Text>
                <Text style={styles.fieldValue}>R$ {Number(serviceData.amount || 0).toFixed(2)}</Text>
              </View>
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>Tipo</Text>
                <Text style={styles.fieldValue}>{String(serviceData.serviceType || 'Nao informado')}</Text>
              </View>
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>Status</Text>
                <Text style={styles.fieldValue}>{serviceData.status || 'Nao informado'}</Text>
              </View>
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>Telefone</Text>
                <Text style={styles.fieldValue}>{serviceData.telephone || 'Nao informado'}</Text>
              </View>
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>Usuario</Text>
                <Text style={styles.fieldValue}>{serviceData.userName || 'Nao informado'}</Text>
              </View>
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>Publicado em</Text>
                <Text style={styles.fieldValue}>{serviceData.publishAt || 'Nao informado'}</Text>
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={[styles.primaryButton, styles.flexButton, isApplying && styles.primaryButtonDisabled]}
                  onPress={handleCandidate}
                  disabled={isApplying}
                >
                  <Text style={styles.primaryButtonText}>
                    {isApplying ? 'Enviando...' : 'Candidatar-se'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
