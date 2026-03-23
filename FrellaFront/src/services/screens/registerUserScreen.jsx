import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, TouchableOpacity } from 'react-native';
import api from "../ApiUrl";
import { styles } from '../styles/registerUserStyle';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cpf, setCpf] = useState('');

    const handleRegister = async () => {
        if (!name.trim() || !email.trim() || !password.trim() || !cpf.trim()) {
            Alert.alert("Atenção", "Por favor, preencha todos os campos do Frella!");
            return;
        }

        try {
            const userData = {
                name: name,
                email: email,
                password: password,
                cpf: cpf
            };

            await api.post("Auth/Register", userData);
            
            Alert.alert("Sucesso", "Usuário criado com sucesso!");
            
            setName('');
            setEmail('');
            setPassword('');
            setCpf('');

        } catch (error) {
            const errorMsg = error.response?.data?.message || "Falha ao registar.";
            Alert.alert("Erro", errorMsg);
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
                placeholder="Nome Completo"
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
                placeholder="CPF (Apenas números)"
                keyboardType="numeric"
                value={cpf}
                onChangeText={setCpf}
            />

            <TextInput 
                style={styles.input}
                placeholder="Senha"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Registar no Frella</Text>
            </TouchableOpacity>
        </View>
    );
}