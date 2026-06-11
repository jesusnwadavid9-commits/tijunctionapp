// Web shim for @react-native-firebase/messaging
const messaging = () => ({
  getToken: () => Promise.resolve('web-placeholder-token'),
  onMessage: () => () => {},
  onTokenRefresh: () => () => {},
  requestPermission: () => Promise.resolve(1),
  hasPermission: () => Promise.resolve(true),
});
messaging.AuthorizationStatus = { AUTHORIZED: 1, DENIED: 0, NOT_DETERMINED: -1, PROVISIONAL: 2 };
export default messaging;
