'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StockCard } from '@/components/features/StockCard';
import { TrendChart } from '@/components/features/TrendChart';
import { useStockData } from '@/hooks/useStockData';
import { ArrowLeft, Share2 } from 'lucide-react';
import { formatNumber, formatPercent } from '@/lib/utils';

// 模拟组合数据（MVP 阶段）
const DEMO_HOLDINGS = [
  { code: 'sh600519', name: '贵州茅台', quantity: 100, avgCost: 1700 },
  { code: 'sz000858', name: '五粮液', quantity: 200, avgCost: 150 },
  { code: 'sh601318', name: '中国平安', quantity: 500, avgCost: 45 },
  { code: 'sz000333', name: '美的集团', quantity: 300, avgCost: 55 },
];

export default function PortfolioDetailPage() {
  const params = useParams();
  const id = params.id as string;

  // 获取持仓股票代码
  const stockCodes = DEMO_HOLDINGS.map(h => h.code);
  const { data: stocks, loading, refetch } = useStockData(stockCodes);

  // 计算组合统计
  const stats = (() => {
    if (!stocks || stocks.length === 0) return null;

    let totalValue = 0;
    let totalCost = 0;

    DEMO_HOLDINGS.forEach(holding => {
      const stock = stocks.find(s => s.code === holding.code.toLowerCase().replace('_', ''));
      if (stock && holding.quantity) {
        totalValue += stock.price * holding.quantity;
        totalCost += holding.avgCost * holding.quantity;
      }
    });

    const profit = totalValue - totalCost;
    const profitRate = totalCost > 0 ? (profit / totalCost) * 100 : 0;

    return { totalValue, totalCost, profit, profitRate };
  })();

  // 生成趋势数据
  const trendData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    value: stats ? stats.totalValue * (1 + Math.random() * 0.2 - 0.1) : 100,
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" icon={ArrowLeft}>返回</Button>
              </Link>
              <h1 className="text-2xl font-bold">演示组合</h1>
            </div>
            <Button variant="outline" icon={Share2}>分享</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 组合概览 */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-gray-500">总市值</p>
                <p className="text-3xl font-bold mt-2">
                  ¥{formatNumber(stats?.totalValue || 0)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-gray-500">总成本</p>
                <p className="text-3xl font-bold mt-2">
                  ¥{formatNumber(stats?.totalCost || 0)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-gray-500">累计盈亏</p>
                <p className={`text-3xl font-bold mt-2 ${stats && stats.profit >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {stats && stats.profit >= 0 ? '+' : ''}¥{formatNumber(stats?.profit || 0)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-gray-500">收益率</p>
                <p className={`text-3xl font-bold mt-2 ${stats && stats.profitRate >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {stats && stats.profitRate >= 0 ? '+' : ''}{formatPercent(stats?.profitRate || 0)}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 收益趋势 */}
        <section className="mb-8">
          <TrendChart title="30 天收益趋势" data={trendData} height={250} />
        </section>

        {/* 持仓明细 */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">持仓明细</h2>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              刷新行情
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8">加载中...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stocks.map((stock) => (
                <StockCard key={stock.code} stock={stock} />
              ))}
            </div>
          )}

          {/* 持仓列表表格 */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>持仓列表</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium">股票名称</th>
                      <th className="text-right py-3 px-4 font-medium">持仓数量</th>
                      <th className="text-right py-3 px-4 font-medium">成本价</th>
                      <th className="text-right py-3 px-4 font-medium">当前价</th>
                      <th className="text-right py-3 px-4 font-medium">市值</th>
                      <th className="text-right py-3 px-4 font-medium">盈亏</th>
                      <th className="text-right py-3 px-4 font-medium">盈亏率</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEMO_HOLDINGS.map((holding) => {
                      const stock = stocks.find(s => s.code === holding.code.toLowerCase().replace('_', ''));
                      const currentPrice = stock?.price || 0;
                      const marketValue = currentPrice * (holding.quantity || 0);
                      const costValue = holding.avgCost * (holding.quantity || 0);
                      const profit = marketValue - costValue;
                      const profitRate = costValue > 0 ? (profit / costValue) * 100 : 0;

                      return (
                        <tr key={holding.code} className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{holding.name}</p>
                              <p className="text-sm text-gray-500">{holding.code}</p>
                            </div>
                          </td>
                          <td className="text-right py-3 px-4">{holding.quantity}</td>
                          <td className="text-right py-3 px-4">¥{formatNumber(holding.avgCost)}</td>
                          <td className="text-right py-3 px-4">
                            <span className={stock && stock.change >= 0 ? 'text-red-600' : 'text-green-600'}>
                              ¥{formatNumber(currentPrice)}
                            </span>
                          </td>
                          <td className="text-right py-3 px-4">¥{formatNumber(marketValue)}</td>
                          <td className={`text-right py-3 px-4 ${profit >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {profit >= 0 ? '+' : ''}¥{formatNumber(profit)}
                          </td>
                          <td className={`text-right py-3 px-4 ${profitRate >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {formatPercent(profitRate)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
