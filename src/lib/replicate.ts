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

  // 严格锁定调用 Replicate 官方 ByteDance Seedance 2.0 Mini
  const modelId = 'bytedance/seedance-2.0-mini';

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

// 默认锁定最省 Token 参数：480p 分辨率、5 秒短视频
  const durationSec = 5;
  const resolution = params.modelTier === 'pro' || params.modelTier === 'flagship' ? '720p' : '480p';

  const input: Record<string, any> = {
    prompt: promptText,
    image: params.photo1Url,
    aspect_ratio: params.aspectRatio || '9:16',
    duration: durationSec,
    resolution,
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
 * 调度 LivePortrait：专为真人人脸照片提供 5 秒 480p/512px 极速高保真对口型与律动渲染
 */
export async function runLivePortraitVideoGeneration(
  params: GenerateVideoParams
): Promise<{ videoUrl: string; id: string }> {
  const client = getReplicate();
  if (!client) {
    throw new Error('Replicate API token is not configured');
  }

  const livePortraitVersion =
    process.env.REPLICATE_LIVEPORTRAIT_VERSION ||
    '067dd98cc3e5cb396c4a9efb4bba3eec6c4a9d271211325c477518fc6485e146';

  const stageVideoMap: Record<string, string> = {
    'luxury-lobby': 'https://phototorap.com/examples/neon-elevator.mp4',
    'studio-booth': 'https://phototorap.com/examples/grandpas.mp4',
    'street-cypher': 'https://phototorap.com/examples/orange-street.mp4',
    'hotel-lobby': 'https://phototorap.com/examples/friends.mp4',
  };

  const drivingVideo = stageVideoMap[params.stage] || stageVideoMap['hotel-lobby'];

  // 125 帧（25fps * 5s = 5秒），live_portrait_dsize 512 相当于标清 480p，极大节省算力和 Token
  const input: Record<string, any> = {
    face_image: params.photo1Url,
    driving_video: drivingVideo,
    video_frame_load_cap: 125,
    live_portrait_dsize: 512,
  };

  try {
    const prediction: any = await client.predictions.create({
      version: livePortraitVersion,
      input,
    });

    // 等待预测完成（轮询，最长等待 90 秒）
    const predictionId = prediction.id;
    let completedPrediction = prediction;
    const startTime = Date.now();

    while (
      completedPrediction.status !== 'succeeded' &&
      completedPrediction.status !== 'failed' &&
      completedPrediction.status !== 'canceled' &&
      Date.now() - startTime < 90000
    ) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      completedPrediction = await client.predictions.get(predictionId);
    }

    if (completedPrediction.status !== 'succeeded') {
      throw new Error(
        completedPrediction.error ||
          `LivePortrait prediction finished with status: ${completedPrediction.status}`
      );
    }

    let videoUrl = '';
    const out = completedPrediction.output;
    if (typeof out === 'string') {
      videoUrl = out;
    } else if (Array.isArray(out) && out.length > 0) {
      videoUrl = typeof out[0] === 'string' ? out[0] : out[0]?.url?.() || String(out[0]);
    } else if (out && typeof out === 'object') {
      videoUrl = out.url ? (typeof out.url === 'function' ? out.url() : out.url) : '';
    }

    return {
      id: predictionId,
      videoUrl,
    };
  } catch (error: any) {
    console.error('[runLivePortraitVideoGeneration] Error:', error);
    throw error;
  }
}
