import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from '../ApiUrl';
import { saveAccessToken } from '../tokenService';
import { styles } from '../styles/loginStyle';

export default function LoginScreen({ onGoToRegister, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha email e senha.');
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
      Alert.alert('Sucesso', 'Login realizado com sucesso!');
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
      <View style={styles.headerSection}>
        <Text style={styles.title}>Frella</Text>
        <Text style={styles.subtitle}>Entre na sua conta</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar no Frella</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Ainda não tem conta?{' '}
        <Text style={styles.linkText} onPress={onGoToRegister}>
          Registe-se
        </Text>
      </Text>
    </View>
  );
}
