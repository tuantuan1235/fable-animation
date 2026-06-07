import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '寓言动画创作平台',
  description: '让单人创作者在1小时内把寓言想法变成可发布的短视频',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-[var(--bg)]">{children}</body>
    </html>
  );
}
