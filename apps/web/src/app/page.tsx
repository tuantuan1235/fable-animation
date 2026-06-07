import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">寓言动画创作平台</h1>
          <p className="text-gray-500 mt-1">把寓言想法变成可发布的短视频</p>
        </div>
        <Link
          href="/editor/new"
          className="px-6 py-3 bg-fable-500 text-white rounded-lg font-medium hover:bg-fable-600 transition-colors"
        >
          + 新建剧本
        </Link>
      </header>

      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">开始创作你的第一个寓言</h2>
        <p className="text-gray-500 mb-6">
          点击「新建剧本」，从灵感捕获到一键出片，全流程搞定
        </p>
        <Link
          href="/editor/new"
          className="inline-block px-8 py-3 bg-fable-500 text-white rounded-lg font-medium hover:bg-fable-600 transition-colors"
        >
          开始创作
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="text-3xl mb-3">💡</div>
          <h3 className="font-semibold text-gray-800 mb-1">灵感捕获</h3>
          <p className="text-sm text-gray-500">输入寓言概念，系统帮你拆分 scene 结构</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="text-3xl mb-3">🎬</div>
          <h3 className="font-semibold text-gray-800 mb-1">剧本编辑</h3>
          <p className="text-sm text-gray-500">表格化录入旁白、动作、时长，实时校验</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="text-3xl mb-3">🚀</div>
          <h3 className="font-semibold text-gray-800 mb-1">一键出片</h3>
          <p className="text-sm text-gray-500">配音 + 渲染 + 字幕，输出完整 mp4</p>
        </div>
      </div>
    </main>
  );
}
