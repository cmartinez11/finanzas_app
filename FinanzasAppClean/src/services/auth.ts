import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'user_token';

/**
 * Guarda el token de acceso de manera segura.
 * @param token Token de acceso obtenido desde Laravel Sanctum
 */
export async function saveToken(token: string): Promise<void> {
    try {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
        console.error('Error al guardar el token:', error);
        throw error;
    }
}

/**
 * Recupera el token guardado.
 * @returns El token o null si no existe
 */
export async function getToken(): Promise<string | null> {
    try {
        return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
        console.error('Error al recuperar el token:', error);
        return null;
    }
}

/**
 * Elimina el token guardado.
 */
export async function removeToken(): Promise<void> {
    try {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
        console.error('Error al eliminar el token:', error);
        throw error;
    }
}
