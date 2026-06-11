// Web shim for @react-native-firebase/storage
const storage = () => ({
  ref: () => ({
    putFile: () => Promise.resolve({ state: 'success' }),
    getDownloadURL: () => Promise.resolve('https://placeholder.co/400'),
    child: () => storage().ref(),
  }),
});
export default storage;
