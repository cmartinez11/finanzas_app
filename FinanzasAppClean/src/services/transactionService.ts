import api from './api';

export interface TransactionData {
    title: string;
    amount: number;
    type: 'income' | 'expense' | 'ingreso' | 'gasto';
    category: string;
    description?: string;
    date?: string;
}

export interface TransactionResponse {
    id: number | string;
    title?: string;
    description?: string;
    amount: number | string;
    type: 'income' | 'expense' | 'ingreso' | 'gasto';
    category: string;
    date: string;
    created_at?: string;
}

/**
 * Obtiene el listado de transacciones financieras.
 */
export async function getTransactions(): Promise<TransactionResponse[]> {
    try {
        const response = await api.get<TransactionResponse[]>('/transactions');
        return response.data;
    } catch (error) {
        console.error('Error en getTransactions:', error);
        throw error;
    }
}

/**
 * Crea una nueva transacción financiera.
 * Envía tanto 'title' como 'description' para garantizar compatibilidad con el backend.
 */
export async function createTransaction(data: TransactionData): Promise<TransactionResponse> {
    try {
        const payload = {
            title: data.title,
            description: data.description || data.title, // Enviamos ambos para cubrir campos del backend
            amount: data.amount,
            type: data.type,
            category: data.category,
            date: data.date || new Date().toISOString().split('T')[0]
        };
        const response = await api.post<TransactionResponse>('/transactions', payload);
        return response.data;
    } catch (error) {
        console.error('Error en createTransaction:', error);
        throw error;
    }
}
