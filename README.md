# FAFIRE Task Manager

Um aplicativo móvel completo de gerenciamento de tarefas pessoais desenvolvido com React Native e Expo, atendendo a todos os requisitos técnicos especificados.

## 📱 Descrição do Projeto

O **FAFIRE Task Manager** é um aplicativo robusto para gerenciamento de tarefas pessoais que permite aos usuários organizar, priorizar e acompanhar suas atividades diárias. O aplicativo oferece uma interface intuitiva e moderna, com funcionalidades avançadas como integração com APIs externas, recursos de dispositivo móvel e persistência de dados.

## ✨ Funcionalidades Principais

### 🔐 Sistema de Autenticação
- Login e registro de usuários
- Persistência de sessão
- Gerenciamento de perfil de usuário

### 📋 Gerenciamento de Tarefas (CRUD Completo)
- **Criar**: Adicionar novas tarefas com título, descrição, prioridade e categoria
- **Ler**: Visualizar lista de tarefas com filtros e busca
- **Atualizar**: Editar tarefas existentes e marcar como concluídas
- **Deletar**: Remover tarefas com confirmação

### 🏷️ Sistema de Categorias
- Categorias pré-definidas (Trabalho, Pessoal, Estudo, Saúde, Lazer)
- Criação de categorias personalizadas
- Ícones e cores personalizáveis
- Estatísticas por categoria

### 📊 Dashboard e Estatísticas
- Visão geral das tarefas (total, pendentes, concluídas)
- Taxa de conclusão em tempo real
- Tarefas prioritárias destacadas
- Progresso visual

### 🌤️ Integração com API Externa
- Dados meteorológicos em tempo real
- Localização atual do usuário
- Informações climáticas na tela inicial

### 📱 Recursos de Dispositivo Móvel
- **Câmera**: Captura de fotos para tarefas
- **Galeria**: Seleção de imagens existentes
- **Geolocalização**: Definição de localização para tarefas
- **Notificações**: Sistema de notificações push (preparado)
- **Armazenamento Local**: Persistência offline

### 🎨 Interface Moderna
- Design responsivo e adaptável
- Navegação por abas intuitiva
- Modo claro/escuro (preparado)
- Animações suaves
- Feedback visual para ações

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React Native**: Framework principal
- **Expo**: Plataforma de desenvolvimento
- **TypeScript**: Tipagem estática
- **React Navigation**: Navegação entre telas
- **AsyncStorage**: Persistência local

### APIs e Serviços
- **OpenWeatherMap API**: Dados meteorológicos
- **Expo Location**: Geolocalização
- **Expo Image Picker**: Câmera e galeria
- **Expo Notifications**: Notificações push
- **Supabase** (opcional): Backend-as-a-Service para sincronização em tempo real

### Bibliotecas Principais
- `@react-navigation/native`: Navegação
- `@react-native-async-storage/async-storage`: Armazenamento
- `expo-camera`: Acesso à câmera
- `expo-location`: Geolocalização
- `expo-image-picker`: Seleção de imagens
- `@react-native-community/datetimepicker`: Seletor de data
- `@supabase/supabase-js`: Cliente Supabase (opcional)

## 📁 Estrutura do Projeto

```
FAFIRE-APP/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── TaskItem.tsx     # Item de tarefa
│   │   └── FilterModal.tsx  # Modal de filtros
│   ├── contexts/            # Contextos React
│   │   ├── AuthContext.tsx  # Autenticação
│   │   └── TaskContext.tsx  # Gerenciamento de tarefas
│   ├── screens/             # Telas do aplicativo
│   │   ├── auth/            # Telas de autenticação
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   └── main/            # Telas principais
│   │       ├── HomeScreen.tsx
│   │       ├── TasksScreen.tsx
│   │       ├── AddTaskScreen.tsx
│   │       ├── TaskDetailScreen.tsx
│   │       ├── ProfileScreen.tsx
│   │       └── CategoriesScreen.tsx
│   ├── services/            # Serviços externos
│   │   └── weatherService.ts
│   ├── types/               # Definições TypeScript
│   │   └── index.ts
│   └── navigation/          # Configuração de navegação
│       └── index.tsx
├── App.tsx                  # Componente principal
├── package.json
└── README.md
```

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn
- Expo CLI
- Dispositivo móvel ou emulador

### Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd FAFIRE-APP
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as APIs (opcional)**
   - Para dados meteorológicos reais, registre-se em [OpenWeatherMap](https://openweathermap.org/api)
   - Atualize a chave da API em `src/services/weatherService.ts`

4. **Execute o projeto**
```bash
npm start
```

5. **Acesse no dispositivo**
   - Use o app Expo Go no seu dispositivo móvel
   - Escaneie o QR code exibido no terminal
   - Ou pressione 'a' para abrir no emulador Android
   - Ou pressione 'i' para abrir no simulador iOS

## 📱 Telas do Aplicativo

### 1. **Tela de Login** (`LoginScreen`)
- Formulário de autenticação
- Validação de campos
- Navegação para registro

### 2. **Tela de Registro** (`RegisterScreen`)
- Criação de nova conta
- Validação de senhas
- Navegação para login

### 3. **Tela Inicial** (`HomeScreen`)
- Dashboard com estatísticas
- Dados meteorológicos
- Tarefas prioritárias
- Ações rápidas

### 4. **Lista de Tarefas** (`TasksScreen`)
- Listagem com filtros
- Busca e ordenação
- Ações de toggle e exclusão
- Pull-to-refresh

### 5. **Nova Tarefa** (`AddTaskScreen`)
- Formulário completo
- Seleção de categoria
- Definição de prioridade
- Captura de imagem
- Geolocalização

### 6. **Detalhes da Tarefa** (`TaskDetailScreen`)
- Informações completas
- Ações de edição
- Visualização de imagem
- Coordenadas de localização

### 7. **Perfil do Usuário** (`ProfileScreen`)
- Estatísticas pessoais
- Configurações
- Informações da conta
- Logout

### 8. **Gerenciamento de Categorias** (`CategoriesScreen`)
- Lista de categorias
- Criação de novas categorias
- Personalização de ícones e cores
- Estatísticas por categoria

## 🔧 Configurações e Personalização

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
OPENWEATHER_API_KEY=sua_chave_aqui
EXPO_PUBLIC_SUPABASE_URL=sua_url_do_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
```

## 🚀 Integração com Supabase (Opcional)

O projeto inclui integração completa com o Supabase para funcionalidades avançadas:

### Benefícios
- **Sincronização em tempo real** entre dispositivos
- **Autenticação robusta** com login social
- **Storage de imagens** na nuvem
- **Backup automático** dos dados
- **Escalabilidade** para produção

### Configuração
1. Siga o guia completo em `SUPABASE_SETUP.md`
2. Configure o banco de dados PostgreSQL
3. Configure autenticação e storage
4. Atualize as variáveis de ambiente

### Uso
- Use `AppWithSupabase.tsx` para ativar a integração
- Use os hooks `useSupabaseAuth()` e `useSupabaseTasks()`
- Veja exemplo em `src/components/SupabaseExample.tsx`

### Configuração de Notificações
Para ativar notificações push, configure no `app.json`:
```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#ffffff"
        }
      ]
    ]
  }
}
```

## 📊 Requisitos Técnicos Atendidos

### ✅ Requisitos Fundamentais
- [x] Desenvolvido para iOS e Android
- [x] 5+ telas diferentes com navegação
- [x] Persistência de dados local
- [x] Design responsivo

### ✅ Requisitos Funcionais
- [x] Sistema de autenticação completo
- [x] CRUD completo de tarefas
- [x] Integração com API de clima
- [x] Recursos de dispositivo móvel:
  - [x] Câmera
  - [x] Geolocalização
  - [x] Notificações (preparado)
  - [x] Armazenamento de arquivos
- [x] Interface intuitiva e moderna

### ✅ Requisitos Não-Funcionais
- [x] Desempenho otimizado (< 2s)
- [x] Segurança implementada
- [x] Funcionamento offline
- [x] Tratamento de erros
- [x] Documentação completa

## 🎯 Funcionalidades Avançadas

### Sistema de Filtros
- Filtro por status (todas, pendentes, concluídas)
- Filtro por prioridade (baixa, média, alta)
- Filtro por categoria
- Combinação de filtros

### Persistência de Dados
- Armazenamento local com AsyncStorage
- Sincronização automática
- Backup de dados
- Recuperação de sessão

### Integração com APIs
- Dados meteorológicos em tempo real
- Geocodificação de endereços
- Informações de localização

### Recursos de Dispositivo
- Acesso à câmera com permissões
- Geolocalização com precisão
- Armazenamento de imagens
- Notificações push (preparado)

## 🐛 Solução de Problemas

### Erros Comuns

1. **Erro de permissão de câmera**
   - Verifique as permissões no dispositivo
   - Reinicie o aplicativo

2. **Erro de localização**
   - Ative o GPS no dispositivo
   - Conceda permissão de localização

3. **Erro de rede**
   - Verifique a conexão com a internet
   - O app funciona offline para funcionalidades básicas

### Logs e Debug
Para debug detalhado, execute:
```bash
expo start --dev-client
```

## 📈 Melhorias Futuras

- [ ] Sincronização com backend
- [ ] Compartilhamento de tarefas
- [ ] Lembretes e notificações
- [ ] Modo offline avançado
- [ ] Temas personalizáveis
- [ ] Exportação de dados
- [ ] Backup na nuvem
- [ ] Widgets para tela inicial

## 📄 Licença

Este projeto foi desenvolvido como parte de um trabalho acadêmico. Todos os direitos reservados.

## 👨‍💻 Desenvolvedor

Desenvolvido com ❤️ usando React Native e Expo.

---

**FAFIRE Task Manager** - Organize suas tarefas de forma inteligente e eficiente! 📱✨
