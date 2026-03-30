import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import LateralBar from '../components/LateralBar';
import { getAllCandidatesFromService } from '../Services';
import { styles } from '../styles/detailScreenStyle';

const normalizeCandidate = (candidate) => ({
  name: candidate?.name ?? candidate?.Name ?? candidate?.userName ?? candidate?.UserName ?? '',
  telephone: candidate?.telephone ?? candidate?.Telephone ?? '',
});

export default function CandidatesScreen({
  onLogout,
  navigationItems,
  initialServiceId = '',
  initialServiceTitle = '',
  onProfilePress,
}) {
  const [candidates, setCandidates] = useState([]);
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(Boolean(initialServiceId));
  const [candidatesError, setCandidatesError] = useState('');

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

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Lista de candidatos</Text>

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
                <Text style={styles.itemTitle}>{candidate.name || 'Candidato sem nome'}</Text>
                {candidate.telephone ? <Text style={styles.itemDescription}>Telefone: {candidate.telephone}</Text> : null}
              </View>
            ))
          )}

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.secondaryButton, styles.flexButton]}
              onPress={() => loadCandidates(initialServiceId)}
            >
              <Text style={styles.secondaryButtonText}>Atualizar candidatos</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
