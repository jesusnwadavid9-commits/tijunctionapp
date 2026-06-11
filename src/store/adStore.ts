import { create } from 'zustand';
import {
  INTERSTITIAL_POST_OPEN_THRESHOLD,
  INTERSTITIAL_FREQUENCY_CAP_MS,
  REWARDED_COOLDOWN_MS,
} from '@/constants';

interface AdState {
  postOpenCount: number;
  lastInterstitialAt: number;
  lastRewardedAt: number;
  rewardedAvailable: boolean;

  incrementPostOpen: () => void;
  shouldShowInterstitial: () => boolean;
  markInterstitialShown: () => void;
  shouldShowRewarded: () => boolean;
  markRewardedShown: () => void;
  setRewardedAvailable: (available: boolean) => void;
}

export const useAdStore = create<AdState>((set, get) => ({
  postOpenCount: 0,
  lastInterstitialAt: 0,
  lastRewardedAt: 0,
  rewardedAvailable: false,

  incrementPostOpen: () =>
    set((s) => ({ postOpenCount: s.postOpenCount + 1 })),

  shouldShowInterstitial: () => {
    const { postOpenCount, lastInterstitialAt } = get();
    const now = Date.now();
    return (
      postOpenCount > 0 &&
      postOpenCount % INTERSTITIAL_POST_OPEN_THRESHOLD === 0 &&
      now - lastInterstitialAt > INTERSTITIAL_FREQUENCY_CAP_MS
    );
  },

  markInterstitialShown: () =>
    set({ lastInterstitialAt: Date.now() }),

  shouldShowRewarded: () => {
    const { lastRewardedAt } = get();
    return Date.now() - lastRewardedAt >= REWARDED_COOLDOWN_MS;
  },

  markRewardedShown: () =>
    set({ lastRewardedAt: Date.now(), rewardedAvailable: false }),

  setRewardedAvailable: (rewardedAvailable) => set({ rewardedAvailable }),
}));
