import dynamic from 'next/dynamic';

// 动态导入客户端编辑器组件，禁用 SSR
const StoryboardEditor = dynamic(
  () => import('./StoryboardEditor'),
  { ssr: false }
);

export default function EditorPage() {
  return <StoryboardEditor />;
}
