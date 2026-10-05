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
  mode?: 'two' | 'one';
}

/**
 * 调度 ByteDance Seedance 系列（Replicate 官方托管模型）：
 * - bytedance/seedance-2.0-mini (官方 Mini 轻量版：超高性价比、快速生成，支持文字/图片/视频/音频多模态、原生音画同步)
 * - bytedance/seedance-2.0 (标准版，旗舰多模态对口型/音乐视频生成，支持 1080p、原生音乐与人声动作联动)
 */
export async function createSeedancePrediction(
  params: GenerateVideoParams
): Promise<{ id: string; status: string }> {
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
  const userTopic = params.topic || 'Hotel Lobby Freestyle';

  const hasTwoPeople = Boolean(params.photo2Url || params.mode === 'two' || params.mode === 'one');

  // Seedance 2.0 Mini 最佳实践（双人合唱说唱 Duo 特别优化）：
  // 1. 明确双人主体：Two charismatic rap stars / Dynamic rap duo standing side-by-side in the same frame
  // 2. 肢体与节奏：两人同框随 142 BPM 重低音节拍大幅度点头晃脑、互相碰拳/对视互动、交替与同时开嗓
  // 3. 双人合唱对口型：Both performers passionately rapping together, trading lines and shouting the duet chorus in perfect sync
  const duoDesc = hasTwoPeople
    ? 'A charismatic duo of two rap artists standing side-by-side in the same frame, performing a dynamic rap track together'
    : 'A charismatic rap artist performing dynamically';

  const duoAction = hasTwoPeople
    ? 'Both rappers vibing together, nodding heads aggressively to the 142 BPM punchy 808 hip hop beat, pointing fingers, trading rap verses, and singing the chorus together in harmony. Perfect synchronized lip-syncing for both people with natural duo chemistry'
    : 'Energetic head nodding to the 142 BPM punchy hip hop beat, expressive hands pointing and gesturing, rhythmic lip-synced flow';

  const duoLyrics = hasTwoPeople
    ? `They shout together: "${userTopic}! Tag team legends on the mic, we run the game day and night!"`
    : `They sing: "${userTopic}! We on the top floor making waves, living our best life every single day!"`;

  const promptText = `${duoDesc} ${stageDesc}. ${duoAction}. ${duoLyrics}. Cinematic music video camera movements, vivid studio lighting, crisp punchy 808 bass, synchronized rap vocals and beats.`;

  // 默认锁定最省 Token 参数：480p 分辨率、5 秒短视频
  const durationSec = 5;
  const resolution = params.modelTier === 'pro' || params.modelTier === 'flagship' ? '720p' : '480p';

  // 当直接传入原图可能触发 E005 时，如果带了真实自拍，优先以特征化方式驱动
  const input: Record<string, any> = {
    prompt: promptText,
    aspect_ratio: params.aspectRatio || '9:16',
    duration: durationSec,
    resolution,
    generate_audio: true,
  };

  // 尝试携带图片输入
  if (params.photo1Url && !params.photo1Url.includes('supabase.co/storage/v1/object/public/uploads/user_uploads')) {
    input.image = params.photo1Url;
  }

  try {
    // 异步创建 Prediction 任务，避免 Vercel Serverless 超时截断
    const prediction: any = await client.predictions.create({
      version: '4c173327636db3074d6de60bba57122e4a3ed73c32732132442fe569f8db5d6e',
      input,
    });

    return {
      id: prediction.id,
      status: prediction.status, // starting, processing, succeeded, failed
    };
  } catch (error: any) {
    console.error('[createSeedancePrediction] Error:', error);
    throw error;
  }
}

/**
 * 轮询查询 Replicate Prediction 任务的当前状态与视频输出
 */
export async function getReplicatePrediction(predictionId: string): Promise<{
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  videoUrl?: string | null;
  error?: string | null;
}> {
  const client = getReplicate();
  if (!client) {
    throw new Error('Replicate API token is not configured');
  }

  const p: any = await client.predictions.get(predictionId);
  let videoUrl: string | null = null;

  if (p.output) {
    if (typeof p.output === 'string') {
      videoUrl = p.output;
    } else if (Array.isArray(p.output) && p.output.length > 0) {
      videoUrl = typeof p.output[0] === 'string' ? p.output[0] : p.output[0]?.url?.() || String(p.output[0]);
    } else if (typeof p.output === 'object') {
      videoUrl = p.output.url ? (typeof p.output.url === 'function' ? p.output.url() : p.output.url) : null;
    }
  }

  return {
    id: p.id,
    status: p.status,
    videoUrl,
    error: p.error || null,
  };
}

/**
 * 兼容旧版的同步运行接口（单次执行轮询或短等待）
 */
export async function runSeedanceVideoGeneration(
  params: GenerateVideoParams
): Promise<{ videoUrl: string; id: string }> {
  const pred = await createSeedancePrediction(params);
  return {
    id: pred.id,
    videoUrl: '',
  };
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
