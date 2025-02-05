import { type ClassValue } from "clsx"

// Database table names
export const DB_TABLES = {
  USERS: 'users',
  PARTIES: 'parties',
  RSVP: 'rsvp',
  SETTINGS: 'settings'
} as const

// Authentication settings
export const AUTH_CONFIG = {
  PROVIDERS: ['credentials', 'google', 'github'],
  SESSION_MAX_AGE: 30 * 24 * 60 * 60, // 30 days
  PAGES: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  }
} as const

// Theme configuration
export const THEME_CONFIG = {
  DEFAULT_THEME: 'system',
  AVAILABLE_THEMES: ['light', 'dark', 'system'],
  COLOR_SCHEMES: {
    light: {
      background: 'hsl(0 0% 100%)',
      foreground: 'hsl(222.2 84% 4.9%)',
      primary: 'hsl(222.2 47.4% 11.2%)',
      secondary: 'hsl(210 40% 96.1%)',
      muted: 'hsl(210 40% 96.1%)',
      accent: 'hsl(210 40% 96.1%)',
    },
    dark: {
      background: 'hsl(222.2 84% 4.9%)',
      foreground: 'hsl(210 40% 98%)',
      primary: 'hsl(210 40% 98%)',
      secondary: 'hsl(217.2 32.6% 17.5%)',
      muted: 'hsl(217.2 32.6% 17.5%)',
      accent: 'hsl(217.2 32.6% 17.5%)',
    },
  },
} as const

// API Routes configuration
export const API_ROUTES = {
  AUTH: '/api/auth',
  PARTIES: '/api/parties',
  RSVP: '/api/rsvp',
  USERS: '/api/users',
  SETTINGS: '/api/settings',
} as const

// Validation rules
export const VALIDATION = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_-]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: true,
  },
  PARTY: {
    TITLE_MAX_LENGTH: 100,
    DESCRIPTION_MAX_LENGTH: 500,
    MAX_GUESTS: 100,
  },
} as const

// Feature flags
export const FEATURES = {
  ENABLE_GOOGLE_AUTH: false,
  ENABLE_GITHUB_AUTH: false,
  ENABLE_EMAIL_NOTIFICATIONS: true,
  ENABLE_GUEST_RSVP: true,
  ENABLE_PARTY_SHARING: true,
} as const

// Application-wide constants
export const APP_CONSTANTS = {
  APP_NAME: 'Kids Party Planner',
  COMPANY_NAME: 'Party Parrot',
  SUPPORT_EMAIL: 'support@partyparrot.com',
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  DATE_FORMAT: 'YYYY-MM-DD',
  TIME_FORMAT: 'HH:mm',
} as const

// Toast notification settings
export const TOAST_CONFIG = {
  DEFAULT_DURATION: 5000,
  SUCCESS_DURATION: 3000,
  ERROR_DURATION: 7000,
  POSITION: 'bottom-right',
} as const

// Rate limiting settings
export const RATE_LIMIT = {
  MAX_REQUESTS: 100,
  WINDOW_MS: 60 * 1000, // 1 minute
} as const

// Cache settings
export const CACHE_CONFIG = {
  PARTY_TTL: 60 * 60, // 1 hour
  USER_TTL: 60 * 5, // 5 minutes
  RSVP_TTL: 60 * 30, // 30 minutes
} as const

// Type for environment variables
export type EnvVars = {
  DATABASE_URL: string
  NEXTAUTH_URL: string
  NEXTAUTH_SECRET: string
  GOOGLE_CLIENT_ID?: string
  GOOGLE_CLIENT_SECRET?: string
  GITHUB_CLIENT_ID?: string
  GITHUB_CLIENT_SECRET?: string
} 