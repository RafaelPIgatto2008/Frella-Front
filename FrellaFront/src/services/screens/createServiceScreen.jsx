import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, View } from 'react-native';
import LateralBar from '../components/LateralBar';
import MotionButton from '../components/MotionButton';
import { createService } from '../Services';
import { styles } from '../styles/createServiceStyle';

const serviceTypeOptions = [
  { label: 'Easy', value: 0 },
  { label: 'Medium', value: 1 },
  { label: 'Hard', value: 2 },
  { label: 'Extreme', value: 3 },
];

export default function CreateServiceScreen({
  onBackHome,
  onLogout,
  onGoToServices,
  onGoToUserDetails,
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [serviceType, setServiceType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigationItems = [
    { icon: 'H', label: 'Home', onPress: onBackHome },
    { icon: 'S', label: 'Services', onPress: onGoToServices },
    { icon: '+', label: 'New', active: true, onPress: () => {} },
  ];

  const handleCreateService = async () => {
    if (!title.trim() || !description.trim() || !amount.trim() || serviceType === null) {
      Alert.alert('Atencao', 'Preencha todos os campos do servico.');
      return;
    }

    const parsedAmount = Number(amount.replace(',', '.'));

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Atencao', 'Informe um preco valido maior que zero.');
      return;
    }

    try {
      setIsSubmitting(true);

      await createService({
        title: title.trim(),
        description: description.trim(),
        amount: parsedAmount,
        serviceType,
      });

      Alert.alert('Sucesso', 'Servico criado com sucesso!');
      setTitle('');
      setDescription('');
      setAmount('');
      setServiceType(null);
      onBackHome?.();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Falha ao criar servico.';
      Alert.alert('Erro', errorMsg);
    } finally {
      setIsSubmitting(false);
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
        <Text style={styles.title}>Criar servico</Text>
        <Text style={styles.subtitle}>
          Cadastre um novo servico para deixar seu catalogo pronto para divulgacao.
        </Text>

        <View style={styles.formCard}>
          <Text style={styles.label}>Titulo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Manutencao residencial"
            placeholderTextColor="#8B95A7"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Descricao</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descreva o servico oferecido"
            placeholderTextColor="#8B95A7"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />

          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 150.00"
            placeholderTextColor="#8B95A7"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <Text style={styles.label}>ServiceType</Text>
          <View style={styles.serviceTypeGrid}>
            {serviceTypeOptions.map((option) => (
              <MotionButton
                key={option.value}
                style={[
                  styles.serviceTypeOption,
                  serviceType === option.value && styles.serviceTypeOptionSelected,
                ]}
                onPress={() => setServiceType(option.value)}
              >
                <Text
                  style={[
                    styles.serviceTypeOptionText,
                    serviceType === option.value && styles.serviceTypeOptionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </MotionButton>
            ))}
          </View>

          <View style={styles.actions}>
            <MotionButton style={styles.secondaryButton} onPress={onBackHome}>
              <Text style={styles.secondaryButtonText}>Cancelar</Text>
            </MotionButton>

            <MotionButton
              style={[styles.primaryButton, isSubmitting && styles.primaryButtonDisabled]}
              onPress={handleCreateService}
              disabled={isSubmitting}
              disabledStyle={styles.primaryButtonDisabled}
            >
              <Text style={styles.primaryButtonText}>
                {isSubmitting ? 'Criando...' : 'Criar servico'}
              </Text>
            </MotionButton>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
