import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from "../ApiUrl";
import { styles } from '../styles/registerUserStyle';

export default function RegisterScreen({ onRegisterSuccess, onGoToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpf, setCpf] = useState('');
  const [telephone, setTelephone] = useState('');

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !cpf.trim() || !telephone.trim()) {
      Alert.alert('Atencao', 'Por favor, preencha todos os campos do Frella!');
      return;
    }

    try {
      await api.post('Auth/Register', {
        name: name.trim(),
        email: email.trim(),
        password,
        cpf: cpf.trim(),
        telephone: telephone.trim(),
      });

      Alert.alert('Sucesso', 'Usuario criado com sucesso!');
      setName('');
      setEmail('');
      setPassword('');
      setCpf('');
      setTelephone('');
      onRegisterSuccess?.();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Falha ao registrar.';
      Alert.alert('Erro', errorMsg);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>Frella</Text>
        <Text style={styles.subtitle}>Crie a sua conta</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        value={name}
        onChangeText={setName}
      />

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
        placeholder="CPF"
        keyboardType="numeric"
        value={cpf}
        onChangeText={setCpf}
      />

      <TextInput
        style={styles.input}
        placeholder="Telefone"
        keyboardType="phone-pad"
        value={telephone}
        onChangeText={setTelephone}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrar no Frella</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Ja tem conta?{' '}
        <Text style={styles.linkText} onPress={onGoToLogin}>
          Entrar
        </Text>
      </Text>
    </View>
  );
}
