import { useQuery } from '@tanstack/react-query';
import { DataRow } from '../types/types';

const fetchData = async (): Promise<DataRow[]> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/data`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  return result.data;
};

export const useData = () => {
  return useQuery<DataRow[]>({
    queryKey: ['data'],
    queryFn: fetchData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime)
    retry: 2, // Retry failed queries up to 2 times
    refetchOnWindowFocus: false, // Disable refetch on window focus
  });
};