/**
 * Sistema de Feature Flags
 *
 * Permite habilitar/desabilitar funcionalidades sem deploy.
 * Suporta:
 * - Flags por ambiente (dev/staging/prod)
 * - Flags por porcentagem de usuários
 * - Flags por lista de usuários específicos
 * - Override via localStorage (dev)
 */

import { logger } from './logger';

type Environment = 'development' | 'staging' | 'production';

interface FeatureConfig {
  // Flag habilitada globalmente
  enabled: boolean;

  // Ambientes onde está habilitada (se não definido, usa 'enabled')
  environments?: Environment[];

  // Porcentagem de usuários (0-100)
  percentage?: number;

  // Lista de IDs de usuários com acesso
  allowlist?: string[];

  // Descrição da feature
  description?: string;

  // Data de expiração (para features temporárias)
  expiresAt?: string;
}

// Definição das feature flags
const FLAGS: Record<string, FeatureConfig> = {
  // Novas funcionalidades
  'new-checkout-flow': {
    enabled: false,
    environments: ['development', 'staging'],
    description: 'Novo fluxo de checkout redesenhado',
  },

  'pix-payment': {
    enabled: true,
    description: 'Pagamento via PIX',
  },

  'scheduled-orders': {
    enabled: true,
    description: 'Agendamento de pedidos',
  },

  'loyalty-program': {
    enabled: false,
    environments: ['development'],
    description: 'Programa de fidelidade',
  },

  // Experimentos A/B
  'ab-hero-variant': {
    enabled: true,
    percentage: 50,
    description: 'Teste A/B do hero da landing page',
  },

  // Features de debug
  'debug-mode': {
    enabled: false,
    environments: ['development'],
    description: 'Modo debug com logs extras',
  },

  'mock-api': {
    enabled: false,
    environments: ['development'],
    description: 'Usar API mockada',
  },
};

function getCurrentEnvironment(): Environment {
  const env = process.env.NODE_ENV;
  if (env === 'production') return 'production';
  if (env === 'test') return 'staging';
  return 'development';
}

function getLocalStorageOverride(flagName: string): boolean | null {
  if (typeof window === 'undefined') return null;

  try {
    const overrides = JSON.parse(localStorage.getItem('feature-flags-override') || '{}');
    if (flagName in overrides) {
      return overrides[flagName];
    }
  } catch {
    // Ignora erro de parse
  }

  return null;
}

function hashUserId(userId: string): number {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function isInPercentage(userId: string | undefined, percentage: number): boolean {
  if (!userId) {
    // Sem userId, usa um valor aleatório
    return Math.random() * 100 < percentage;
  }

  // Com userId, resultado é determinístico
  const hash = hashUserId(userId);
  return (hash % 100) < percentage;
}

export function isFeatureEnabled(
  flagName: string,
  context?: { userId?: string }
): boolean {
  const config = FLAGS[flagName];

  if (!config) {
    logger.warn(`Feature flag "${flagName}" not found`, { action: 'feature_flag_missing' });
    return false;
  }

  // Verifica expiração
  if (config.expiresAt && new Date(config.expiresAt) < new Date()) {
    logger.info(`Feature flag "${flagName}" expired`, { action: 'feature_flag_expired' });
    return false;
  }

  // Override local (apenas em desenvolvimento)
  if (getCurrentEnvironment() === 'development') {
    const override = getLocalStorageOverride(flagName);
    if (override !== null) {
      logger.debug(`Feature flag "${flagName}" overridden to ${override}`, {
        action: 'feature_flag_override'
      });
      return override;
    }
  }

  // Verifica ambiente
  if (config.environments && !config.environments.includes(getCurrentEnvironment())) {
    return false;
  }

  // Verifica allowlist
  if (config.allowlist && context?.userId) {
    if (config.allowlist.includes(context.userId)) {
      return true;
    }
  }

  // Verifica porcentagem
  if (config.percentage !== undefined) {
    return isInPercentage(context?.userId, config.percentage);
  }

  return config.enabled;
}

export function getAllFlags(): Record<string, FeatureConfig> {
  return { ...FLAGS };
}

export function getEnabledFlags(context?: { userId?: string }): string[] {
  return Object.keys(FLAGS).filter(flag => isFeatureEnabled(flag, context));
}

// Para usar em desenvolvimento - permite override via console
export function setFlagOverride(flagName: string, enabled: boolean): void {
  if (typeof window === 'undefined') return;

  if (getCurrentEnvironment() !== 'development') {
    logger.warn('Feature flag override only available in development', {
      action: 'feature_flag_override_blocked'
    });
    return;
  }

  try {
    const overrides = JSON.parse(localStorage.getItem('feature-flags-override') || '{}');
    overrides[flagName] = enabled;
    localStorage.setItem('feature-flags-override', JSON.stringify(overrides));
    logger.info(`Feature flag "${flagName}" overridden to ${enabled}`, {
      action: 'feature_flag_override_set'
    });
  } catch (error) {
    logger.error('Failed to set feature flag override', error as Error);
  }
}

export function clearFlagOverrides(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('feature-flags-override');
  logger.info('Feature flag overrides cleared', { action: 'feature_flag_override_clear' });
}

// Hook para uso em componentes React
export function useFeatureFlag(flagName: string, context?: { userId?: string }): boolean {
  // Em um cenário real, você usaria useState + useEffect para
  // reatividade quando flags mudarem remotamente
  return isFeatureEnabled(flagName, context);
}

// Expõe funções no window para debug (apenas em dev)
if (typeof window !== 'undefined' && getCurrentEnvironment() === 'development') {
  (window as unknown as Record<string, unknown>).featureFlags = {
    isEnabled: isFeatureEnabled,
    getAll: getAllFlags,
    getEnabled: getEnabledFlags,
    setOverride: setFlagOverride,
    clearOverrides: clearFlagOverrides,
  };
}

export type { FeatureConfig, Environment };
