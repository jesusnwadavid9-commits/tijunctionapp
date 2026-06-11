// Web shim for react-native-google-mobile-ads
export const TestIds = {
  BANNER: 'test-banner',
  INTERSTITIAL: 'test-interstitial',
  REWARDED: 'test-rewarded',
  NATIVE: 'test-native',
};

export const AdEventType = {
  LOADED: 'loaded',
  ERROR: 'error',
  OPENED: 'opened',
  CLOSED: 'closed',
  CLICKED: 'clicked',
};

export const RewardedAdEventType = {
  LOADED: 'loaded',
  EARNED_REWARD: 'earned_reward',
};

const noopAd = {
  load: () => {},
  show: () => Promise.resolve(),
  addAdEventListener: () => () => {},
  addAdEventsListener: () => () => {},
  loaded: false,
};

export function InterstitialAd() {
  return { ...noopAd };
}
InterstitialAd.createForAdRequest = () => ({ ...noopAd });

export function RewardedAd() {
  return { ...noopAd };
}
RewardedAd.createForAdRequest = () => ({ ...noopAd });

export function BannerAd() {
  return null;
}

export const BannerAdSize = {
  BANNER: 'BANNER',
  LARGE_BANNER: 'LARGE_BANNER',
  MEDIUM_RECTANGLE: 'MEDIUM_RECTANGLE',
};

export default { TestIds, AdEventType, RewardedAdEventType };
