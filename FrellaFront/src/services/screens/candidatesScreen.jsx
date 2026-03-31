import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, View } from 'react-native';
import LateralBar from '../components/LateralBar';
import MotionButton from '../components/MotionButton';
import { aproveCandidate, getAllCandidatesFromService } from '../Services';
import { styles } from '../styles/detailScreenStyle';

const normalizeCandidate = (candidate) => ({
  id: candidate?.id ?? candidate?.Id ?? candidate?.candidateId ?? candidate?.CandidateId ?? candidate?.userId ?? candidate?.UserId ?? '',
  name: candidate?.name ?? candidate?.Name ?? candidate?.userName ?? candidate?.UserName ?? '',
  telephone: candidate?.telephone ?? candidate?.Telephone ?? '',
  photoUrl: candidate?.photoUrl ?? candidate?.PhotoUrl ?? candidate?.imageUrl ?? candidate?.ImageUrl ?? candidate?.profilePicture ?? candidate?.ProfilePicture ?? '',
});

const getCandidateInitials = (name) => {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) {
    return 'CS';
  }

  return parts.map((part) => part[0]?.toUpperCase() ?? '').join('');
};

const isAlreadyRegisteredInServiceError = (error) => {
  const errorMessage = String(
    error?.response?.data?.message
    ?? error?.response?.data
    ?? error?.message
    ?? '',
  ).toLowerCase();

  return (
    errorMessage.includes('already registered') ||
    errorMessage.includes('already exists') ||
    errorMessage.includes('already approved') ||
    errorMessage.includes('ja cadastrado') ||
    errorMessage.includes('já cadastrado') ||
    errorMessage.includes('ja registrado') ||
    errorMessage.includes('já registrado')
  );
};

const wait = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

export default function CandidatesScreen({
  onLogout,
  navigationItems,
  initialServiceId = '',
  initialServiceTitle = '',
  onProfilePress,
  onCandidateApproved,
}) {
  const [candidates, setCandidates] = useState([]);
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(Boolean(initialServiceId));
  const [candidatesError, setCandidatesError] = useState('');
  const [approvingCandidateId, setApprovingCandidateId] = useState('');
  const [approvalMessage, setApprovalMessage] = useState('');

  const loadCandidates = async (serviceId) => {
    if (!String(serviceId || '').trim()) {
      setCandidates([]);
      setCandidatesError('Informe um servico valido para ver os candidatos.');
      return;
    }

    try {
      setIsLoadingCandidates(true);
      setCandidatesError('');
      const response = await getAllCandidatesFromService(String(serviceId).trim());
      const rawCandidates = Array.isArray(response) ? response : [];
      setCandidates(rawCandidates.map(normalizeCandidate));
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Falha ao carregar os candidatos do servico.';
      setCandidatesError(errorMsg);
      setCandidates([]);
    } finally {
      setIsLoadingCandidates(false);
    }
  };

  useEffect(() => {
    if (initialServiceId) {
      loadCandidates(initialServiceId);
    }
  }, [initialServiceId]);

  const handleApproveCandidate = async (candidate) => {
    const serviceId = String(initialServiceId || '').trim();
    const userId = String(candidate?.id || '').trim();

    if (!serviceId) {
      Alert.alert('Atencao', 'Nenhum servico foi carregado para aprovacao.');
      return;
    }

    if (!userId) {
      Alert.alert('Atencao', 'Nao foi possivel identificar este candidato.');
      return;
    }

    try {
      setApprovingCandidateId(String(candidate?.id || userId));
      setApprovalMessage('');
      await aproveCandidate(serviceId, userId);
      setApprovalMessage('O candidato foi aprovado.');
      await loadCandidates(serviceId);
      await wait(1000);
      onCandidateApproved?.(serviceId);
    } catch (error) {
      if (isAlreadyRegisteredInServiceError(error)) {
        Alert.alert('Aviso', 'Este usuario ja esta registrado neste servico.');
        await loadCandidates(serviceId);
        return;
      }

      const errorMsg = error.response?.data?.message || 'Falha ao aprovar o candidato.';
      Alert.alert('Erro', errorMsg);
    } finally {
      setApprovingCandidateId('');
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
        <Text style={styles.title}>Candidatos do servico</Text>
        <Text style={styles.subtitle}>
          Veja todos os candidatos vinculados ao seu servico
          {initialServiceTitle ? ` "${initialServiceTitle}".` : '.'}
        </Text>

        <View style={styles.heroBanner}>
          <View style={styles.heroAccent} />
          <View style={styles.heroContent}>
            <Text style={styles.heroEyebrow}>Selecao de talentos</Text>
            <Text style={styles.heroTitle}>Escolha quem vai assumir o servico</Text>
            <Text style={styles.heroDescription}>
              Compare os perfis, confira o telefone e aprove o candidato certo com um toque.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Lista de candidatos</Text>

          {approvalMessage ? (
            <View style={styles.successBox}>
              <Text style={styles.successText}>{approvalMessage}</Text>
            </View>
          ) : null}

          {isLoadingCandidates ? (
            <View style={styles.statusBox}>
              <ActivityIndicator size="large" color="#2C8C99" />
              <Text style={styles.statusText}>Carregando candidatos...</Text>
            </View>
          ) : candidatesError ? (
            <View style={styles.statusBox}>
              <Text style={styles.errorText}>{candidatesError}</Text>
            </View>
          ) : candidates.length === 0 ? (
            <View style={styles.statusBox}>
              <Text style={styles.statusText}>Nenhum candidato encontrado para este servico.</Text>
            </View>
          ) : (
            candidates.map((candidate, index) => (
              <View key={`${candidate.name || 'candidate'}-${index}`} style={styles.itemCard}>
                <View style={styles.candidateTopRow}>
                  <View style={styles.candidateIdentityRow}>
                    {candidate.photoUrl ? (
                      <Image source={{ uri: candidate.photoUrl }} style={styles.candidatePhoto} />
                    ) : (
                      <View style={styles.candidateAvatarFallback}>
                        <Text style={styles.candidateAvatarText}>{getCandidateInitials(candidate.name)}</Text>
                      </View>
                    )}

                    <View style={styles.candidateTextBlock}>
                      <Text style={styles.itemTitle}>{candidate.name || 'Candidato sem nome'}</Text>
                      <View style={styles.candidateBadge}>
                        <Text style={styles.candidateBadgeText}>Disponivel para aprovacao</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.candidateInfoPanel}>
                  <Text style={styles.candidateInfoLabel}>Telefone</Text>
                  <Text style={styles.itemDescription}>
                    {candidate.telephone || 'Telefone nao informado'}
                  </Text>
                </View>

                <View style={styles.actionsRow}>
                  <MotionButton
                    style={[
                      styles.primaryButton,
                      styles.approveButton,
                      approvingCandidateId === String(candidate.id) && styles.primaryButtonDisabled,
                    ]}
                    onPress={() => handleApproveCandidate(candidate)}
                    disabled={approvingCandidateId === String(candidate.id)}
                    disabledStyle={styles.primaryButtonDisabled}
                  >
                    <Text style={styles.primaryButtonText}>
                      {approvingCandidateId === String(candidate.id) ? 'Aprovando...' : 'Aprovar'}
                    </Text>
                  </MotionButton>
                </View>
              </View>
            ))
          )}

          <View style={styles.actionsRow}>
            <MotionButton
              style={[styles.secondaryButton, styles.flexButton]}
              onPress={() => loadCandidates(initialServiceId)}
            >
              <Text style={styles.secondaryButtonText}>Atualizar candidatos</Text>
            </MotionButton>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
