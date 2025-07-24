# 🦇 CovenSO Frontend - Interface Gótica

Frontend desenvolvido em **Nuxt 3** com temática dark e gótica inspirada nos filmes do Tim Burton.

## 🎨 Características

- ✅ **Tema Dark Gótico** - Paleta inspirada em "A Noiva Cadáver" e "IT: A Coisa"
- ✅ **Totalmente Responsivo** - Funciona perfeitamente em PC, tablet e mobile
- ✅ **Autenticação JWT** - Sistema seguro de login/logout
- ✅ **Layout Intuitivo** - Sidebar com navegação fluida
- ✅ **Componentes Reutilizáveis** - Cards, botões e elementos com estética gótica
- ✅ **Internacionalização** - Preparado para múltiplos idiomas
- ✅ **Toasts Estilizados** - Notificações com tema dark
- ✅ **Animações Suaves** - Transições e efeitos góticos

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- PNPM
- Backend CovenSO rodando na porta 3009

### Instalação

1. **Instalar dependências:**
```bash
cd covenos-frontend
pnpm install
```

2. **Configurar variáveis de ambiente:**
```bash
# Arquivo .env já está configurado
NUXT_PUBLIC_API_BASE=http://localhost:3009/api
```

3. **Executar em desenvolvimento:**
```bash
pnpm run dev
```

O frontend será iniciado em `http://localhost:3001`

### Build para Produção

```bash
# Gerar build otimizado
pnpm run build

# Preview da versão de produção
pnpm run preview
```

## 📱 Páginas Desenvolvidas

### ✅ **Login** (`/login`)
- Interface gótica com animações fluidas
- Validação de formulário
- Credenciais de demonstração visíveis
- Redirecionamento automático após login

### ✅ **Dashboard** (`/dashboard`)
- Visão geral do sistema
- Cards de estatísticas em tempo real
- Ações rápidas para principais funcionalidades
- Lista de agendamentos recentes
- Alertas de produtos com estoque baixo

### 🔄 **Em Desenvolvimento:**
- **Clientes** - CRUD completo com histórico
- **Cabeleireiros** - Gestão de profissionais
- **Procedimentos** - Catálogo de serviços
- **Produtos** - Controle de estoque dual
- **Agendamentos** - Sistema completo de marcação
- **Financeiro** - Dashboard com gráficos
- **Lembretes** - Notificações inteligentes

## 🎨 Sistema de Cores

```css
/* Paleta Gótica Principal */
gothic: #9999ff → #1a1a33
witch: #8b5cf6 → #2e1065  
blood: #ef4444 → #450a0a
shadow: #64748b → #020617
```

## 🧩 Componentes Criados

- **StatCard** - Cards de estatísticas com ícones
- **QuickActionButton** - Botões de ação rápida
- **ColorModeButton** - Toggle dark/light theme
- **Layout Principal** - Sidebar responsiva com navegação

## 🔐 Autenticação

- **Login:** `Cayres` / `@D4n63rl0l`
- **JWT Token** - Armazenado em cookies seguros
- **Middleware de Auth** - Proteção automática de rotas
- **Validação de Sessão** - Verificação contínua do token

## 📚 Stack Tecnológica

- **Nuxt 3** - Framework Vue.js
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework de estilização
- **Pinia** - Gerenciamento de estado
- **Vue-Toastification** - Notificações
- **Heroicons** - Ícones
- **Axios** - Cliente HTTP
- **Vue-i18n** - Internacionalização

## 🌐 API Integration

O frontend consome a API REST do backend NestJS:
- **Base URL:** `http://localhost:3009/api`
- **Autenticação:** Bearer Token JWT
- **Interceptors:** Tratamento automático de erros 401/403
- **Loading States:** Feedback visual em todas as operações

---

**🦇 CovenSO - Onde a beleza encontra o dark** ✨

*Frontend pronto para desenvolvimento das funcionalidades restantes!*