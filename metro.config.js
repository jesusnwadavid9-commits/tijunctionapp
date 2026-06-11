const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

const webShims = {
  '@react-native-firebase/app': path.resolve(__dirname, 'src/web-shims/firebase-app.js'),
  '@react-native-firebase/auth': path.resolve(__dirname, 'src/web-shims/firebase-auth.js'),
  '@react-native-firebase/firestore': path.resolve(__dirname, 'src/web-shims/firebase-firestore.js'),
  '@react-native-firebase/storage': path.resolve(__dirname, 'src/web-shims/firebase-storage.js'),
  '@react-native-firebase/messaging': path.resolve(__dirname, 'src/web-shims/firebase-messaging.js'),
  '@react-native-firebase/analytics': path.resolve(__dirname, 'src/web-shims/firebase-analytics.js'),
  '@react-native-firebase/crashlytics': path.resolve(__dirname, 'src/web-shims/firebase-crashlytics.js'),
  'react-native-google-mobile-ads': path.resolve(__dirname, 'src/web-shims/google-mobile-ads.js'),
};

const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && webShims[moduleName]) {
    return {
      filePath: webShims[moduleName],
      type: 'sourceFile',
    };
  }
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './global.css' });
