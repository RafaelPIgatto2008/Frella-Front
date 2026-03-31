import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import MotionButton from '../components/MotionButton';
import { getAllServices } from '../Services';
import { styles } from '../styles/landingStyle';

const normalizeService = (service) => ({
  id: service?.id ?? service?.Id ?? service?.serviceId ?? service?.ServiceId ?? '',
  title: service?.title ?? service?.Title ?? 'Servico sem titulo',
  description: service?.description ?? service?.Description ?? 'Descricao nao informada.',
  amount: service?.amount ?? service?.Amount ?? 0,
  serviceType: service?.serviceType ?? service?.ServiceType ?? '',
  status: service?.status ?? service?.Status ?? '',
});

export default function LandingScreen({
  onGoToLogin,
  onGoToRegister,
}) {
  const [services, setServices] = useState([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [servicesError, setServicesError] = useState('');

  const loadServices = async () => {
    try {
      setIsLoadingServices(true);
      setServicesError('');
      const response = await getAllServices();
      const rawServices = Array.isArray(response) ? response : [];
      setServices(rawServices.map(normalizeService));
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Falha ao carregar os servicos publicos.';
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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.backgroundOrbPrimary} />
      <View style={styles.backgroundOrbSecondary} />

      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.brandPill}>
            <Text style={styles.brandPillText}>Frella</Text>
          </View>

          <View style={styles.heroActions}>
            <MotionButton style={styles.secondaryButton} onPress={onGoToLogin}>
              <Text style={styles.secondaryButtonText}>Entrar</Text>
            </MotionButton>
            <MotionButton style={styles.primaryButton} onPress={onGoToRegister}>
              <Text style={styles.primaryButtonText}>Criar conta</Text>
            </MotionButton>
          </View>
        </View>

        <Text style={styles.heroTitle}>Conecte pessoas aos melhores servicos da sua rede</Text>
        <Text style={styles.heroSubtitle}>
          O Frella e uma plataforma para publicar servicos, encontrar profissionais e organizar
          a conexao entre quem oferece trabalho e quem quer executar. Antes do login, voce pode
          conhecer o projeto e navegar pelos servicos que ja foram publicados na plataforma.
        </Text>

        <View style={styles.heroStatsRow}>
          <View style={styles.heroStatCard}>
            <Text style={styles.heroStatValue}>{services.length}</Text>
            <Text style={styles.heroStatLabel}>Servicos visiveis</Text>
          </View>
          <View style={styles.heroStatCard}>
            <Text style={styles.heroStatValue}>24h</Text>
            <Text style={styles.heroStatLabel}>Acesso rapido</Text>
          </View>
          <View style={styles.heroStatCard}>
            <Text style={styles.heroStatValue}>100%</Text>
            <Text style={styles.heroStatLabel}>Catalogo online</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionEyebrow}>Catalogo publico</Text>
          <Text style={styles.sectionTitle}>Servicos disponiveis agora</Text>
        </View>

        <MotionButton style={styles.refreshButton} onPress={loadServices}>
          <Text style={styles.refreshButtonText}>Atualizar</Text>
        </MotionButton>
      </View>

      <View style={styles.explanationCard}>
        <Text style={styles.explanationTitle}>Por que estes servicos aparecem aqui?</Text>
        <Text style={styles.explanationText}>
          Esta area funciona como uma vitrine publica do projeto. Ela existe para que novos usuarios
          entendam rapidamente o tipo de oportunidade que circula no Frella, conhecam a plataforma antes
          de criar uma conta e percebam que ja existe atividade real no sistema.
        </Text>
        <Text style={styles.explanationText}>
          Depois do login, o usuario consegue acessar os detalhes completos, se candidatar, criar novos
          servicos e gerenciar candidatos de forma privada dentro da aplicacao.
        </Text>
      </View>

      {isLoadingServices ? (
        <View style={styles.statusCard}>
          <ActivityIndicator size="large" color="#2C8C99" />
          <Text style={styles.statusText}>Carregando servicos...</Text>
        </View>
      ) : servicesError ? (
        <View style={styles.statusCard}>
          <Text style={styles.errorText}>{servicesError}</Text>
        </View>
      ) : services.length === 0 ? (
        <View style={styles.statusCard}>
          <Text style={styles.statusText}>Nenhum servico publico encontrado no momento.</Text>
        </View>
      ) : (
        <View style={styles.servicesGrid}>
          {services.map((service, index) => (
            <View key={`${service.id || service.title}-${index}`} style={styles.serviceCard}>
              <View style={styles.serviceHeader}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                {service.serviceType ? (
                  <Text style={styles.serviceBadge}>{String(service.serviceType)}</Text>
                ) : null}
              </View>

              <Text style={styles.serviceDescription}>{service.description}</Text>

              <View style={styles.serviceMetaRow}>
                <Text style={styles.serviceAmount}>R$ {Number(service.amount || 0).toFixed(2)}</Text>
                <Text style={styles.serviceStatus}>{service.status || 'Publicado'}</Text>
              </View>

              <View style={styles.serviceFooter}>
                <Text style={styles.serviceFooterText}>Entre para ver mais detalhes e interagir com o servico.</Text>
                <MotionButton style={styles.cardActionButton} onPress={onGoToLogin}>
                  <Text style={styles.cardActionButtonText}>Entrar para acessar</Text>
                </MotionButton>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
