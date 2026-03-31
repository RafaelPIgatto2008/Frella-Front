import React, { useState } from 'react';
import { Alert, Text, TextInput, View } from 'react-native';
import api from '../ApiUrl';
import MotionButton from '../components/MotionButton';
import { styles } from '../styles/registerUserStyle';

export default function RegisterScreen({ onRegisterSuccess, onGoToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpf, setCpf] = useState('');
  const [telephone, setTelephone] = useState('');

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !cpf.trim() || !telephone.trim()) {
      Alert.alert('Atencao', 'Por favor, preencha todos os campos do Frella.');
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

      Alert.alert('Sucesso', 'Usuario criado com sucesso.');
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
      <View style={styles.backgroundOrbPrimary} />
      <View style={styles.backgroundOrbSecondary} />

      <View style={styles.authCard}>
        <View style={styles.brandPill}>
          <Text style={styles.brandPillText}>Frella Platform</Text>
        </View>

        <View style={styles.headerSection}>
          <Text style={styles.title}>Crie sua conta</Text>
          <Text style={styles.subtitle}>
            Monte seu perfil para publicar servicos, acompanhar oportunidades e gerenciar a sua rede.
          </Text>
        </View>

        <View style={styles.highlightPanel}>
          <Text style={styles.highlightEyebrow}>Novo cadastro</Text>
          <Text style={styles.highlightTitle}>Comece com um perfil completo e pronto para uso</Text>
          <Text style={styles.highlightText}>
            Preencha seus dados para liberar o acesso ao painel principal do Frella.
          </Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          placeholderTextColor="#7D91A4"
          value={name}
          onChangeText={setName}
        />

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
          placeholder="CPF"
          placeholderTextColor="#7D91A4"
          keyboardType="numeric"
          value={cpf}
          onChangeText={setCpf}
        />

        <TextInput
          style={styles.input}
          placeholder="Telefone"
          placeholderTextColor="#7D91A4"
          keyboardType="phone-pad"
          value={telephone}
          onChangeText={setTelephone}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#7D91A4"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <MotionButton style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrar no Frella</Text>
        </MotionButton>

        <Text style={styles.footerText}>
          Ja tem conta?{' '}
          <Text style={styles.linkText} onPress={onGoToLogin}>
            Entrar
          </Text>
        </Text>
      </View>
    </View>
  );
}
