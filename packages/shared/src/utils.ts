import type { Scene, Storyboard, ValidationResult, ValidationError, ValidationWarning } from './types';

// 生成唯一 ID
export function generateId(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

// 计算场景总时长
export function totalSceneDuration(scenes: Scene[]): number {
  return scenes.reduce((sum, s) => sum + s.durationSeconds, 0);
}

// 计算旁白估算时长（中文语速约 4 字/秒）
export function estimateNarrationDuration(text: string): number {
  const charCount = text.replace(/\s/g, '').length;
  return charCount / 4;
}

// 校验 Storyboard
export function validateStoryboard(storyboard: Storyboard): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  const totalDuration = totalSceneDuration(storyboard.scenes);

  // 检查总时长是否超出目标
  if (totalDuration > storyboard.targetDurationSeconds) {
    errors.push({
      sceneId: '_global',
      field: 'totalDuration',
      message: `总时长 ${totalDuration.toFixed(1)}s 超出目标 ${storyboard.targetDurationSeconds}s（+${(totalDuration - storyboard.targetDurationSeconds).toFixed(1)}s）`,
    });
  }

  // 检查每个 scene
  storyboard.scenes.forEach((scene) => {
    // 旁白时长 vs scene 时长
    const estimatedDuration = estimateNarrationDuration(scene.narration);
    if (estimatedDuration > scene.durationSeconds) {
      errors.push({
        sceneId: scene.id,
        field: 'durationSeconds',
        message: `旁白约需 ${estimatedDuration.toFixed(1)}s，但 scene 时长仅 ${scene.durationSeconds}s`,
      });
    }

    // 旁白为空
    if (!scene.narration.trim()) {
      warnings.push({
        sceneId: scene.id,
        field: 'narration',
        message: '旁白为空',
      });
    }

    // 时长过短
    if (scene.durationSeconds < 1.5) {
      warnings.push({
        sceneId: scene.id,
        field: 'durationSeconds',
        message: `时长 ${scene.durationSeconds}s 过短，建议 ≥ 1.5s`,
      });
    }

    // 时长过长
    if (scene.durationSeconds > 10) {
      warnings.push({
        sceneId: scene.id,
        field: 'durationSeconds',
        message: `时长 ${scene.durationSeconds}s 过长，建议 ≤ 10s`,
      });
    }
  });

  // 检查是否有 scene
  if (storyboard.scenes.length === 0) {
    errors.push({
      sceneId: '_global',
      field: 'scenes',
      message: '至少需要一个 scene',
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// 创建空白 Scene
export function createEmptyScene(order: number): Scene {
  return {
    id: generateId(),
    order,
    narration: '',
    durationSeconds: 3,
    characters: [
      {
        action: 'stand',
        facingLeft: true,
        x: 50,
        y: 70,
        scale: 1.0,
      },
    ],
    background: {
      type: 'plain',
      color: '#FFF8E7',
    },
  };
}

// 创建空白 Storyboard
export function createEmptyStoryboard(): Storyboard {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    title: '未命名剧本',
    description: '',
    targetDurationSeconds: 30,
    scenes: [createEmptyScene(0)],
    ttsVoice: 'default',
    aspectRatio: '9:16',
    createdAt: now,
    updatedAt: now,
  };
}
