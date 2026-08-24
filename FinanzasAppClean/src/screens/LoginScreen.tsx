import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signIn } = useAuth();

    const handleLogin = async () => {
        try {
            const response = await api.post('/login', {
                email,
                password,
            });

            const token = response.data.token || response.data.access_token || response.data.plainTextToken;
            if (!token) {
                Alert.alert('Error', 'No se recibió un token válido del servidor.');
                return;
            }

            await signIn(token);
            console.log('Login exitoso y token almacenado.');
        } catch (error: any) {

            console.log('Error de red o Axios completo:', error.message);
            console.log('Configuración de la petición:', error.config);
            if (error.request) {
                console.log('No hubo respuesta del servidor (Error de red/IP/Puerto):', error.request);
            }
            Alert.alert('Error', error.message || 'No se pudo conectar al servidor');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Finanzas App</Text>

            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Ingresar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#1e1e1e',
        borderRadius: 8,
        paddingHorizontal: 15,
        color: '#fff',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#333',
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#4f46e5',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});