// Web shim for @react-native-firebase/analytics
const analytics = () => ({
  logEvent: () => Promise.resolve(),
  setAnalyticsCollectionEnabled: () => Promise.resolve(),
  setUserId: () => Promise.resolve(),
});
export default analytics;
