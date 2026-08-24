import React, { createContext, useState, useEffect, useContext } from 'react';
import { getToken, saveToken, removeToken } from '../services/auth';

interface AuthContextType {
    userToken: string | null;
    isLoading: boolean;
    signIn: (token: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadToken = async () => {
            try {
                const token = await getToken();
                setUserToken(token);
            } catch (e) {
                console.error('Error cargando el token:', e);
            } finally {
                setIsLoading(false);
            }
        };
        loadToken();
    }, []);

    const signIn = async (token: string) => {
        setIsLoading(true);
        try {
            await saveToken(token);
            setUserToken(token);
        } catch (e) {
            console.error('Error guardando el token:', e);
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = async () => {
        setIsLoading(true);
        try {
            await removeToken();
            setUserToken(null);
        } catch (e) {
            console.error('Error eliminando el token:', e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ userToken, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};
