import { registerRoot, Composition } from 'remotion';
import { FableStoryboard } from './FableStoryboard';
import { createEmptyStoryboard } from '@fable/shared';

// 示例 Storyboard（用于开发预览）
const sampleStoryboard = createEmptyStoryboard();
sampleStoryboard.title = '巴霖效应寓言';
sampleStoryboard.targetDurationSeconds = 30;
sampleStoryboard.scenes = [
  {
    id: 's1',
    order: 0,
    narration: '你有没有发现，星座描述总是很准？',
    durationSeconds: 4,
    characters: [{ action: 'think', facingLeft: true, x: 50, y: 60, scale: 1.2 }],
    background: { type: 'plain', color: '#E3F2FD' },
  },
  {
    id: 's2',
    order: 1,
    narration: '其实，这叫巴霖效应——人们容易相信模糊的、普遍的性格描述。',
    durationSeconds: 5,
    characters: [{ action: 'point', facingLeft: true, x: 40, y: 60, scale: 1.0 }],
    background: { type: 'plain', color: '#FFF8E7' },
  },
  {
    id: 's3',
    order: 2,
    narration: '下次再看到星座分析，想想：这些话是不是对谁都适用？',
    durationSeconds: 5,
    characters: [{ action: 'shrug', facingLeft: false, x: 50, y: 60, scale: 1.0 }],
    background: { type: 'plain', color: '#E8F5E9' },
  },
];

const totalDuration = sampleStoryboard.scenes.reduce((s, sc) => s + sc.durationSeconds, 0);

const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="FableStoryboard"
        component={FableStoryboard}
        durationInFrames={Math.round(totalDuration * 30)}
        fps={30}
        compositionWidth={720}
        compositionHeight={1280}
        defaultProps={{ storyboard: sampleStoryboard }}
      />
    </>
  );
};

registerRoot(Root);
