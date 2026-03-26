import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/homeStyle';

export default function HomeScreen({ onLogout }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.subtitle}>Login realizado com sucesso.</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}
