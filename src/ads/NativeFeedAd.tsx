import React, { memo } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, ADMOB_IDS } from '@/constants';

const adUnitId = Platform.select({
  android: ADMOB_IDS.native.android,
  ios: ADMOB_IDS.native.ios,
  default: ADMOB_IDS.native.android,
});

function NativeFeedAdInner() {
  // react-native-google-mobile-ads native ads require native views
  // For now, render a placeholder that will be replaced with the actual native ad
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Sponsored</Text>
      <View style={styles.adContent}>
        <Text style={styles.adText}>Ad Unit: {adUnitId}</Text>
        <Text style={styles.adNote}>Native ad will render here</Text>
      </View>
    </View>
  );
}

export const NativeFeedAd = memo(NativeFeedAdInner);

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroundSecondary,
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  label: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  adContent: {
    minHeight: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  adNote: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
});
