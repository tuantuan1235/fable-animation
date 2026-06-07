import fs from 'fs';
import path from 'path';
import https from 'https';

// MiniMax TTS 配置
interface MiniMaxConfig {
  apiKey: string;
  groupId: string;
  baseUrl?: string;
}

// TTS 请求参数
interface TTSRequest {
  text: string;
  voiceId?: string;
  speed?: number;     // 0.5 - 2.0
  vol?: number;       // 0.5 - 2.0
  pitch?: number;     // -12 ~ 12
}

let _config: MiniMaxConfig | null = null;

export function initTTS(config: MiniMaxConfig): void {
  _config = {
    baseUrl: 'https://api.minimax.chat/v1/t2a_v2',
    ...config,
  };
}

// 获取可用的声线列表
export function getAvailableVoices(): Array<{ id: string; name: string; gender: string }> {
  return [
    { id: 'male-qn-qingse', name: '青涩青年', gender: 'male' },
    { id: 'male-qn-jingying', name: '精英青年', gender: 'male' },
    { id: 'male-qn-badao', name: '霸道青年', gender: 'male' },
    { id: 'male-qn-daxuesheng', name: '大学生', gender: 'male' },
    { id: 'female-shaonv', name: '少女', gender: 'female' },
    { id: 'female-yujie', name: '御姐', gender: 'female' },
    { id: 'female-chengshu', name: '成熟女性', gender: 'female' },
    { id: 'female-tianmei', name: '甜美女性', gender: 'female' },
    { id: 'presenter_male', name: '男播音', gender: 'male' },
    { id: 'presenter_female', name: '女播音', gender: 'female' },
  ];
}

// 估算旁白音频时长（秒），中文语速约 4 字/秒
export function estimateAudioDuration(text: string, speed: number = 1.0): number {
  const charCount = text.replace(/\s/g, '').length;
  return charCount / (4 * speed);
}

// 调用 MiniMax TTS API 生成语音
export async function synthesize(
  request: TTSRequest,
  outputPath: string
): Promise<{ duration: number; filePath: string }> {
  if (!_config) {
    throw new Error('TTS 未初始化，请先调用 initTTS()');
  }

  const { text, voiceId = 'male-qn-qingse', speed = 1.0, vol = 1.0, pitch = 0 } = request;

  const requestBody = JSON.stringify({
    model: 'speech-01',
    text,
    voice_id: voiceId,
    speed,
    vol,
    pitch,
    audio_config: {
      format: 'mp3',
    },
  });

  return new Promise((resolve, reject) => {
    const url = `${_config!.baseUrl}?GroupId=${_config!.groupId}`;

    const req = https.request(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${_config!.apiKey}`,
        },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          const buffer = Buffer.concat(chunks);

          if (res.statusCode !== 200) {
            reject(new Error(`MiniMax TTS API 错误: ${res.statusCode} ${buffer.toString()}`));
            return;
          }

          // 确保输出目录存在
          const dir = path.dirname(outputPath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }

          fs.writeFileSync(outputPath, buffer);

          const duration = estimateAudioDuration(text, speed);
          resolve({ duration, filePath: outputPath });
        });
      }
    );

    req.on('error', reject);
    req.write(requestBody);
    req.end();
  });
}

// 批量合成一个 storyboard 所有 scene 的旁白
export async function synthesizeStoryboard(
  scenes: Array<{ id: string; narration: string }>,
  voiceId: string,
  outputDir: string
): Promise<Array<{ sceneId: string; filePath: string; duration: number }>> {
  const results: Array<{ sceneId: string; filePath: string; duration: number }> = [];

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const scene of scenes) {
    if (!scene.narration.trim()) continue;

    const filePath = path.join(outputDir, `${scene.id}.mp3`);
    const result = await synthesize(
      { text: scene.narration, voiceId },
      filePath
    );
    results.push({
      sceneId: scene.id,
      filePath: result.filePath,
      duration: result.duration,
    });
  }

  return results;
}
