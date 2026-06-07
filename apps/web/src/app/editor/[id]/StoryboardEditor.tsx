'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  type Scene,
  type Storyboard,
  type ValidationResult,
  createEmptyScene,
  createEmptyStoryboard,
  validateStoryboard,
  totalSceneDuration,
  estimateNarrationDuration,
  generateId,
} from '@fable/shared';

// ============ 动作选项 ============
const ACTION_OPTIONS = [
  { value: 'stand', label: '站立' },
  { value: 'walk', label: '走路' },
  { value: 'run', label: '跑步' },
  { value: 'sit', label: '坐下' },
  { value: 'point', label: '指向' },
  { value: 'think', label: '思考' },
  { value: 'wave', label: '挥手' },
  { value: 'shrug', label: '耸肩' },
  { value: 'nod', label: '点头' },
  { value: 'shake_head', label: '摇头' },
  { value: 'laugh', label: '大笑' },
  { value: 'cry', label: '哭泣' },
  { value: 'surprised', label: '惊讶' },
  { value: 'angry', label: '生气' },
];

const BACKGROUND_PRESETS = [
  { color: '#FFF8E7', label: '暖黄' },
  { color: '#E8F5E9', label: '浅绿' },
  { color: '#E3F2FD', label: '浅蓝' },
  { color: '#FCE4EC', label: '浅粉' },
  { color: '#F3E5F5', label: '浅紫' },
  { color: '#FFF3E0', label: '浅橙' },
  { color: '#E0E0E0', label: '灰色' },
  { color: '#FFFFFF', label: '白色' },
];

