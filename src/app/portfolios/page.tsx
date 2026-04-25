import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '组合列表 - 股票组合监视平台',
  description: '查看和管理您的所有投资组合',
};

// MVP 阶段：模拟组合列表
const DEMO_PORTFOLIOS = [
  { id: 'demo_1', name: '我的成长股组合', type: 'real' as const, createdAt: new Date() },
  { id: 'demo_2', name: '价值投资模拟盘', type: 'simulation' as const, createdAt: new Date() },
];

export default function PortfoliosPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold">我的组合</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">共 {DEMO_PORTFOLIOS.length} 个组合</p>
          <Link href="/create" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            创建新组合
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEMO_PORTFOLIOS.map((portfolio) => (
            <Link 
              key={portfolio.id} 
              href={`/portfolio/${portfolio.id}`}
              className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{portfolio.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {portfolio.type === 'real' ? '实盘组合' : '模拟组合'}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  portfolio.type === 'real' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {portfolio.type === 'real' ? '实盘' : '模拟'}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                创建于 {portfolio.createdAt.toLocaleDateString('zh-CN')}
              </p>
            </Link>
          ))}
        </div>

        {DEMO_PORTFOLIOS.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">暂无组合</p>
            <Link href="/create" className="text-blue-600 hover:underline">
              创建第一个组合
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
