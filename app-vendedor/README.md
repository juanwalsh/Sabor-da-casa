# App Vendedor - Sabor da Casa

App React Native + Expo para gerenciamento de estoque e pedidos em tempo real.

## Funcionalidades

### Tela de Estoque
- Lista produtos com estoque em tempo real
- Botoes + e - para ajustar estoque rapidamente
- Indicador de estoque baixo (vermelho quando <= 5)
- Adicionar novos produtos
- Editar produtos existentes
- Excluir produtos

### Tela de Pedidos
- Lista pedidos em tempo real (mais recentes primeiro)
- Status do pedido com cores diferentes
- Botoes para atualizar status: Pendente -> Confirmado -> Preparando -> Saiu Entrega -> Entregue
- Opcao de cancelar pedido
- Visualizar itens e total do pedido

## Como Rodar

### 1. Instalar dependencias
```bash
cd app-vendedor
npm install
```

### 2. Rodar em desenvolvimento
```bash
npx expo start --tunnel
```

### 3. Escanear QR Code
- Baixe o app Expo Go no celular
- Escaneie o QR Code que aparece no terminal

## Gerar APK

### 1. Login no Expo
```bash
npx eas login
```

### 2. Inicializar EAS
```bash
npx eas init --force --non-interactive
```

### 3. Gerar APK
```bash
npx eas build -p android --profile preview
```

## Estrutura do Firebase

O app usa o mesmo Firebase do site:
- Collection `produtos`: lista de produtos com estoque
- Collection `pedidos`: pedidos feitos pelo site

## Sincronizacao

Quando um cliente faz um pedido no site:
1. Pedido eh salvo no Firebase
2. Estoque eh debitado automaticamente
3. App do vendedor recebe atualizacao instantanea via onSnapshot

## Assets Necessarios

Crie a pasta `assets/` com as seguintes imagens:
- `icon.png` (1024x1024) - Icone do app
- `splash-icon.png` (1284x2778) - Tela de splash
- `adaptive-icon.png` (1024x1024) - Icone adaptativo Android
- `favicon.png` (48x48) - Favicon web
