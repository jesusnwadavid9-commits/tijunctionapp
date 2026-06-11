// Web shim for @react-native-firebase/firestore
const noopQuery = {
  get: () => Promise.resolve({ docs: [], empty: true, size: 0 }),
  onSnapshot: () => () => {},
  where: () => noopQuery,
  orderBy: () => noopQuery,
  limit: () => noopQuery,
  startAfter: () => noopQuery,
};
const noopDoc = {
  get: () => Promise.resolve({ exists: () => false, data: () => null }),
  set: () => Promise.resolve(),
  update: () => Promise.resolve(),
  delete: () => Promise.resolve(),
  collection: () => noopQuery,
  onSnapshot: () => () => {},
};
const noopCollection = Object.assign(
  () => noopQuery,
  noopQuery,
  { doc: () => noopDoc, add: () => Promise.resolve(noopDoc) }
);

const firestore = () => ({
  collection: () => noopCollection,
  doc: () => noopDoc,
  batch: () => ({
    set: () => {},
    update: () => {},
    delete: () => {},
    commit: () => Promise.resolve(),
  }),
  settings: () => {},
});

firestore.FieldValue = {
  serverTimestamp: () => new Date(),
  increment: (n) => n,
  arrayUnion: (...args) => args,
  arrayRemove: (...args) => args,
};
firestore.Timestamp = {
  now: () => ({ toDate: () => new Date() }),
  fromDate: (d) => ({ toDate: () => d }),
};
firestore.CACHE_SIZE_UNLIMITED = -1;

export default firestore;
