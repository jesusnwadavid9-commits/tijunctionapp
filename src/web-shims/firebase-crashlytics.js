// Web shim for @react-native-firebase/crashlytics
const crashlytics = () => ({
  log: () => Promise.resolve(),
  recordError: () => Promise.resolve(),
  setCrashlyticsCollectionEnabled: () => Promise.resolve(),
  setUserId: () => Promise.resolve(),
});
export default crashlytics;
