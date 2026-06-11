import { useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import { useAdStore } from '@/store/adStore';
import { ADMOB_IDS } from '@/constants';

const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.select({
      android: ADMOB_IDS.interstitial.android,
      ios: ADMOB_IDS.interstitial.ios,
      default: ADMOB_IDS.interstitial.android,
    })!;

export function useInterstitialAd() {
  const adRef = useRef<InterstitialAd | null>(null);
  const loadedRef = useRef(false);
  const { shouldShowInterstitial, markInterstitialShown, incrementPostOpen } =
    useAdStore();

  useEffect(() => {
    const ad = InterstitialAd.createForAdRequest(adUnitId);

    const loadListener = ad.addAdEventListener(AdEventType.LOADED, () => {
      loadedRef.current = true;
    });

    const closeListener = ad.addAdEventListener(AdEventType.CLOSED, () => {
      loadedRef.current = false;
      ad.load();
    });

    ad.load();
    adRef.current = ad;

    return () => {
      loadListener();
      closeListener();
    };
  }, []);

  const showIfReady = useCallback(() => {
    incrementPostOpen();
    if (shouldShowInterstitial() && loadedRef.current && adRef.current) {
      adRef.current.show();
      markInterstitialShown();
    }
  }, [shouldShowInterstitial, markInterstitialShown, incrementPostOpen]);

  return { showIfReady };
}
