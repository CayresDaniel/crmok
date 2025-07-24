# 🦇 CovenSO - Sistema Administrativo para Salão Gothic

Sistema administrativo completo desenvolvido para salões de cabeleireiro com temática dark e gótica, inspirado nos filmes do Tim Burton.

## 🎯 Funcionalidades

### ✅ Autenticação JWT
- Login seguro com JWT
- Usuário padrão: `Cayres` / `@D4n63rl0l`
- Proteção de rotas

### ✅ CRUD Completo
- **Usuários/Cabeleireiros**: Gestão completa de profissionais
- **Clientes**: Cadastro com dados pessoais e histórico
- **Procedimentos**: Catálogo de serviços com duração e preços
- **Produtos**: Controle dual (uso interno + venda)

### ✅ Sistema de Agendamento
- Verificação automática de disponibilidade
- Controle de horários por profissional
- Múltiplos procedimentos por agendamento
- Consumo automático de produtos

### ✅ Módulo Financeiro
- Controle de receitas e despesas
- Dashboard com métricas
- Contas a pagar/receber
- Cálculo de lucro líquido

### ✅ Sistema de Lembretes
- Aniversários de clientes automáticos
- Alertas de estoque baixo
- Lembretes manuais
- Notificações de agendamentos

## 🚀 Como Usar

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- PNPM

### Instalação

1. **Clone e instale dependências:**
```bash
cd coven
pnpm install
```

2. **Configure o banco de dados:**
```bash
# Edite o arquivo .env com suas credenciais do PostgreSQL
DATABASE_URL="postgresql://usuario:senha@localhost:5432/covenos_db?schema=public"

# Gere o cliente Prisma
pnpm run db:generate

# Aplique o schema no banco
pnpm run db:push

# Popular dados iniciais
pnpm run db:seed
```

3. **Inicie o servidor:**
```bash
# Desenvolvimento
pnpm run start:dev

# Produção
pnpm run build
pnpm run start:prod
```

## 📊 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Perfil do usuário
- `POST /api/auth/validate` - Validar token

### Usuários
- `GET /api/users` - Listar usuários
- `POST /api/users` - Criar usuário
- `GET /api/users/:id` - Buscar usuário
- `PATCH /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Desativar usuário

### Clientes
- `GET /api/clients` - Listar clientes
- `POST /api/clients` - Criar cliente
- `GET /api/clients/birthdays` - Aniversariantes do mês
- `GET /api/clients/:id` - Buscar cliente
- `PATCH /api/clients/:id` - Atualizar cliente
- `DELETE /api/clients/:id` - Desativar cliente

### Procedimentos
- `GET /api/procedures` - Listar procedimentos
- `POST /api/procedures` - Criar procedimento
- `GET /api/procedures/:id` - Buscar procedimento
- `PATCH /api/procedures/:id` - Atualizar procedimento
- `DELETE /api/procedures/:id` - Desativar procedimento
- `POST /api/procedures/:id/products` - Vincular produto
- `DELETE /api/procedures/:id/products/:productId` - Desvincular produto

### Produtos
- `GET /api/products` - Listar produtos
- `POST /api/products` - Criar produto
- `GET /api/products/low-stock` - Produtos com estoque baixo
- `GET /api/products/:id` - Buscar produto
- `PATCH /api/products/:id` - Atualizar produto
- `DELETE /api/products/:id` - Desativar produto
- `POST /api/products/:id/stock/add` - Adicionar estoque
- `POST /api/products/:id/stock/remove` - Remover estoque

### Agendamentos
- `GET /api/appointments` - Listar agendamentos
- `POST /api/appointments` - Criar agendamento
- `GET /api/appointments/availability` - Verificar disponibilidade
- `GET /api/appointments/:id` - Buscar agendamento
- `PATCH /api/appointments/:id` - Atualizar agendamento
- `PATCH /api/appointments/:id/status` - Atualizar status
- `DELETE /api/appointments/:id` - Cancelar agendamento

### Financeiro
- `GET /api/financial` - Listar transações
- `POST /api/financial` - Criar transação
- `GET /api/financial/dashboard` - Dashboard financeiro
- `GET /api/financial/overdue` - Contas em atraso
- `GET /api/financial/:id` - Buscar transação
- `PATCH /api/financial/:id` - Atualizar transação
- `PATCH /api/financial/:id/pay` - Marcar como pago
- `DELETE /api/financial/:id` - Excluir transação

### Lembretes
- `GET /api/reminders` - Listar lembretes
- `POST /api/reminders` - Criar lembrete
- `GET /api/reminders/active` - Lembretes ativos
- `POST /api/reminders/birthdays/create` - Criar lembretes de aniversário
- `GET /api/reminders/:id` - Buscar lembrete
- `PATCH /api/reminders/:id` - Atualizar lembrete
- `PATCH /api/reminders/:id/complete` - Marcar como concluído
- `DELETE /api/reminders/:id` - Desativar lembrete

## 🔐 Autenticação

Todas as rotas (exceto login) requerem header de autorização:
```
Authorization: Bearer <token_jwt>
```

## 🏗️ Arquitetura

- **Framework**: NestJS 11.x
- **Banco de Dados**: PostgreSQL 14
- **ORM**: Prisma
- **Autenticação**: JWT + Passport
- **Validação**: Class Validator + Class Transformer

## 📝 Variáveis de Ambiente

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/db?schema=public"
JWT_SECRET="sua_chave_jwt_super_secreta"
PORT=3000
NODE_ENV=development
```

## 🚀 Deploy

O projeto está preparado para deploy com Docker. A configuração será detalhada quando o frontend estiver pronto.

## 📱 Próximos Passos

- [ ] Frontend responsivo (React/Vue)
- [ ] Integração WhatsApp (API Evolution)
- [ ] Dashboard avançado
- [ ] Relatórios PDF
- [ ] Deploy na VPS

---

**🦇 CovenSO - Onde a beleza encontra o dark** ✨