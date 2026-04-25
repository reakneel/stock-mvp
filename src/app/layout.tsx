import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '股票组合监视平台',
  description: '实时监控您的投资组合表现，追踪全球市场指数',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
