import React, { useState, useCallback } from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    FlatList, 
    TouchableOpacity, 
    ActivityIndicator, 
    RefreshControl 
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getTransactions, TransactionResponse } from '../services/transactionService';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { useFocusEffect } from '@react-navigation/native';

type DashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

interface Props {
    navigation: DashboardScreenNavigationProp;
}

export default function DashboardScreen({ navigation }: Props) {
    const { signOut } = useAuth();
    const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [totals, setTotals] = useState({
        balance: 0,
        income: 0,
        expense: 0
    });

    const fetchTransactions = async () => {
        try {
            const data = await getTransactions();
            setTransactions(data);

            let income = 0;
            let expense = 0;

            data.forEach(item => {
                const amt = parseFloat(item.amount.toString());
                const isIncome = item.type === 'income' || item.type === 'ingreso';
                if (isIncome) {
                    income += amt;
                } else {
                    expense += amt;
                }
            });

            setTotals({
                income,
                expense,
                balance: income - expense
            });
        } catch (error) {
            console.error('Error al obtener transacciones:', error);
            setTransactions([]);
            setTotals({ income: 0, expense: 0, balance: 0 });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchTransactions();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchTransactions();
    };

    const formatCurrency = (value: number) => {
        return `$${value.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const renderTransactionItem = ({ item }: { item: TransactionResponse }) => {
        const isIncome = item.type === 'income' || item.type === 'ingreso';
        const formattedAmount = `${isIncome ? '+' : '-'}${formatCurrency(Math.abs(parseFloat(item.amount.toString())))}`;
        // Mostramos el título si existe; si no, la descripción.
        const displayName = item.title || item.description || 'Sin título';
        
        return (
            <View style={styles.transactionCard}>
                <View style={styles.transactionLeft}>
                    <View style={[styles.categoryBadge, { backgroundColor: isIncome ? '#0f5132' : '#842029' }]}>
                        <Text style={[styles.categoryText, { color: isIncome ? '#badbcc' : '#f8d7da' }]}>
                            {item.category ? item.category.substring(0, 1).toUpperCase() : 'T'}
                        </Text>
                    </View>
                    <View style={styles.transactionDetails}>
                        <Text style={styles.transactionDesc} numberOfLines={1}>{displayName}</Text>
                        <Text style={styles.transactionCategory}>{item.category || 'General'}</Text>
                    </View>
                </View>
                <View style={styles.transactionRight}>
                    <Text style={[styles.transactionAmount, { color: isIncome ? '#10b981' : '#ef4444' }]}>
                        {formattedAmount}
                    </Text>
                    <Text style={styles.transactionDate}>
                        {item.date || (item.created_at ? item.created_at.split('T')[0] : '')}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerSubtitle}>Bienvenido de nuevo</Text>
                    <Text style={styles.headerTitle}>Mi Resumen</Text>
                </View>
                <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
                    <Text style={styles.logoutButtonText}>Salir</Text>
                </TouchableOpacity>
            </View>

            {loading && !refreshing ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#6366f1" />
                </View>
            ) : (
                <View style={styles.content}>
                    {/* Tarjeta de Saldo Principal */}
                    <View style={styles.balanceCard}>
                        <Text style={styles.balanceLabel}>Saldo Neto Total</Text>
                        <Text style={[styles.balanceValue, { color: totals.balance >= 0 ? '#ffffff' : '#ef4444' }]}>
                            {formatCurrency(totals.balance)}
                        </Text>

                        <View style={styles.totalsContainer}>
                            <View style={styles.totalItem}>
                                <Text style={styles.totalLabel}>Ingresos</Text>
                                <Text style={styles.totalIncomeValue}>{formatCurrency(totals.income)}</Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.totalItem}>
                                <Text style={styles.totalLabel}>Gastos</Text>
                                <Text style={styles.totalExpenseValue}>{formatCurrency(totals.expense)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Lista de Transacciones */}
                    <Text style={styles.sectionTitle}>Últimos Movimientos</Text>
                    
                    <FlatList
                        data={transactions}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderTransactionItem}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor="#6366f1"
                                colors={['#6366f1']}
                            />
                        }
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No tienes transacciones registradas</Text>
                                <Text style={styles.emptySubtext}>Usa el botón flotante para agregar una nueva</Text>
                            </View>
                        }
                    />
                </View>
            )}

            {/* Botón Flotante */}
            <TouchableOpacity 
                style={styles.fab}
                onPress={() => navigation.navigate('AddTransaction')}
                activeOpacity={0.8}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    headerSubtitle: {
        color: '#8e8e93',
        fontSize: 14,
    },
    headerTitle: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    logoutButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#1e1e1e',
        borderWidth: 1,
        borderColor: '#333',
    },
    logoutButtonText: {
        color: '#ef4444',
        fontSize: 14,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    balanceCard: {
        backgroundColor: '#1e1e1e',
        borderRadius: 16,
        padding: 24,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: '#2e2e2e',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    balanceLabel: {
        color: '#a1a1aa',
        fontSize: 14,
        marginBottom: 5,
    },
    balanceValue: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    totalsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#2e2e2e',
        paddingTop: 15,
    },
    totalItem: {
        flex: 1,
    },
    totalLabel: {
        color: '#71717a',
        fontSize: 12,
        marginBottom: 2,
    },
    totalIncomeValue: {
        color: '#10b981',
        fontSize: 16,
        fontWeight: 'bold',
    },
    totalExpenseValue: {
        color: '#ef4444',
        fontSize: 16,
        fontWeight: 'bold',
    },
    divider: {
        width: 1,
        height: 30,
        backgroundColor: '#2e2e2e',
        marginHorizontal: 15,
    },
    sectionTitle: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    listContainer: {
        paddingBottom: 100,
    },
    transactionCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#262626',
    },
    transactionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    categoryBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    categoryText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    transactionDetails: {
        flex: 1,
    },
    transactionDesc: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
    },
    transactionCategory: {
        color: '#71717a',
        fontSize: 12,
    },
    transactionRight: {
        alignItems: 'flex-end',
        marginLeft: 10,
    },
    transactionAmount: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    transactionDate: {
        color: '#71717a',
        fontSize: 11,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 50,
    },
    emptyText: {
        color: '#a1a1aa',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 5,
    },
    emptySubtext: {
        color: '#71717a',
        fontSize: 13,
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#6366f1',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 8,
    },
    fabText: {
        color: '#ffffff',
        fontSize: 32,
        lineHeight: 34,
        fontWeight: '300',
    },
});
