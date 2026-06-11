import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchUsers } from '@/services/userService';

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const updateQuery = useCallback((text: string) => {
    setSearchQuery(text);
    // Simple debounce via setTimeout
    const timer = setTimeout(() => setDebouncedQuery(text), 300);
    return () => clearTimeout(timer);
  }, []);

  const usersQuery = useQuery({
    queryKey: ['searchUsers', debouncedQuery],
    queryFn: () => searchUsers(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
  });

  return {
    searchQuery,
    updateQuery,
    users: usersQuery.data ?? [],
    isLoading: usersQuery.isLoading,
  };
}
