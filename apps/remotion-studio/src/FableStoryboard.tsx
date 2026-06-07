import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  Audio,
  Img,
  interpolate,
  spring,
  Sequence,
} from 'remotion';
import type { Scene, Storyboard } from '@fable/shared';

// 场景渲染组件
const SceneRender: React.FC<{
  scene: Scene;
  sceneIndex: number;
  totalScenes: number;
}> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 角色入场动画
  const characterSpring = spring({
    frame,
    fps,
    config: { damping: 12 },
  });

  const characterOpacity = interpolate(characterSpring, [0, 1], [0, 1]);
  const characterY = interpolate(characterSpring, [0, 1], [30, 0]);

  const char = scene.characters[0];
  if (!char) return null;

  return (
    <AbsoluteFill>
      {/* 背景 */}
      <AbsoluteFill style={{ backgroundColor: scene.background.color || '#FFF8E7' }} />

      {/* 火柴人角色 - 简化渲染 */}
      <div
        style={{
          position: 'absolute',
          left: `${char.x}%`,
          top: `${char.y}%`,
          transform: `translate(-50%, -80%) scaleX(${char.facingLeft ? -1 : 1}) scale(${char.scale}) translateY(${characterY}px)`,
          opacity: characterOpacity,
        }}
      >
        <svg width="200" height="300" viewBox="0 0 200 300">
          {/* 头 */}
          <circle cx="100" cy="60" r="40" fill="#FFD93D" stroke="#2D2D2D" strokeWidth="3" />
          {/* 眼睛 */}
          <circle cx="88" cy="55" r="5" fill="#2D2D2D" />
          <circle cx="112" cy="55" r="5" fill="#2D2D2D" />
          {/* 腮红 */}
          <circle cx="75" cy="68" r="8" fill="#FF9999" opacity="0.5" />
          <circle cx="125" cy="68" r="8" fill="#FF9999" opacity="0.5" />
          {/* 嘴 */}
          <path d="M 88 72 Q 100 82 112 72" fill="none" stroke="#2D2D2D" strokeWidth="3" strokeLinecap="round" />
          {/* 身体 */}
          <line x1="100" y1="100" x2="100" y2="180" stroke="#3D3D3D" strokeWidth="6" strokeLinecap="round" />
          {/* 左臂 */}
          <line x1="100" y1="120" x2="65" y2="140" stroke="#3D3D3D" strokeWidth="5" strokeLinecap="round" />
          <circle cx="65" cy="140" r="8" fill="#FFD93D" stroke="#2D2D2D" strokeWidth="2" />
          {/* 右臂 */}
          <line x1="100" y1="120" x2="135" y2="140" stroke="#3D3D3D" strokeWidth="5" strokeLinecap="round" />
          <circle cx="135" cy="140" r="8" fill="#FFD93D" stroke="#2D2D2D" strokeWidth="2" />
          {/* 左腿 */}
          <line x1="100" y1="180" x2="80" y2="260" stroke="#3D3D3D" strokeWidth="5" strokeLinecap="round" />
          <ellipse cx="80" cy="262" rx="12" ry="6" fill="#3D3D3D" />
          {/* 右腿 */}
          <line x1="100" y1="180" x2="120" y2="260" stroke="#3D3D3D" strokeWidth="5" strokeLinecap="round" />
          <ellipse cx="120" cy="262" rx="12" ry="6" fill="#3D3D3D" />
        </svg>
      </div>

      {/* 字幕 */}
      {scene.narration && (
        <div
          style={{
            position: 'absolute',
            bottom: 120,
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: '85%',
            padding: '10px 20px',
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderRadius: 8,
            color: 'white',
            fontSize: 28,
            textAlign: 'center',
            lineHeight: 1.5,
            opacity: characterOpacity,
          }}
        >
          {scene.narration}
        </div>
      )}
    </AbsoluteFill>
  );
};

// 主视频合成组件
export const FableStoryboard: React.FC<{
  storyboard: Storyboard;
}> = ({ storyboard }) => {
  const { fps } = useVideoConfig();

  let currentFrame = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {storyboard.scenes.map((scene, index) => {
        const durationInFrames = Math.round(scene.durationSeconds * fps);
        const from = currentFrame;
        currentFrame += durationInFrames;

        return (
          <Sequence key={scene.id} from={from} durationInFrames={durationInFrames}>
            <SceneRender scene={scene} sceneIndex={index} totalScenes={storyboard.scenes.length} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
