export const APP_NAME = 'TI Junction';

export const COLORS = {
  primary: '#1DA1F2',
  primaryDark: '#0D8ED9',
  secondary: '#14171A',
  accent: '#657786',
  background: '#FFFFFF',
  backgroundSecondary: '#F5F8FA',
  border: '#E1E8ED',
  text: '#14171A',
  textSecondary: '#657786',
  textLight: '#AAB8C2',
  error: '#E0245E',
  success: '#17BF63',
  warning: '#FFAD1F',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.5)',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const FONT_SIZE = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 28,
  title: 34,
} as const;

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

// Feed
export const POSTS_PER_PAGE = 10;
export const AD_INTERVAL = 5;

// AdMob Test IDs
export const ADMOB_IDS = {
  native: {
    android: 'ca-app-pub-3940256099942544/2247696110',
    ios: 'ca-app-pub-3940256099942544/3986624511',
  },
  interstitial: {
    android: 'ca-app-pub-3940256099942544/1033173712',
    ios: 'ca-app-pub-3940256099942544/4411468910',
  },
  rewarded: {
    android: 'ca-app-pub-3940256099942544/5224354917',
    ios: 'ca-app-pub-3940256099942544/1712485313',
  },
} as const;

// Interstitial Ad Config
export const INTERSTITIAL_POST_OPEN_THRESHOLD = 10;
export const INTERSTITIAL_FREQUENCY_CAP_MS = 60_000;

// Rewarded Ad Config
export const REWARDED_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes
