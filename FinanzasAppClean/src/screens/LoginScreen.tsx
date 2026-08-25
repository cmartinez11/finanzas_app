import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    ImageBackground,
    Image
} from 'react-native';
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
            Alert.alert('Error', error.message || 'No se pudo conectar al servidor');
        }
    };

    return (
        <ImageBackground
            source={require('../assets/fondo.jpg')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Logo de la App */}
                    <Image
                        source={require('../assets/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />

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

                {/* Footer Corporativo */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>FEMS PERU EIRL Todos los derechos reservados</Text>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    container: {
        width: '85%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 220,
        height: 220,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: 'rgba(30, 30, 30, 0.85)',
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
    footer: {
        position: 'absolute',
        bottom: 30,
        alignItems: 'center',
    },
    footerText: {
        color: '#71717a',
        fontSize: 12,
        textAlign: 'center',
        fontWeight: '500',
    },
});