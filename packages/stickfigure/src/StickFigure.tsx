import React from 'react';
import type { ActionType, Pose } from '@fable/shared';

// 萌系火柴人配色
const COLORS = {
  body: '#3D3D3D',
  head: '#FFD93D',
  cheek: '#FF9999',
  outline: '#2D2D2D',
};

interface StickFigureProps {
  pose: Pose;
  width?: number;
  height?: number;
}

// 各动作对应的肢体角度参数
function getActionAngles(action: ActionType) {
  switch (action) {
    case 'stand':
      return { leftArm: 0, rightArm: 0, leftLeg: 0, rightLeg: 0, bodyLean: 0 };
    case 'walk':
      return { leftArm: 30, rightArm: -30, leftLeg: 25, rightLeg: -25, bodyLean: 0 };
    case 'run':
      return { leftArm: 50, rightArm: -50, leftLeg: 40, rightLeg: -40, bodyLean: 10 };
    case 'sit':
      return { leftArm: 0, rightArm: 0, leftLeg: 90, rightLeg: -90, bodyLean: 0 };
    case 'point':
      return { leftArm: 0, rightArm: 80, leftLeg: 0, rightLeg: 0, bodyLean: 5 };
    case 'think':
      return { leftArm: 0, rightArm: 60, leftLeg: 0, rightLeg: 0, bodyLean: 5 };
    case 'wave':
      return { leftArm: 0, rightArm: 120, leftLeg: 0, rightLeg: 0, bodyLean: 0 };
    case 'shrug':
      return { leftArm: 45, rightArm: -45, leftLeg: 0, rightLeg: 0, bodyLean: 0 };
    case 'nod':
      return { leftArm: 0, rightArm: 0, leftLeg: 0, rightLeg: 0, bodyLean: 0 };
    case 'shake_head':
      return { leftArm: 0, rightArm: 0, leftLeg: 0, rightLeg: 0, bodyLean: 0 };
    case 'laugh':
      return { leftArm: 30, rightArm: -30, leftLeg: 0, rightLeg: 0, bodyLean: -5 };
    case 'cry':
      return { leftArm: 45, rightArm: 45, leftLeg: 0, rightLeg: 0, bodyLean: 5 };
    case 'surprised':
      return { leftArm: 60, rightArm: -60, leftLeg: 10, rightLeg: -10, bodyLean: 0 };
    case 'angry':
      return { leftArm: 30, rightArm: 30, leftLeg: 0, rightLeg: 0, bodyLean: 5 };
    default:
      return { leftArm: 0, rightArm: 0, leftLeg: 0, rightLeg: 0, bodyLean: 0 };
  }
}

