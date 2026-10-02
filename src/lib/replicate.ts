import Replicate from 'replicate';

let _replicate: Replicate | null = null;

export function getReplicate(): Replicate | null {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token || token.includes('YOUR-REPLICATE-TOKEN')) {
    return null;
  }
  if (!_replicate) {
    _replicate = new Replicate({
      auth: token,
    });
  }
  return _replicate;
}

export function isReplicateConfigured(): boolean {
  const token = process.env.REPLICATE_API_TOKEN;
  return Boolean(token && !token.includes('YOUR-REPLICATE-TOKEN'));
}

export interface GenerateVideoParams {
  photo1Url: string;
  photo2Url?: string;
  stage: string;
  topic?: string;
  duration?: string;
  aspectRatio?: string;
  modelTier?: 'standard' | 'fast' | 'pro' | 'flagship';
}

/**
 * 调度 ByteDance Seedance 系列（Replicate 官方托管模型）：
 * - bytedance/seedance-2.0-mini (官方 Mini 轻量版：超高性价比、快速生成，支持文字/图片/视频/音频多模态、原生音画同步)
 * - bytedance/seedance-2.0 (标准版，旗舰多模态对口型/音乐视频生成，支持 1080p、原生音乐与人声动作联动)
 */
export async function runSeedanceVideoGeneration(
  params: GenerateVideoParams
): Promise<{ videoUrl: string; id: string }> {
  const client = getReplicate();
  if (!client) {
    throw new Error('Replicate API token is not configured');
  }

  // 默认使用 bytedance/seedance-2.0-mini，高级/旗舰 tier 可无缝路由到 seedance-2.0
  const modelId =
    params.modelTier === 'pro' || params.modelTier === 'flagship'
      ? (process.env.REPLICATE_SEEDANCE_PRO_MODEL || 'bytedance/seedance-2.0')
      : (process.env.REPLICATE_SEEDANCE_MODEL || 'bytedance/seedance-2.0-mini');

  // 根据舞台背景设计专属场景与光影
  const stagePromptMap: Record<string, string> = {
    'hotel-lobby': 'in an iconic warm orange monochrome COLORS studio hotel lobby booth, bold minimalist set, rich warm lighting',
    'luxury-lobby': 'in a luxury penthouse elevator lobby with polished marble, warm golden backlights, neon elevator indicators',
    'studio-booth': 'in a professional music recording studio booth with soundproof foam panels, vintage microphones, neon magenta rim light',
    'street-cypher': 'in an urban neon alley street cypher, rainy asphalt reflections, vibrant blue and amber streetlights',
  };

  const stageDesc = stagePromptMap[params.stage] || stagePromptMap['hotel-lobby'];
  const userTopic = params.topic || 'viral hit rap';

  // Seedance 2.0 官方最佳实践：双引号内指定说唱台词，结合镜头语言与节奏动作
  const promptText = `Two energetic rap stars performing dynamically ${stageDesc}. Rhythmic head bobbing, hand gestures pointing to the camera, confident swagger and expressive lip-synced flow. They rap: "${userTopic}! Out here dropping heat in the booth, living the dream and setting the trend!" Cinematic 1080p, dynamic camera push-in and subtle whip pans, punchy 808 trap beat and rhythmic synth bass, professional music video grade.`;

  // 解析时长（秒）：默认 5 或 10 秒，最大 15 秒，-1 为智能自适应时长
  const durationSec = params.duration === '15s' ? 10 : 5;

  const input: Record<string, any> = {
    prompt: promptText,
    image: params.photo1Url,
    aspect_ratio: params.aspectRatio || '9:16',
    duration: durationSec,
    resolution: params.modelTier === 'pro' ? '720p' : '720p',
    generate_audio: true,
  };

  try {
    const output: any = await client.run(modelId as any, { input });
    
    // Replicate 的输出可能为输出视频 URL 字符串、URL 数组或包含 url() 的对象
    let videoUrl = '';
    if (typeof output === 'string') {
      videoUrl = output;
    } else if (Array.isArray(output) && output.length > 0) {
      videoUrl = typeof output[0] === 'string' ? output[0] : output[0]?.url?.() || String(output[0]);
    } else if (output && typeof output === 'object') {
      videoUrl = output.url ? (typeof output.url === 'function' ? output.url() : output.url) : '';
    }

    return {
      id: 'rep_' + Math.random().toString(36).substring(7),
      videoUrl,
    };
  } catch (error: any) {
    console.error('[runSeedanceVideoGeneration] Error:', error);
    throw error;
  }
}

/**
 * 兼容旧版 LivePortrait / 通用模型调用
 */
export async function runReplicateVideoGeneration(
  params: GenerateVideoParams
): Promise<{ videoUrl: string; id: string }> {
  const client = getReplicate();
  if (!client) {
    throw new Error('Replicate API token is not configured');
  }

  const modelIdentifier =
    process.env.REPLICATE_MODEL ||
    'fofr/live-portrait:9b3b0d463b712b323145d02fa74a4f89d5a7d770c0c6ca78028f80cb528247ea';

  const input: Record<string, any> = {
    source_image: params.photo1Url,
    driving_video:
      params.stage === 'luxury-lobby'
        ? 'https://phototorap.com/examples/neon-elevator.mp4'
        : params.stage === 'studio-booth'
        ? 'https://phototorap.com/examples/grandpas.mp4'
        : params.stage === 'street-cypher'
        ? 'https://phototorap.com/examples/orange-street.mp4'
        : 'https://phototorap.com/examples/friends.mp4',
  };

  if (params.photo2Url) {
    input.driving_multiplier = 1.0;
  }

  const prediction = await client.predictions.create({
    version: modelIdentifier.includes(':') ? modelIdentifier.split(':')[1] : undefined,
    model: !modelIdentifier.includes(':') ? (modelIdentifier as any) : undefined,
    input,
  });

  return {
    id: prediction.id,
    videoUrl: typeof prediction.output === 'string' ? prediction.output : '',
  };
}
