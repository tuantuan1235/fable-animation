// Scene 中的角色动作类型
export type ActionType =
  | 'stand'        // 站立
  | 'walk'         // 走路
  | 'run'          // 跑步
  | 'sit'          // 坐下
  | 'point'        // 指向
  | 'think'        // 思考（手托下巴）
  | 'wave'         // 挥手
  | 'shrug'        // 耸肩
  | 'nod'          // 点头
  | 'shake_head'   // 摇头
  | 'laugh'        // 大笑
  | 'cry'          // 哭泣
  | 'surprised'    // 惊讶
  | 'angry'        // 生气
  | 'custom';      // 自定义

// 角色姿态
export interface Pose {
  action: ActionType;
  facingLeft: boolean;
  x: number;       // 0-100 百分比位置
  y: number;       // 0-100 百分比位置
  scale: number;   // 缩放比例，默认 1.0
}

// Scene 背景类型
export type BackgroundType =
  | 'plain'        // 纯色
  | 'gradient'     // 渐变
  | 'indoor'       // 室内场景
  | 'outdoor'      // 室外场景
  | 'custom';      // 自定义

// 场景背景配置
export interface Background {
  type: BackgroundType;
  color?: string;
  gradientFrom?: string;
  gradientTo?: string;
  description?: string;  // 场景描述，用于生成
}

// 字幕样式
export interface SubtitleStyle {
  fontSize: number;
  color: string;
  bgColor: string;
  position: 'top' | 'bottom' | 'middle';
}

// 单个 Scene 定义
export interface Scene {
  id: string;
  order: number;
  narration: string;      // 旁白文本
  durationSeconds: number; // 建议时长（秒）
  characters: Pose[];     // 角色配置（支持多角色）
  background: Background;
  subtitleStyle?: SubtitleStyle;
  notes?: string;         // 备注
}

// 剧本（Storyboard）
export interface Storyboard {
  id: string;
  title: string;
  description: string;
  targetDurationSeconds: number; // 目标总时长
  scenes: Scene[];
  ttsVoice: string;              // TTS 声线名称
  aspectRatio: '9:16' | '16:9';  // 画幅比例
  createdAt: string;
  updatedAt: string;
}

// TTS 声线配置
export interface TTSVoice {
  id: string;
  name: string;
  gender: 'male' | 'female';
  style: string;  // 成熟/青年/活泼 等
  previewUrl?: string;
}

// 校验结果
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  sceneId: string;
  field: string;
  message: string;
}

export interface ValidationWarning {
  sceneId: string;
  field: string;
  message: string;
}

// 渲染任务状态
export type RenderStatus =
  | 'pending'
  | 'generating_tts'
  | 'rendering'
  | 'compositing'
  | 'done'
  | 'failed';

export interface RenderTask {
  id: string;
  storyboardId: string;
  status: RenderStatus;
  progress: number; // 0-100
  outputUrl?: string;
  error?: string;
  createdAt: string;
  completedAt?: string;
}
