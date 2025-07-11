# FAFIRE Task Manager

Um aplicativo móvel completo de gerenciamento de tarefas pessoais desenvolvido com React Native, Expo e Supabase, atendendo a todos os requisitos técnicos especificados para o projeto acadêmico da FAFIRE.

## 📱 Descrição do Projeto

O **FAFIRE Task Manager** é um app robusto para organização de tarefas pessoais, permitindo ao usuário cadastrar, priorizar, acompanhar e concluir atividades diárias. O app oferece interface moderna, integração com APIs externas, recursos nativos do dispositivo e persistência de dados local e em nuvem.

## ✨ Funcionalidades Principais

- Autenticação de usuários (login, registro, confirmação de e-mail)
- CRUD completo de tarefas e categorias
- Dashboard com estatísticas e barra de progresso dinâmica
- Filtros avançados por status, prioridade e categoria
- Integração com API de clima (OpenWeatherMap)
- Upload e visualização de imagens (câmera/galeria)
- Geolocalização de tarefas
- Modo claro/escuro com contraste aprimorado
- Persistência local e sincronização com Supabase

## 🛠️ Tecnologias Utilizadas

- **React Native** + **Expo**
- **TypeScript**
- **Supabase** (autenticação, banco de dados, storage)
- **OpenWeatherMap API**
- **AsyncStorage**
- **React Navigation**
- **Expo Location, Camera, Image Picker, Notifications**

## 📁 Estrutura do Projeto

```
FAFIRE-APP/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   ├── contexts/            # Contextos globais (Auth, Task, Theme)
│   ├── screens/             # Telas do app
│   ├── services/            # Integração com APIs externas
│   ├── types/               # Tipos TypeScript
│   └── navigation/          # Navegação
├── App.tsx                  # Componente principal
├── package.json
└── README.md
```

## 🚀 Como Executar o Projeto

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd FAFIRE-APP
```
2. **Instale as dependências**
```bash
npm install
```
3. **Configure as variáveis de ambiente**
Crie um arquivo `.env` na raiz:
```env
OPENWEATHER_API_KEY=sua_chave_aqui
EXPO_PUBLIC_SUPABASE_URL=sua_url_do_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
```
4. **Execute o projeto**
```bash
npm start
```
5. **Abra no dispositivo**
- Use o app Expo Go e escaneie o QR code

## 🗂️ Telas do Aplicativo
- Login e Registro
- Home (dashboard, clima, progresso)
- Lista de Tarefas (filtros, busca, toggle, exclusão)
- Nova Tarefa (formulário, imagem, localização)
- Detalhes da Tarefa (edição, visualização)
- Perfil do Usuário (estatísticas, logout)
- Gerenciamento de Categorias

## 🔒 Integração com Supabase

- Autenticação segura (RLS)
- CRUD de tarefas e categorias por usuário
- Storage de imagens
- Políticas de segurança revisadas e funcionais
- Sincronização em tempo real

**Observação:**
- As policies RLS foram ajustadas para garantir que cada usuário só acesse seus próprios dados.
- O campo `user_id` é obrigatório em todas as inserções.
- O campo `category_id` das tarefas agora referencia corretamente o id da categoria.
- O app exibe o nome da categoria em vez do id.
- Não é possível criar tarefas sem categoria cadastrada.

## 🐛 Solução de Problemas Recentes

- Corrigido bug de UUID inválido ao criar tarefas
- Corrigido erro de RLS em categorias e tarefas
- Corrigido problema de ANON KEY inválida (bug do Supabase)
- Barra de progresso e estatísticas agora atualizam corretamente
- Melhorias de contraste e acessibilidade no modo escuro
- Removidos arquivos de teste e exemplos antigos

## 📈 Melhorias Futuras
- Compartilhamento de tarefas
- Lembretes e notificações push
- Temas personalizáveis
- Exportação e backup de dados

## 📄 Licença

Projeto acadêmico FAFIRE. Todos os direitos reservados.

## 👨‍💻 Desenvolvedor

**Petronio Silva** - [@ppsfafire](https://github.com/ppsfafire)

Desenvolvido com ❤️ usando React Native, Expo e Supabase.

---

**FAFIRE Task Manager** - Organize suas tarefas de forma inteligente e eficiente! 📱✨
