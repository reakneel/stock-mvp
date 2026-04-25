'use client';

import { StockData } from '@/types';
import { cn, formatNumber, formatPercent } from '@/lib/utils';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StockCardProps {
  stock: StockData;
}

export function StockCard({ stock }: StockCardProps) {
  const isPositive = stock.change >= 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{stock.name}</h3>
          <p className="text-sm text-gray-500">{stock.code.toUpperCase()}</p>
        </div>
        <div className={cn(
          'flex items-center px-2 py-1 rounded text-sm font-medium',
          isPositive ? 'bg-red-50 text-red-600 dark:bg-red-900/20' : 'bg-green-50 text-green-600 dark:bg-green-900/20'
        )}>
          {isPositive ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
          {formatPercent(stock.changePercent)}
        </div>
      </div>
      
      <div className="mt-3">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          ¥{formatNumber(stock.price)}
        </p>
        <p className={cn(
          'text-sm mt-1',
          isPositive ? 'text-red-600' : 'text-green-600'
        )}>
          {isPositive ? '+' : ''}{formatNumber(stock.change)} ({formatPercent(stock.changePercent)})
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div>
          <p className="text-xs text-gray-500">最高</p>
          <p className="text-sm font-medium">{formatNumber(stock.high)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">最低</p>
          <p className="text-sm font-medium">{formatNumber(stock.low)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">成交量</p>
          <p className="text-sm font-medium">{(stock.volume / 10000).toFixed(0)}万手</p>
        </div>
      </div>
    </div>
  );
}