export const StickFigure: React.FC<StickFigureProps> = ({
  pose,
  width = 200,
  height = 300,
}) => {
  const { action, facingLeft, x, y, scale } = pose;
  const angles = getActionAngles(action);

  const flipX = facingLeft ? -1 : 1;

  return (
    <svg
      width={width * scale}
      height={height * scale}
      viewBox="0 0 200 300"
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -80%) scaleX(${flipX})`,
      }}
    >
      {/* 头部 - 圆形大头 */}
      <circle cx="100" cy="60" r="40" fill={COLORS.head} stroke={COLORS.outline} strokeWidth="3" />

      {/* 眼睛 */}
      <circle cx="88" cy="55" r="5" fill={COLORS.outline} />
      <circle cx="112" cy="55" r="5" fill={COLORS.outline} />

      {/* 腮红 */}
      <circle cx="75" cy="68" r="8" fill={COLORS.cheek} opacity="0.5" />
      <circle cx="125" cy="68" r="8" fill={COLORS.cheek} opacity="0.5" />

      {/* 嘴巴 */}
      {action === 'laugh' ? (
        <path d="M 85 72 Q 100 88 115 72" fill="none" stroke={COLORS.outline} strokeWidth="3" strokeLinecap="round" />
      ) : action === 'surprised' ? (
        <ellipse cx="100" cy="76" rx="8" ry="10" fill={COLORS.outline} />
      ) : action === 'cry' ? (
        <path d="M 90 76 Q 100 70 110 76" fill="none" stroke={COLORS.outline} strokeWidth="3" strokeLinecap="round" />
      ) : (
        <path d="M 88 72 Q 100 82 112 72" fill="none" stroke={COLORS.outline} strokeWidth="3" strokeLinecap="round" />
      )}

      {/* 思考泡泡 */}
      {action === 'think' && (
        <g>
          <circle cx="140" cy="30" r="4" fill={COLORS.outline} />
          <circle cx="150" cy="18" r="6" fill={COLORS.outline} />
          <ellipse cx="162" cy="5" rx="15" ry="12" fill="white" stroke={COLORS.outline} strokeWidth="2" />
          <text x="162" y="9" textAnchor="middle" fontSize="10" fill={COLORS.outline}>?</text>
        </g>
      )}

      {/* 身体 */}
      <line
        x1="100" y1="100" x2={100 + angles.bodyLean} y2="180"
        stroke={COLORS.body} strokeWidth="6" strokeLinecap="round"
      />

      {/* 左臂 */}
      <line
        x1="100" y1="120"
        x2={60 + Math.abs(angles.leftArm) * 0.3}
        y2={120 + angles.leftArm * 0.5}
        stroke={COLORS.body} strokeWidth="5" strokeLinecap="round"
      />
      {/* 左手（圆手） */}
      <circle
        cx={60 + Math.abs(angles.leftArm) * 0.3}
        cy={120 + angles.leftArm * 0.5}
        r="8" fill={COLORS.head} stroke={COLORS.outline} strokeWidth="2"
      />

      {/* 右臂 */}
      <line
        x1="100" y1="120"
        x2={140 - Math.abs(angles.rightArm) * 0.3}
        y2={120 + (angles.rightArm > 60 ? -Math.abs(angles.rightArm) * 0.5 : Math.abs(angles.rightArm) * 0.5)}
        stroke={COLORS.body} strokeWidth="5" strokeLinecap="round"
      />
      {/* 右手（圆手） */}
      <circle
        cx={140 - Math.abs(angles.rightArm) * 0.3}
        cy={120 + (angles.rightArm > 60 ? -Math.abs(angles.rightArm) * 0.5 : Math.abs(angles.rightArm) * 0.5)}
        r="8" fill={COLORS.head} stroke={COLORS.outline} strokeWidth="2"
      />

      {/* 左腿 */}
      <line
        x1={100 + angles.bodyLean * 0.5} y1="180"
        x2={80 + angles.leftLeg * 0.3} y2="260"
        stroke={COLORS.body} strokeWidth="5" strokeLinecap="round"
      />
      {/* 左脚 */}
      <ellipse
        cx={80 + angles.leftLeg * 0.3} cy="262"
        rx="12" ry="6" fill={COLORS.body}
      />

      {/* 右腿 */}
      <line
        x1={100 + angles.bodyLean * 0.5} y1="180"
        x2={120 + angles.rightLeg * 0.3} y2="260"
        stroke={COLORS.body} strokeWidth="5" strokeLinecap="round"
      />
      {/* 右脚 */}
      <ellipse
        cx={120 + angles.rightLeg * 0.3} cy="262"
        rx="12" ry="6" fill={COLORS.body}
      />
    </svg>
  );
};

// 场景背景组件
interface SceneBackgroundProps {
  type: string;
  color?: string;
  gradientFrom?: string;
  gradientTo?: string;
  width?: number;
  height?: number;
}

export const SceneBackground: React.FC<SceneBackgroundProps> = ({
  type,
  color = '#FFF8E7',
  gradientFrom = '#E8F5E9',
  gradientTo = '#FFF8E7',
  width = 720,
  height = 1280,
}) => {
  if (type === 'gradient') {
    return (
      <svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0 }}>
        <defs>
          <linearGradient id="bg-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={gradientFrom} />
            <stop offset="100%" stopColor={gradientTo} />
          </linearGradient>
        </defs>
        <rect width={width} height={height} fill="url(#bg-gradient)" />
      </svg>
    );
  }

  return (
    <svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0 }}>
      <rect width={width} height={height} fill={color} />
    </svg>
  );
};

export default StickFigure;
