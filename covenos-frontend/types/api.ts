export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
}

export interface ApiError {
  message: string
  statusCode: number
  error?: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

// Entidades do sistema
export interface Client {
  id: string
  name: string
  email?: string
  phone?: string
  birthDate?: string
  address?: string
  observations?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface Procedure {
  id: string
  name: string
  description?: string
  duration: number
  price: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  name: string
  description?: string
  type: 'USO_INTERNO' | 'VENDA'
  price?: number
  stock: number
  minStock: number
  unit?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface Appointment {
  id: string
  clientId: string
  userId: string
  date: string
  startTime: string
  endTime?: string
  status: 'AGENDADO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO' | 'NAO_COMPARECEU'
  paymentMethod?: 'DINHEIRO' | 'CARTAO_DEBITO' | 'CARTAO_CREDITO' | 'PIX' | 'PARCELADO'
  totalPrice?: number
  discount?: number
  observations?: string
  createdAt: string
  updatedAt: string
  client?: Client
  user?: User
  procedures?: AppointmentProcedure[]
}

export interface AppointmentProcedure {
  id: string
  appointmentId: string
  procedureId: string
  price: number
  procedure?: Procedure
}

export interface FinancialTransaction {
  id: string
  type: 'RECEITA' | 'DESPESA'
  category: string
  description: string
  amount: number
  date: string
  isPaid: boolean
  dueDate?: string
  recurrent: boolean
  createdAt: string
  updatedAt: string
}

export interface Reminder {
  id: string
  type: 'ANIVERSARIO' | 'MANUAL' | 'PRODUTO_BAIXO' | 'AGENDAMENTO'
  title: string
  description?: string
  date: string
  userId?: string
  clientId?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  user?: User
  client?: Client
}

export interface DashboardStats {
  todayAppointments: number
  monthlyRevenue: number
  activeClients: number
  lowStockProducts: number
}

export interface FinancialDashboard {
  periodo: {
    inicio: string
    fim: string
  }
  receitas: {
    agendamentos: number
    outras: number
    total: number
  }
  despesas: {
    total: number
  }
  lucro: {
    bruto: number
    liquido: number
  }
  agendamentos: {
    total: number
    valor_medio: number
  }
}