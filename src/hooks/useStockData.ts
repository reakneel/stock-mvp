'use client';

import { useEffect, useState } from 'react';
import { StockData } from '@/types';
import { fetchStockData } from '@/lib/stock';
import { isTradingHours } from '@/lib/stock';

export function useStockData(codes: string[]) {
  const [data, setData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (codes.length === 0) {
      setData([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const result = await fetchStockData(codes);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // 交易时间内自动刷新
    const interval = setInterval(() => {
      if (isTradingHours()) {
        fetchData();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [codes.join(',')]);

  return { data, loading, error, refetch: fetchData };
}
