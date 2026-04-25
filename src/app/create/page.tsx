'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface HoldingInput {
  stockCode: string;
  stockName: string;
  quantity?: number;
  weight?: number;
  avgCost: number;
}

export default function CreatePortfolioPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [type, setType] = useState<'real' | 'simulation'>('real');
  const [holdings, setHoldings] = useState<HoldingInput[]>([]);
  const [currentHolding, setCurrentHolding] = useState<Partial<HoldingInput>>({
    stockCode: '',
    stockName: '',
    avgCost: 0,
  });

  const addHolding = () => {
    if (!currentHolding.stockCode || !currentHolding.avgCost) return;
    
    setHoldings([...holdings, {
      stockCode: currentHolding.stockCode,
      stockName: currentHolding.stockName || currentHolding.stockCode,
      quantity: type === 'real' ? currentHolding.quantity : undefined,
      weight: type === 'simulation' ? currentHolding.weight : undefined,
      avgCost: currentHolding.avgCost,
    }]);
    
    setCurrentHolding({ stockCode: '', stockName: '', avgCost: 0 });
  };

  const removeHolding = (index: number) => {
    setHoldings(holdings.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || holdings.length === 0) {
      alert('请填写组合名称并添加至少一只股票');
      return;
    }

    // MVP 阶段：生成模拟 ID 并跳转
    const portfolioId = `demo_${Date.now()}`;
    
    // TODO: 实际应用中应调用 API 保存到数据库
    console.log('Creating portfolio:', {
      id: portfolioId,
      name,
      type,
      holdings,
    });

    router.push(`/portfolio/${portfolioId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm" icon={ArrowLeft}>返回</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">创建新组合</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本信息 */}
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">组合名称</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="例如：我的成长股组合"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">组合类型</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="real"
                      checked={type === 'real'}
                      onChange={() => setType('real')}
                      className="mr-2"
                    />
                    实盘组合（记录持仓数量）
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="simulation"
                      checked={type === 'simulation'}
                      onChange={() => setType('simulation')}
                      className="mr-2"
                    />
                    模拟组合（仅记录仓位比例）
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 添加持仓 */}
          <Card>
            <CardHeader>
              <CardTitle>添加持仓</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">股票代码</label>
                  <input
                    type="text"
                    value={currentHolding.stockCode || ''}
                    onChange={(e) => setCurrentHolding({...currentHolding, stockCode: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="600519"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">股票名称</label>
                  <input
                    type="text"
                    value={currentHolding.stockName || ''}
                    onChange={(e) => setCurrentHolding({...currentHolding, stockName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="贵州茅台"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">成本价</label>
                  <input
                    type="number"
                    step="0.01"
                    value={currentHolding.avgCost || ''}
                    onChange={(e) => setCurrentHolding({...currentHolding, avgCost: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {type === 'real' ? (
                <div>
                  <label className="block text-sm font-medium mb-1">持仓数量</label>
                  <input
                    type="number"
                    value={currentHolding.quantity || ''}
                    onChange={(e) => setCurrentHolding({...currentHolding, quantity: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="100"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-1">仓位比例 (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={currentHolding.weight || ''}
                    onChange={(e) => setCurrentHolding({...currentHolding, weight: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="25.0"
                  />
                </div>
              )}

              <Button type="button" onClick={addHolding} icon={Plus}>
                添加到组合
              </Button>

              {/* 持仓列表 */}
              {holdings.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">已添加的持仓：</h3>
                  <ul className="space-y-2">
                    {holdings.map((holding, index) => (
                      <li key={index} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-2 rounded">
                        <span>
                          {holding.stockName} ({holding.stockCode}) - 
                          成本：¥{holding.avgCost} - 
                          {type === 'real' ? `${holding.quantity}股` : `${holding.weight}%`}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeHolding(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full">
            创建组合
          </Button>
        </form>
      </main>
    </div>
  );
}
