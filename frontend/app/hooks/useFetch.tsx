import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { paths } from '~/constants/paths';

export default function useFetch<T>(url: string) {
  let navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refetch, setRefetch] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) {
          if (res.status == 401) navigate(paths.root);
          throw new Error(`Error: ${res.statusText}`);
        }
        setData(await res.json());
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        alert(msg);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [refetch]);

  return { data, isLoading, refetch, setRefetch };
}
