import React, { useState } from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    TextInput, 
    TouchableOpacity, 
    ScrollView, 
    ActivityIndicator, 
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { createTransaction } from '../services/transactionService';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

type AddTransactionScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddTransaction'>;

interface Props {
    navigation: AddTransactionScreenNavigationProp;
}

export default function AddTransactionScreen({ navigation }: Props) {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);

    const incomeCategories = ['Sueldo', 'Venta', 'Inversión', 'Regalo', 'Otros'];
    const expenseCategories = ['Comida', 'Transporte', 'Alquiler', 'Servicios', 'Diversión', 'Otros'];

    const handleSave = async () => {
        if (!title.trim()) {
            Alert.alert('Error de validación', 'Por favor ingresa un título.');
            return;
        }
        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            Alert.alert('Error de validación', 'Por favor ingresa un monto válido mayor a 0.');
            return;
        }
        if (!category.trim()) {
            Alert.alert('Error de validación', 'Por favor ingresa o selecciona una categoría.');
            return;
        }

        setLoading(true);
        try {
            await createTransaction({
                title: title.trim(),
                amount: parseFloat(amount),
                type: type,
                category: category.trim(),
                date: new Date().toISOString().split('T')[0]
            });

            Alert.alert('Éxito', 'Transacción registrada correctamente.', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            console.error('Error al registrar transacción:', error);
            Alert.alert(
                'Error', 
                error.response?.data?.message || 'No se pudo guardar la transacción. Intenta nuevamente.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                {/* Selector de Tipo */}
                <View style={styles.typeSelectorContainer}>
                    <TouchableOpacity 
                        style={[
                            styles.typeButton, 
                            styles.incomeButton,
                            type === 'income' && styles.incomeSelected
                        ]}
                        onPress={() => {
                            setType('income');
                            setCategory('');
                        }}
                    >
                        <Text style={[
                            styles.typeButtonText, 
                            type === 'income' ? styles.textSelected : styles.incomeTextUnselected
                        ]}>
                            Ingreso
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[
                            styles.typeButton, 
                            styles.expenseButton,
                            type === 'expense' && styles.expenseSelected
                        ]}
                        onPress={() => {
                            setType('expense');
                            setCategory('');
                        }}
                    >
                        <Text style={[
                            styles.typeButtonText, 
                            type === 'expense' ? styles.textSelected : styles.expenseTextUnselected
                        ]}>
                            Gasto
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Input de Monto Grande */}
                <View style={styles.amountContainer}>
                    <Text style={styles.currencySymbol}>$</Text>
                    <TextInput
                        style={styles.amountInput}
                        placeholder="0.00"
                        placeholderTextColor="#444"
                        keyboardType="decimal-pad"
                        value={amount}
                        onChangeText={setAmount}
                    />
                </View>

                {/* Campos del Formulario */}
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Título</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ej. Sueldo mensual, Compra supermercado"
                        placeholderTextColor="#71717a"
                        value={title}
                        onChangeText={setTitle}
                    />

                    <Text style={styles.label}>Categoría</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ingresa o selecciona una categoría"
                        placeholderTextColor="#71717a"
                        value={category}
                        onChangeText={setCategory}
                    />

                    {/* Sugerencias */}
                    <Text style={styles.suggestionsLabel}>Sugerencias:</Text>
                    <View style={styles.categoryChipsContainer}>
                        {(type === 'income' ? incomeCategories : expenseCategories).map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                style={[
                                    styles.chip,
                                    category === cat && styles.chipSelected
                                ]}
                                onPress={() => setCategory(cat)}
                            >
                                <Text style={[
                                    styles.chipText,
                                    category === cat && styles.chipTextSelected
                                ]}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Botón Guardar */}
                <TouchableOpacity 
                    style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
                    onPress={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#ffffff" />
                    ) : (
                        <Text style={styles.saveButtonText}>Guardar Transacción</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    typeSelectorContainer: {
        flexDirection: 'row',
        backgroundColor: '#1e1e1e',
        borderRadius: 12,
        padding: 4,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: '#2e2e2e',
    },
    typeButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    incomeButton: {
        marginRight: 2,
    },
    expenseButton: {
        marginLeft: 2,
    },
    incomeSelected: {
        backgroundColor: '#10b981',
    },
    expenseSelected: {
        backgroundColor: '#ef4444',
    },
    typeButtonText: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    textSelected: {
        color: '#ffffff',
    },
    incomeTextUnselected: {
        color: '#10b981',
    },
    expenseTextUnselected: {
        color: '#ef4444',
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#2e2e2e',
        paddingBottom: 10,
    },
    currencySymbol: {
        color: '#ffffff',
        fontSize: 40,
        fontWeight: 'bold',
        marginRight: 5,
    },
    amountInput: {
        color: '#ffffff',
        fontSize: 40,
        fontWeight: 'bold',
        minWidth: 150,
        textAlign: 'center',
    },
    formContainer: {
        marginBottom: 30,
    },
    label: {
        color: '#a1a1aa',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 15,
    },
    input: {
        backgroundColor: '#1e1e1e',
        borderWidth: 1,
        borderColor: '#2e2e2e',
        borderRadius: 8,
        height: 50,
        paddingHorizontal: 15,
        color: '#ffffff',
        fontSize: 15,
    },
    suggestionsLabel: {
        color: '#71717a',
        fontSize: 12,
        marginTop: 12,
        marginBottom: 8,
    },
    categoryChipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -4,
    },
    chip: {
        backgroundColor: '#1e1e1e',
        borderWidth: 1,
        borderColor: '#2e2e2e',
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
        margin: 4,
    },
    chipSelected: {
        backgroundColor: '#4f46e5',
        borderColor: '#6366f1',
    },
    chipText: {
        color: '#a1a1aa',
        fontSize: 13,
    },
    chipTextSelected: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: '#4f46e5',
        borderRadius: 8,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        shadowColor: '#4f46e5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    saveButtonDisabled: {
        backgroundColor: '#3730a3',
        opacity: 0.7,
    },
    saveButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