export default function StoryboardEditor() {
  const [storyboard, setStoryboard] = useState<Storyboard>(createEmptyStoryboard());
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  // 实时校验
  const validation: ValidationResult = useMemo(
    () => validateStoryboard(storyboard),
    [storyboard]
  );

  // 总时长统计
  const totalDuration = useMemo(
    () => totalSceneDuration(storyboard.scenes),
    [storyboard.scenes]
  );

  // 更新 storyboard 字段
  const updateMeta = useCallback(
    (field: keyof Storyboard, value: any) => {
      setStoryboard((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // 更新单个 scene
  const updateScene = useCallback(
    (index: number, updates: Partial<Scene>) => {
      setStoryboard((prev) => {
        const newScenes = [...prev.scenes];
        newScenes[index] = { ...newScenes[index], ...updates };
        return { ...prev, scenes: newScenes, updatedAt: new Date().toISOString() };
      });
    },
    []
  );

  // 添加 scene
  const addScene = useCallback(() => {
    setStoryboard((prev) => ({
      ...prev,
      scenes: [...prev.scenes, createEmptyScene(prev.scenes.length)],
      updatedAt: new Date().toISOString(),
    }));
    setActiveSceneIndex(storyboard.scenes.length);
  }, [storyboard.scenes.length]);

  // 删除 scene
  const deleteScene = useCallback(
    (index: number) => {
      if (storyboard.scenes.length <= 1) return;
      setStoryboard((prev) => ({
        ...prev,
        scenes: prev.scenes.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i })),
        updatedAt: new Date().toISOString(),
      }));
      if (activeSceneIndex >= storyboard.scenes.length - 1) {
        setActiveSceneIndex(Math.max(0, storyboard.scenes.length - 2));
      }
    },
    [storyboard.scenes.length, activeSceneIndex]
  );

  // 复制 scene
  const duplicateScene = useCallback(
    (index: number) => {
      setStoryboard((prev) => {
        const source = prev.scenes[index];
        const newScene: Scene = { ...source, id: generateId(), order: index + 1 };
        const newScenes = [
          ...prev.scenes.slice(0, index + 1),
          newScene,
          ...prev.scenes.slice(index + 1).map((s, i) => ({ ...s, order: index + 2 + i })),
        ];
        return { ...prev, scenes: newScenes, updatedAt: new Date().toISOString() };
      });
      setActiveSceneIndex(index + 1);
    },
    []
  );

  // 移动 scene
  const moveScene = useCallback(
    (index: number, direction: 'up' | 'down') => {
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= storyboard.scenes.length) return;
      setStoryboard((prev) => {
        const newScenes = [...prev.scenes];
        [newScenes[index], newScenes[newIndex]] = [newScenes[newIndex], newScenes[index]];
        return {
          ...prev,
          scenes: newScenes.map((s, i) => ({ ...s, order: i })),
          updatedAt: new Date().toISOString(),
        };
      });
      setActiveSceneIndex(newIndex);
    },
    [storyboard.scenes.length]
  );

  const activeScene = storyboard.scenes[activeSceneIndex];
  const activeSceneValidation = useMemo(() => {
    const sceneErrors = validation.errors.filter((e) => e.sceneId === activeScene?.id);
    const sceneWarnings = validation.warnings.filter((w) => w.sceneId === activeScene?.id);
    return { errors: sceneErrors, warnings: sceneWarnings };
  }, [validation, activeScene]);

  const narrationEstimate = activeScene
    ? estimateNarrationDuration(activeScene.narration)
    : 0;

  return (
    <div className="h-screen flex flex-col">
      {/* 顶部导航栏 */}
      <header className="h-14 border-b border-gray-200 bg-white flex items-center px-4 gap-4 shrink-0">
        <a href="/" className="text-amber-500 font-bold text-lg">寓言</a>
        <div className="h-6 w-px bg-gray-200" />
        <input
          type="text"
          value={storyboard.title}
          onChange={(e) => updateMeta('title', e.target.value)}
          className="text-lg font-medium border-none outline-none bg-transparent flex-1"
          placeholder="输入剧本标题..."
        />

        {/* 时长统计 */}
        <div className="flex items-center gap-2 text-sm">
          <span className={totalDuration > storyboard.targetDurationSeconds ? 'text-red-500 font-semibold' : 'text-gray-600'}>
            {totalDuration.toFixed(1)}s
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">{storyboard.targetDurationSeconds}s</span>
        </div>

        {/* 校验状态 */}
        {!validation.valid && (
          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
            {validation.errors.length} 个错误
          </span>
        )}
        {validation.warnings.length > 0 && validation.valid && (
          <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded">
            {validation.warnings.length} 个警告
          </span>
        )}

        <div className="flex gap-2">
          <button className="px-4 py-1.5 text-sm bg-amber-500 text-white rounded hover:bg-amber-600 font-medium">
            出片
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：Scene 列表 */}
        <aside className="w-64 border-r border-gray-200 bg-gray-50 flex flex-col shrink-0">
          <div className="p-3 border-b border-gray-200 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Scenes ({storyboard.scenes.length})
            </span>
            <button
              onClick={addScene}
              className="text-sm text-amber-600 hover:text-amber-700 font-medium"
            >
              + 添加
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {storyboard.scenes.map((scene, index) => {
              const hasError = validation.errors.some((e) => e.sceneId === scene.id);
              const est = estimateNarrationDuration(scene.narration);
              const overDuration = est > scene.durationSeconds;

              return (
                <div
                  key={scene.id}
                  onClick={() => setActiveSceneIndex(index)}
                  className={`p-3 rounded-lg cursor-pointer text-sm transition-colors ${
                    index === activeSceneIndex
                      ? 'bg-amber-100 border border-amber-300'
                      : 'bg-white border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-700">#{index + 1}</span>
                    <div className="flex items-center gap-1">
                      {hasError && <span className="w-2 h-2 rounded-full bg-red-500" />}
                      {overDuration && <span className="w-2 h-2 rounded-full bg-yellow-500" />}
                      <span className="text-xs text-gray-400">{scene.durationSeconds}s</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {scene.narration || '(空)'}
                  </p>
                </div>
              );
            })}
          </div>
        </aside>

        {/* 中间：Scene 编辑器 */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeScene && (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* 旁白文本 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  旁白文本
                  <span className="text-xs text-gray-400 ml-2">
                    预估 {narrationEstimate.toFixed(1)}s
                    {narrationEstimate > activeScene.durationSeconds && (
                      <span className="text-red-500 ml-1">
                        (超出 {narrationEstimate.toFixed(1)}s &gt; {activeScene.durationSeconds}s)
                      </span>
                    )}
                  </span>
                </label>
                <textarea
                  value={activeScene.narration}
                  onChange={(e) => updateScene(activeSceneIndex, { narration: e.target.value })}
                  className={`w-full h-28 p-3 border rounded-lg text-sm resize-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 outline-none ${
                    narrationEstimate > activeScene.durationSeconds
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300'
                  }`}
                  placeholder="输入这个场景的旁白文本..."
                />
              </div>

              {/* 时长 + 动作 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">时长（秒）</label>
                  <input
                    type="number"
                    value={activeScene.durationSeconds}
                    onChange={(e) =>
                      updateScene(activeSceneIndex, {
                        durationSeconds: Math.max(0.5, parseFloat(e.target.value) || 0),
                      })
                    }
                    min={0.5}
                    max={30}
                    step={0.5}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-300 focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">角色动作</label>
                  <select
                    value={activeScene.characters[0]?.action || 'stand'}
                    onChange={(e) =>
                      updateScene(activeSceneIndex, {
                        characters: [{ ...activeScene.characters[0], action: e.target.value as any }],
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-300 focus:border-amber-400 outline-none"
                  >
                    {ACTION_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 角色位置 */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    X 位置 ({activeScene.characters[0]?.x}%)
                  </label>
                  <input
                    type="range"
                    min={10}
                    max={90}
                    value={activeScene.characters[0]?.x || 50}
                    onChange={(e) =>
                      updateScene(activeSceneIndex, {
                        characters: [{ ...activeScene.characters[0], x: parseInt(e.target.value) }],
                      })
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    缩放 ({activeScene.characters[0]?.scale.toFixed(1)}x)
                  </label>
                  <input
                    type="range"
                    min={0.5}
                    max={2}
                    step={0.1}
                    value={activeScene.characters[0]?.scale || 1}
                    onChange={(e) =>
                      updateScene(activeSceneIndex, {
                        characters: [{ ...activeScene.characters[0], scale: parseFloat(e.target.value) }],
                      })
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">朝向</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        updateScene(activeSceneIndex, {
                          characters: [{ ...activeScene.characters[0], facingLeft: true }],
                        })
                      }
                      className={`flex-1 py-2 text-sm rounded border ${
                        activeScene.characters[0]?.facingLeft
                          ? 'bg-amber-100 border-amber-300 text-amber-700'
                          : 'border-gray-300 text-gray-500'
                      }`}
                    >
                      ← 左
                    </button>
                    <button
                      onClick={() =>
                        updateScene(activeSceneIndex, {
                          characters: [{ ...activeScene.characters[0], facingLeft: false }],
                        })
                      }
                      className={`flex-1 py-2 text-sm rounded border ${
                        !activeScene.characters[0]?.facingLeft
                          ? 'bg-amber-100 border-amber-300 text-amber-700'
                          : 'border-gray-300 text-gray-500'
                      }`}
                    >
                      右 →
                    </button>
                  </div>
                </div>
              </div>

              {/* 背景 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">背景颜色</label>
                <div className="flex gap-2">
                  {BACKGROUND_PRESETS.map((preset) => (
                    <button
                      key={preset.color}
                      onClick={() =>
                        updateScene(activeSceneIndex, {
                          background: { ...activeScene.background, color: preset.color },
                        })
                      }
                      className={`w-10 h-10 rounded-lg border-2 transition-transform hover:scale-110 ${
                        activeScene.background.color === preset.color
                          ? 'border-amber-500 scale-110'
                          : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: preset.color }}
                      title={preset.label}
                    />
                  ))}
                </div>
              </div>

              {/* 备注 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
                <input
                  type="text"
                  value={activeScene.notes || ''}
                  onChange={(e) => updateScene(activeSceneIndex, { notes: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-300 focus:border-amber-400 outline-none"
                  placeholder="添加备注..."
                />
              </div>

              {/* Scene 操作按钮 */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => moveScene(activeSceneIndex, 'up')}
                  disabled={activeSceneIndex === 0}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-30"
                >
                  ↑ 上移
                </button>
                <button
                  onClick={() => moveScene(activeSceneIndex, 'down')}
                  disabled={activeSceneIndex === storyboard.scenes.length - 1}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-30"
                >
                  ↓ 下移
                </button>
                <button
                  onClick={() => duplicateScene(activeSceneIndex)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  复制
                </button>
                <button
                  onClick={() => deleteScene(activeSceneIndex)}
                  disabled={storyboard.scenes.length <= 1}
                  className="px-3 py-1.5 text-sm border border-red-300 text-red-500 rounded hover:bg-red-50 disabled:opacity-30"
                >
                  删除
                </button>
              </div>

              {/* 校验反馈 */}
              {(activeSceneValidation.errors.length > 0 || activeSceneValidation.warnings.length > 0) && (
                <div className="mt-4 space-y-2">
                  {activeSceneValidation.errors.map((err, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                      <span className="font-medium">错误:</span> {err.message}
                    </div>
                  ))}
                  {activeSceneValidation.warnings.map((warn, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                      <span className="font-medium">警告:</span> {warn.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>

        {/* 右侧：预览面板 */}
        <aside className="w-80 border-l border-gray-200 bg-gray-50 flex flex-col shrink-0">
          <div className="p-3 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">画面预览</span>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <div
              className="relative rounded-lg overflow-hidden shadow-md"
              style={{
                width: 180,
                height: 320,
                backgroundColor: activeScene?.background.color || '#FFF8E7',
              }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <div className="text-3xl mb-2">
                  {activeScene?.characters[0]?.facingLeft ? '←' : '→'}{' '}
                  {ACTION_OPTIONS.find((a) => a.value === activeScene?.characters[0]?.action)?.label || '站立'}
                </div>
                <p className="text-xs text-gray-600 mt-2 line-clamp-4">
                  {activeScene?.narration || '(空)'}
                </p>
                <div className="mt-auto text-xs text-gray-400">
                  {activeScene?.durationSeconds}s · #{activeSceneIndex + 1}
                </div>
              </div>
            </div>
          </div>

          {/* 剧本元信息 */}
          <div className="p-4 border-t border-gray-200 space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">目标时长（秒）</label>
              <input
                type="number"
                value={storyboard.targetDurationSeconds}
                onChange={(e) =>
                  updateMeta('targetDurationSeconds', Math.max(5, parseInt(e.target.value) || 30))
                }
                min={5}
                max={60}
                className="w-full p-2 border border-gray-300 rounded text-sm outline-none focus:ring-1 focus:ring-amber-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">画幅</label>
              <select
                value={storyboard.aspectRatio}
                onChange={(e) => updateMeta('aspectRatio', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm outline-none"
              >
                <option value="9:16">竖屏 9:16</option>
                <option value="16:9">横屏 16:9</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">TTS 声线</label>
              <select
                value={storyboard.ttsVoice}
                onChange={(e) => updateMeta('ttsVoice', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm outline-none"
              >
                <option value="male-qn-qingse">青涩青年</option>
                <option value="male-qn-jingying">精英青年</option>
                <option value="female-shaonv">少女</option>
                <option value="female-yujie">御姐</option>
                <option value="presenter_male">男播音</option>
                <option value="presenter_female">女播音</option>
              </select>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
