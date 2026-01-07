import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { db } from './src/firebase';
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  query,
  orderBy,
  where,
} from 'firebase/firestore';

const Tab = createBottomTabNavigator();

// ========================
// TELA DE ESTOQUE
// ========================
function EstoqueScreen() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    preco: '',
    estoque: '',
    categoria: '',
    emoji: '',
  });

  // Carregar produtos em tempo real
  useEffect(() => {
    const produtosRef = collection(db, 'produtos');
    const q = query(produtosRef, orderBy('categoriaId'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const produtosData = [];
      snapshot.forEach((doc) => {
        produtosData.push({ id: doc.id, ...doc.data() });
      });
      setProdutos(produtosData);
      setLoading(false);
      setRefreshing(false);
    });

    return () => unsubscribe();
  }, [refreshCount]);

  // Ajustar estoque rapidamente
  const ajustarEstoque = async (produtoId, delta) => {
    const produto = produtos.find((p) => p.id === produtoId);
    if (!produto) return;

    const novoEstoque = (produto.estoque || 0) + delta;
    if (novoEstoque < 0) {
      Alert.alert('Erro', 'Estoque nao pode ser negativo');
      return;
    }

    try {
      await updateDoc(doc(db, 'produtos', produtoId), {
        estoque: novoEstoque,
        atualizadoEm: new Date(),
      });
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar estoque');
    }
  };

  // Abrir modal de edicao
  const abrirEdicao = (produto) => {
    setEditingProduct(produto);
    setFormData({
      nome: produto.nome,
      preco: String(produto.preco),
      estoque: String(produto.estoque),
      categoria: produto.categoriaId,
      emoji: produto.emoji || '',
    });
    setModalVisible(true);
  };

  // Abrir modal para novo produto
  const abrirNovo = () => {
    setEditingProduct(null);
    setFormData({
      nome: '',
      preco: '',
      estoque: '50',
      categoria: 'cat-1',
      emoji: '🍽️',
    });
    setModalVisible(true);
  };

  // Salvar produto
  const salvarProduto = async () => {
    if (!formData.nome || !formData.preco) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatorios');
      return;
    }

    try {
      const produtoData = {
        nome: formData.nome,
        preco: parseFloat(formData.preco),
        estoque: parseInt(formData.estoque) || 0,
        categoriaId: formData.categoria,
        emoji: formData.emoji,
        ativo: true,
        atualizadoEm: new Date(),
      };

      if (editingProduct) {
        await updateDoc(doc(db, 'produtos', editingProduct.id), produtoData);
        Alert.alert('Sucesso', 'Produto atualizado!');
      } else {
        produtoData.criadoEm = new Date();
        await addDoc(collection(db, 'produtos'), produtoData);
        Alert.alert('Sucesso', 'Produto criado!');
      }

      setModalVisible(false);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao salvar produto');
    }
  };

  // Excluir produto
  const excluirProduto = async (produtoId) => {
    Alert.alert(
      'Confirmar',
      'Deseja realmente excluir este produto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'produtos', produtoId));
              Alert.alert('Sucesso', 'Produto excluido!');
            } catch (error) {
              Alert.alert('Erro', 'Erro ao excluir produto');
            }
          },
        },
      ]
    );
  };

  const renderProduto = ({ item }) => (
    <View style={styles.produtoCard}>
      <View style={styles.produtoInfo}>
        <Text style={styles.produtoEmoji}>{item.emoji || '🍽️'}</Text>
        <View style={styles.produtoTexto}>
          <Text style={styles.produtoNome}>{item.nome}</Text>
          <Text style={styles.produtoPreco}>
            R$ {(item.preco || 0).toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.estoqueContainer}>
        <TouchableOpacity
          style={styles.btnEstoque}
          onPress={() => ajustarEstoque(item.id, -1)}
        >
          <Text style={styles.btnEstoqueText}>-</Text>
        </TouchableOpacity>

        <View
          style={[
            styles.estoqueBox,
            item.estoque <= 5 && styles.estoqueBaixo,
          ]}
        >
          <Text
            style={[
              styles.estoqueText,
              item.estoque <= 5 && styles.estoqueTextBaixo,
            ]}
          >
            {item.estoque || 0}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.btnEstoque}
          onPress={() => ajustarEstoque(item.id, 1)}
        >
          <Text style={styles.btnEstoqueText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.acoes}>
        <TouchableOpacity
          style={styles.btnEditar}
          onPress={() => abrirEdicao(item)}
        >
          <Text style={styles.btnEditarText}>✏️</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnExcluir}
          onPress={() => excluirProduto(item.id)}
        >
          <Text style={styles.btnExcluirText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📦 Estoque</Text>
        <TouchableOpacity style={styles.btnNovo} onPress={abrirNovo}>
          <Text style={styles.btnNovoText}>+ Novo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={renderProduto}
        contentContainerStyle={styles.lista}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              setRefreshCount((prev) => prev + 1);
            }}
          />
        }
      />

      {/* Modal de Edicao/Criacao */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </Text>

              <Text style={styles.inputLabel}>Nome *</Text>
              <TextInput
                style={styles.input}
                value={formData.nome}
                onChangeText={(text) =>
                  setFormData({ ...formData, nome: text })
                }
                placeholder="Nome do produto"
              />

              <Text style={styles.inputLabel}>Preco *</Text>
              <TextInput
                style={styles.input}
                value={formData.preco}
                onChangeText={(text) =>
                  setFormData({ ...formData, preco: text })
                }
                placeholder="0.00"
                keyboardType="decimal-pad"
              />

              <Text style={styles.inputLabel}>Estoque</Text>
              <TextInput
                style={styles.input}
                value={formData.estoque}
                onChangeText={(text) =>
                  setFormData({ ...formData, estoque: text })
                }
                placeholder="0"
                keyboardType="number-pad"
              />

              <Text style={styles.inputLabel}>Emoji</Text>
              <TextInput
                style={styles.input}
                value={formData.emoji}
                onChangeText={(text) =>
                  setFormData({ ...formData, emoji: text })
                }
                placeholder="🍽️"
              />

              <View style={styles.modalBotoes}>
                <TouchableOpacity
                  style={styles.btnCancelar}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.btnCancelarText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btnSalvar}
                  onPress={salvarProduto}
                >
                  <Text style={styles.btnSalvarText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

// ========================
// TELA DE PEDIDOS
// ========================
function PedidosScreen({ onUpdateBadge }) {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewedOrders, setViewedOrders] = useState(new Set());

  // Carregar pedidos em tempo real
  useEffect(() => {
    const pedidosRef = collection(db, 'pedidos');
    const q = query(pedidosRef, orderBy('criadoEm', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pedidosData = [];
      snapshot.forEach((doc) => {
        pedidosData.push({ id: doc.id, ...doc.data() });
      });
      setPedidos(pedidosData);
      setLoading(false);

      // Contar pedidos novos (nao vistos)
      const newCount = pedidosData.filter(p =>
        p.status === 'pendente' && !viewedOrders.has(p.id)
      ).length;
      onUpdateBadge?.(newCount);
    });

    return () => unsubscribe();
  }, [viewedOrders]);

  // Marcar pedido como visto
  const marcarComoVisto = (pedidoId) => {
    setViewedOrders(prev => new Set([...prev, pedidoId]));
  };

  // Atualizar status do pedido
  const atualizarStatus = async (pedidoId, novoStatus) => {
    try {
      await updateDoc(doc(db, 'pedidos', pedidoId), {
        status: novoStatus,
        atualizadoEm: new Date(),
      });
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendente':
        return '#f59e0b';
      case 'confirmado':
        return '#3b82f6';
      case 'preparando':
        return '#8b5cf6';
      case 'saiu_entrega':
        return '#06b6d4';
      case 'entregue':
        return '#10b981';
      case 'cancelado':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pendente':
        return '⏳ Pendente';
      case 'confirmado':
        return '✅ Confirmado';
      case 'preparando':
        return '👨‍🍳 Preparando';
      case 'saiu_entrega':
        return '🛵 Saiu Entrega';
      case 'entregue':
        return '✨ Entregue';
      case 'cancelado':
        return '❌ Cancelado';
      default:
        return status;
    }
  };

  const renderPedido = ({ item }) => {
    const data = item.criadoEm?.toDate?.() || new Date();
    const dataFormatada = data.toLocaleString('pt-BR');
    const isNew = item.status === 'pendente' && !viewedOrders.has(item.id);

    return (
      <TouchableOpacity
        style={[styles.pedidoCard, isNew && styles.pedidoCardNew]}
        onPress={() => marcarComoVisto(item.id)}
        activeOpacity={0.9}
      >
        <View style={styles.pedidoHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.pedidoId}>
              #{item.id.slice(-6).toUpperCase()}
            </Text>
            {isNew && (
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>NOVO</Text>
              </View>
            )}
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
          </View>
        </View>

        <Text style={styles.pedidoCliente}>
          👤 {item.cliente?.nome || 'Cliente'}
        </Text>
        <Text style={styles.pedidoTelefone}>
          📞 {item.cliente?.telefone || '-'}
        </Text>
        <Text style={styles.pedidoData}>📅 {dataFormatada}</Text>

        {/* Mostra se e entrega agendada */}
        {item.agendamento && (
          <View style={styles.agendamentoBadge}>
            <Text style={styles.agendamentoText}>
              🗓️ AGENDADO: {item.agendamento}
            </Text>
          </View>
        )}

        <View style={styles.pedidoItens}>
          <Text style={styles.pedidoItensTitle}>Itens:</Text>
          {item.itens?.map((it, idx) => (
            <Text key={idx} style={styles.pedidoItem}>
              • {it.quantidade}x {it.nome} - R$ {it.precoTotal?.toFixed(2)}
            </Text>
          ))}
        </View>

        <Text style={styles.pedidoTotal}>
          💰 Total: R$ {(item.total || 0).toFixed(2)}
        </Text>

        {item.status !== 'entregue' && item.status !== 'cancelado' && (
          <View style={styles.statusButtons}>
            {item.status === 'pendente' && (
              <TouchableOpacity
                style={[styles.statusBtn, { backgroundColor: '#3b82f6' }]}
                onPress={() => atualizarStatus(item.id, 'confirmado')}
              >
                <Text style={styles.statusBtnText}>Confirmar</Text>
              </TouchableOpacity>
            )}
            {item.status === 'confirmado' && (
              <TouchableOpacity
                style={[styles.statusBtn, { backgroundColor: '#8b5cf6' }]}
                onPress={() => atualizarStatus(item.id, 'preparando')}
              >
                <Text style={styles.statusBtnText}>Preparar</Text>
              </TouchableOpacity>
            )}
            {item.status === 'preparando' && (
              <TouchableOpacity
                style={[styles.statusBtn, { backgroundColor: '#06b6d4' }]}
                onPress={() => atualizarStatus(item.id, 'saiu_entrega')}
              >
                <Text style={styles.statusBtnText}>Saiu Entrega</Text>
              </TouchableOpacity>
            )}
            {item.status === 'saiu_entrega' && (
              <TouchableOpacity
                style={[styles.statusBtn, { backgroundColor: '#10b981' }]}
                onPress={() => atualizarStatus(item.id, 'entregue')}
              >
                <Text style={styles.statusBtnText}>Entregue</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.statusBtn, { backgroundColor: '#ef4444' }]}
              onPress={() => atualizarStatus(item.id, 'cancelado')}
            >
              <Text style={styles.statusBtnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📋 Pedidos</Text>
        <Text style={styles.headerSubtitle}>{pedidos.length} pedidos</Text>
      </View>

      {pedidos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum pedido ainda</Text>
          <Text style={styles.emptySubtext}>
            Os pedidos do site aparecerao aqui em tempo real
          </Text>
        </View>
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.id}
          renderItem={renderPedido}
          contentContainerStyle={styles.lista}
        />
      )}
    </SafeAreaView>
  );
}

// ========================
// APP PRINCIPAL
// ========================
export default function App() {
  const [pedidosBadge, setPedidosBadge] = useState(0);

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#ff5722',
          tabBarInactiveTintColor: '#9ca3af',
          tabBarStyle: {
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}
      >
        <Tab.Screen
          name="Estoque"
          component={EstoqueScreen}
          options={{
            tabBarLabel: 'Estoque',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 24 }}>📦</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Pedidos"
          options={{
            tabBarLabel: 'Pedidos',
            tabBarIcon: ({ color }) => (
              <View>
                <Text style={{ fontSize: 24 }}>📋</Text>
                {pedidosBadge > 0 && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>
                      {pedidosBadge > 9 ? '9+' : pedidosBadge}
                    </Text>
                  </View>
                )}
              </View>
            ),
          }}
        >
          {(props) => <PedidosScreen {...props} onUpdateBadge={setPedidosBadge} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// ========================
// ESTILOS
// ========================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  loadingText: {
    fontSize: 18,
    color: '#6b7280',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  btnNovo: {
    backgroundColor: '#ff5722',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnNovoText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  lista: {
    padding: 16,
    paddingBottom: 100,
  },

  // Produto Card
  produtoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  produtoInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  produtoEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  produtoTexto: {
    flex: 1,
  },
  produtoNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  produtoPreco: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
  },
  estoqueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  btnEstoque: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnEstoqueText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
  },
  estoqueBox: {
    minWidth: 40,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#dbeafe',
    borderRadius: 8,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  estoqueBaixo: {
    backgroundColor: '#fee2e2',
  },
  estoqueText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  estoqueTextBaixo: {
    color: '#dc2626',
  },
  acoes: {
    flexDirection: 'row',
  },
  btnEditar: {
    padding: 8,
  },
  btnEditarText: {
    fontSize: 18,
  },
  btnExcluir: {
    padding: 8,
  },
  btnExcluirText: {
    fontSize: 18,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  modalBotoes: {
    flexDirection: 'row',
    marginTop: 24,
  },
  btnCancelar: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
    marginRight: 8,
    alignItems: 'center',
  },
  btnCancelarText: {
    color: '#374151',
    fontWeight: '600',
  },
  btnSalvar: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#ff5722',
    marginLeft: 8,
    alignItems: 'center',
  },
  btnSalvarText: {
    color: '#fff',
    fontWeight: '600',
  },

  // Pedidos
  pedidoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pedidoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pedidoId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  pedidoCliente: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 4,
  },
  pedidoTelefone: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  pedidoData: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 12,
  },
  pedidoItens: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  pedidoItensTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  pedidoItem: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  pedidoTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 12,
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  statusBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  // Badge de notificacao na tab
  tabBadge: {
    position: 'absolute',
    right: -8,
    top: -4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  tabBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // Pedido novo
  pedidoCardNew: {
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  newBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  newBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // Agendamento
  agendamentoBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginVertical: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  agendamentoText: {
    color: '#1e40af',
    fontSize: 14,
    fontWeight: '600',
  },
});
