
// Theme configuration for easy color customization
export const theme = {
  // Primary colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe', 
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    900: '#0c4a6e'
  },
  
  // Secondary colors
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    900: '#0f172a'
  },
  
  // Status colors
  status: {
    matched: {
      bg: '#dcfce7',
      text: '#166534',
      border: '#bbf7d0'
    },
    mismatched: {
      bg: '#fef2f2',
      text: '#dc2626',
      border: '#fecaca'
    },
    pending: {
      bg: '#fef3c7',
      text: '#d97706',
      border: '#fed7aa'
    }
  },
  
  // Background gradients
  gradients: {
    primary: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50',
    card: 'bg-white/80 backdrop-blur-sm',
    button: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
  }
};
