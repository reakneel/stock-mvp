import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface SharePageProps {
  params: Promise<{ shortCode: string }>;
}

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const { shortCode } = await params;
  return {
    title: `组合分享 - ${shortCode}`,
    description: '查看分享的投资组合',
  };
}

export default async function SharePage({ params }: SharePageProps) {
  const { shortCode } = await params;
  
  // MVP 阶段：短码功能待实现
  // TODO: 根据短码查询组合并展示
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">分享链接</h1>
        <p className="text-gray-600 mb-6">短码：{shortCode}</p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-yellow-800">
            🚧 分享功能开发中...
          </p>
          <p className="text-yellow-700 text-sm mt-2">
            该功能将在后续版本中实现，支持通过短码安全分享投资组合
          </p>
        </div>
      </div>
    </div>
  );
}
