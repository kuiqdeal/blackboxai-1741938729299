// Auth Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  company: string;
  tenantId: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Settings Types
export interface SettingsState {
  theme: 'light' | 'dark';
  language: string;
  sidebarCollapsed: boolean;
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
  };
}

// Lead Types
export interface Lead {
  _id: string;
  businessInfo: {
    name: string;
    description?: string;
    website?: string;
    industry?: string;
  };
  contactInfo: {
    email?: string;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      postalCode?: string;
    };
  };
  status: 'new' | 'qualified' | 'contacted' | 'converted' | 'rejected';
  score: number;
  quality: 'hot' | 'warm' | 'cold';
  source: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadState {
  leads: Lead[];
  currentLead: Lead | null;
  loading: boolean;
  error: string | null;
  filters: {
    status?: string;
    quality?: string;
    source?: string;
    assignedTo?: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Campaign Types
export interface Campaign {
  _id: string;
  name: string;
  type: 'email' | 'social_media' | 'ads' | 'sms' | 'whatsapp';
  platform: string;
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'failed';
  content: {
    subject?: string;
    body: string;
    template?: string;
    mediaUrls?: string[];
    callToAction?: {
      text: string;
      url: string;
    };
  };
  schedule: {
    startDate?: Date;
    endDate?: Date;
    frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
    timeZone?: string;
  };
  targeting: {
    audience: string[];
    segments: string[];
    filters: Record<string, any>;
  };
  budget?: {
    amount: number;
    currency: string;
    daily?: number;
    spent: number;
  };
  performance: {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
    roi: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CampaignState {
  campaigns: Campaign[];
  currentCampaign: Campaign | null;
  loading: boolean;
  error: string | null;
  filters: {
    type?: string;
    platform?: string;
    status?: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form Types
export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  company: string;
  tenantId: string;
}

export interface ForgotPasswordFormValues {
  email: string;
}

export interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
  token: string;
}

export interface ProfileFormValues {
  name: string;
  email: string;
  bio?: string;
  company: string;
}

export interface PasswordChangeFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Route Types
export interface ProtectedRouteProps {
  children: React.ReactNode;
}
