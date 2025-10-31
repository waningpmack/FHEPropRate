import crypto from 'crypto';

// 计算确定性 seed
const projectName = "FHEPropRate";
const network = "localhost";
const yearMonth = "202501";
const contractName = "PropertyRatingContract.sol";
const seedString = `${projectName}${network}${yearMonth}${contractName}`;
const seed = crypto.createHash('sha256').update(seedString).digest('hex');

// 根据 seed 选择设计维度（示例）
const seedNum = parseInt(seed.substring(0, 8), 16);
const designSystem = ['Material', 'Fluent', 'Neumorphism', 'Glassmorphism', 'Minimal'][seedNum % 5];
const colorScheme = seedNum % 8; // 0-7 对应 A-H

export const designTokens = {
  system: designSystem,
  seed: seed,

  colors: {
    light: {
      primary: '#10B981', // Green from C group
      secondary: '#06B6D4', // Cyan
      accent: '#14B8A6', // Teal
      background: '#FFFFFF',
      surface: '#F8FAFC',
      text: '#0F172A',
      textSecondary: '#64748B',
      error: '#EF4444',
      success: '#10B981',
    },
    dark: {
      primary: '#34D399',
      secondary: '#22D3EE',
      accent: '#2DD4BF',
      background: '#0F172A',
      surface: '#1E293B',
      text: '#F8FAFC',
      textSecondary: '#94A3B8',
      error: '#F87171',
      success: '#34D399',
    },
  },

  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    scale: 1.25,
    sizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.25rem',    // 20px
      xl: '1.563rem',   // 25px
      '2xl': '1.953rem', // 31px
      '3xl': '2.441rem', // 39px
    },
  },

  spacing: {
    unit: 8, // 基础间距单位 8px
  },

  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },

  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 15px rgba(0,0,0,0.15)',
  },

  transitions: {
    duration: 200,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  layout: 'sidebar', // 'sidebar' | 'masonry' | 'tabs' | 'grid' | 'wizard'

  density: {
    compact: {
      padding: { sm: '4px 8px', md: '8px 16px', lg: '12px 24px' },
      gap: '8px',
    },
    comfortable: {
      padding: { sm: '8px 16px', md: '16px 24px', lg: '20px 32px' },
      gap: '16px',
    },
  },
};
