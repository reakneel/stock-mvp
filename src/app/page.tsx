import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TrendChart } from '@/components/features/TrendChart';
import { StockCard } from '@/components/features/StockCard';
import { fetchIndexData, fetchFuturesData } from '@/lib/stock';
import { Plus, TrendingUp, BarChart3, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: '股票组合监视平台',
  description: '实时监控您的投资组合表现，追踪全球市场指数',
};

// 模拟持仓数据（MVP 阶段）
const WATCHLIST_STOCKS = ['sh600519', 'sz000858', 'sh601318', 'sz000333'];

export default async function HomePage() {
  // 服务端获取指数和期货数据
  const [indices, futures] = await Promise.all([
    fetchIndexData(),
    fetchFuturesData(),
  ]);

  // 生成模拟趋势数据
  const trendData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    value: 100 + Math.random() * 20 - 10,
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              股票组合监视平台
            </h1>
            <Link href="/create">
              <Button icon={Plus}>创建组合</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 全球市场概览 */}
        <section className="mb-8">
          <div className="flex items-center mb-4">
            <Globe className="w-5 h-5 mr-2 text-blue-600" />
            <h2 className="text-xl font-semibold">全球市场</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {indices.slice(0, 5).map((index) => (
              <Card key={index.symbol}>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-500">{index.name}</p>
                  <p className="text-lg font-bold mt-1">{index.price.toFixed(2)}</p>
                  <p className={`text-sm ${index.change >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {index.change >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 期货市场 */}
        <section className="mb-8">
          <div className="flex items-center mb-4">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
            <h2 className="text-xl font-semibold">期货市场</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {futures.map((future) => (
              <Card key={future.symbol}>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-500">{future.name}</p>
                  <p className="text-lg font-bold mt-1">{future.price.toFixed(2)}</p>
                  <p className={`text-sm ${future.change >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {future.change >= 0 ? '+' : ''}{future.changePercent.toFixed(2)}%
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 收益趋势 */}
        <section className="mb-8">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            <h2 className="text-xl font-semibold">30 天收益趋势</h2>
          </div>
          <TrendChart data={trendData} height={250} />
        </section>

        {/* 自选股 */}
        <section>
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold">热门股票</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {WATCHLIST_STOCKS.map((code) => (
              <StockCard 
                key={code} 
                stock={{
                  code,
                  name: '加载中...',
                  price: 0,
                  change: 0,
                  changePercent: 0,
                  open: 0,
                  high: 0,
                  low: 0,
                  close: 0,
                  volume: 0,
                }} 
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            提示：股票数据将在客户端自动刷新（交易时间每 5 秒更新）
          </p>
        </section>
      </main>

      <footer className="mt-12 py-6 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>数据来源：新浪财经 API | 仅供学习参考，不构成投资建议</p>
        </div>
      </footer>
    </div>
  );
}
