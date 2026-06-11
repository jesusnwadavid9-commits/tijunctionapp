import { useEffect } from 'react';
import { auth } from '@/firebase/config';
import { useAuthStore } from '@/store/authStore';
import { getCurrentUser } from '@/services/authService';

export function useAuthListener() {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const user = await getCurrentUser();
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [setUser, setLoading]);
}
