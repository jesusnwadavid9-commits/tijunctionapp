// Web shim for @react-native-firebase/auth
const noop = () => Promise.resolve();
const auth = () => ({
  currentUser: null,
  signInWithEmailAndPassword: noop,
  createUserWithEmailAndPassword: noop,
  signOut: noop,
  sendPasswordResetEmail: noop,
  onAuthStateChanged: (cb) => { cb(null); return () => {}; },
  onUserChanged: () => () => {},
});
export default auth;
