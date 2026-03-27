import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { getUserById } from '../AuthService';
import LateralBar from '../components/LateralBar';
import { styles } from '../styles/detailScreenStyle';

const normalizeUser = (user) => ({
  name: user?.name ?? user?.Name ?? '',
  email: user?.email ?? user?.Email ?? '',
  cpf: user?.cpf ?? user?.Cpf ?? '',
  telephone: user?.telephone ?? user?.Telephone ?? '',
});

export default function UserDetailsScreen({
  onLogout,
  navigationItems,
  onProfilePress,
}) {
  const [userData, setUserData] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [userError, setUserError] = useState('');

  const loadUser = async () => {
    try {
      setIsLoadingUser(true);
      setUserError('');
      const response = await getUserById();
      setUserData(normalizeUser(response));
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Falha ao carregar os dados do usuario.';
      setUserError(errorMsg);
      setUserData(null);
    } finally {
      setIsLoadingUser(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

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
        <Text style={styles.title}>Meu perfil</Text>
        <Text style={styles.subtitle}>
          Esta tela mostra apenas os dados do usuario autenticado.
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Dados da conta</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.primaryButton, styles.flexButton, isLoadingUser && styles.primaryButtonDisabled]}
              onPress={loadUser}
              disabled={isLoadingUser}
            >
              <Text style={styles.primaryButtonText}>
                {isLoadingUser ? 'Atualizando...' : 'Atualizar dados'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Dados do usuario</Text>

          {isLoadingUser ? (
            <View style={styles.statusBox}>
              <ActivityIndicator size="large" color="#2C8C99" />
              <Text style={styles.statusText}>Carregando usuario...</Text>
            </View>
          ) : userError ? (
            <View style={styles.statusBox}>
              <Text style={styles.errorText}>{userError}</Text>
            </View>
          ) : !userData ? (
            <View style={styles.statusBox}>
              <Text style={styles.statusText}>Nenhum usuario carregado.</Text>
            </View>
          ) : (
            <>
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>Nome</Text>
                <Text style={styles.fieldValue}>{userData.name || 'Nao informado'}</Text>
              </View>
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>Email</Text>
                <Text style={styles.fieldValue}>{userData.email || 'Nao informado'}</Text>
              </View>
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>CPF</Text>
                <Text style={styles.fieldValue}>{userData.cpf || 'Nao informado'}</Text>
              </View>
              <View style={styles.fieldBlock}>
                <Text style={styles.fieldLabel}>Telefone</Text>
                <Text style={styles.fieldValue}>{userData.telephone || 'Nao informado'}</Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
