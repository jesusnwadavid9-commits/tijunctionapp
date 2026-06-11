import { useEffect, useRef, useCallback, useState } from 'react';
import { Platform } from 'react-native';
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import { useAdStore } from '@/store/adStore';
import { ADMOB_IDS, REWARDED_COOLDOWN_MS } from '@/constants';

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : Platform.select({
      android: ADMOB_IDS.rewarded.android,
      ios: ADMOB_IDS.rewarded.ios,
      default: ADMOB_IDS.rewarded.android,
    })!;

export function useRewardedAd() {
  const adRef = useRef<RewardedAd | null>(null);
  const loadedRef = useRef(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const { shouldShowRewarded, markRewardedShown, lastRewardedAt } = useAdStore();

  useEffect(() => {
    const ad = RewardedAd.createForAdRequest(adUnitId);

    const loadListener = ad.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        loadedRef.current = true;
      },
    );

    const earnedListener = ad.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        markRewardedShown();
        loadedRef.current = false;
        ad.load();
      },
    );

    ad.load();
    adRef.current = ad;

    return () => {
      loadListener();
      earnedListener();
    };
  }, [markRewardedShown]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        REWARDED_COOLDOWN_MS - (Date.now() - lastRewardedAt),
      );
      setCooldownRemaining(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastRewardedAt]);

  const show = useCallback(() => {
    if (shouldShowRewarded() && loadedRef.current && adRef.current) {
      adRef.current.show();
    }
  }, [shouldShowRewarded]);

  const isAvailable = shouldShowRewarded() && loadedRef.current;

  return { show, isAvailable, cooldownRemaining };
}
