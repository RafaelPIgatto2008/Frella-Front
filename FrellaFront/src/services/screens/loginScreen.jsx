import React, { useState } from 'react';
import { Alert, Text, TextInput, View } from 'react-native';
import api from '../ApiUrl';
import MotionButton from '../components/MotionButton';
import { saveAccessToken } from '../tokenService';
import { styles } from '../styles/loginStyle';

export default function LoginScreen({ onGoToRegister, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Atencao', 'Por favor, preencha email e senha.');
      return;
    }

    try {
      const response = await api.post('Auth/Login', { email, password });
      const accessToken =
        response.data?.accessToken || response.data?.token || response.data?.jwt;

      if (!accessToken) {
        Alert.alert('Erro', 'Login realizado, mas o access token nao foi retornado.');
        return;
      }

      await saveAccessToken(accessToken);
      Alert.alert('Sucesso', 'Login realizado com sucesso.');
      setEmail('');
      setPassword('');
      onLoginSuccess?.();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Falha ao realizar login.';
      Alert.alert('Erro', errorMsg);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundOrbPrimary} />
      <View style={styles.backgroundOrbSecondary} />

      <View style={styles.authCard}>
        <View style={styles.brandPill}>
          <Text style={styles.brandPillText}>Frella Platform</Text>
        </View>

        <View style={styles.headerSection}>
          <Text style={styles.title}>Entre no Frella</Text>
          <Text style={styles.subtitle}>
            Gerencie servicos, acompanhe candidatos e mantenha sua operacao organizada em um unico painel.
          </Text>
        </View>

        <View style={styles.highlightPanel}>
          <Text style={styles.highlightEyebrow}>Acesso rapido</Text>
          <Text style={styles.highlightTitle}>Seu espaco de trabalho pronto para operar</Text>
          <Text style={styles.highlightText}>
            Entre para abrir seus servicos, revisar candidatos e aprovar usuarios com mais rapidez.
          </Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#7D91A4"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#7D91A4"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <MotionButton style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar no Frella</Text>
        </MotionButton>

        <Text style={styles.footerText}>
          Ainda nao tem conta?{' '}
          <Text style={styles.linkText} onPress={onGoToRegister}>
            Registre-se
          </Text>
        </Text>
      </View>
    </View>
  );
}
