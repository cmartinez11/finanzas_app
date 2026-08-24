import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

// Importar pantallas
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';

export type RootStackParamList = {
    Login: undefined;
    Dashboard: undefined;
    AddTransaction: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigation() {
    const { userToken, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4f46e5" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#1e1e1e',
                    },
                    headerTintColor: '#ffffff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    contentStyle: {
                        backgroundColor: '#121212',
                    },
                }}
            >
                {userToken === null ? (
                    // Flujo de autenticación
                    <Stack.Screen 
                        name="Login" 
                        component={LoginScreen} 
                        options={{ headerShown: false }}
                    />
                ) : (
                    // Flujo principal
                    <>
                        <Stack.Screen 
                            name="Dashboard" 
                            component={DashboardScreen} 
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen 
                            name="AddTransaction" 
                            component={AddTransactionScreen} 
                            options={{ 
                                title: 'Nueva Transacción',
                                headerBackTitleVisible: false,
                            }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        backgroundColor: '#121212',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
