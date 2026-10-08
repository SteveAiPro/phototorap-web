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

  // 收集有效参考图片（支持 1~2 张输入）。
  // 只接受真正的公网 http(s) 地址：blob: 只是当前浏览器会话的内存地址，
  // 传给 Replicate 必然取不到图，会被静默忽略甚至报错。
  const isPublicUrl = (u?: string): u is string => Boolean(u && /^https?:\/\//.test(u));

  const referenceImages: string[] = [];
  if (isPublicUrl(params.photo1Url)) {
    referenceImages.push(params.photo1Url);
  }
  if (isPublicUrl(params.photo2Url)) {
    referenceImages.push(params.photo2Url);
  }
  console.log(
    `[createSeedancePrediction] reference_images=${referenceImages.length} (photo1=${isPublicUrl(params.photo1Url) ? 'ok' : 'invalid'}, photo2=${isPublicUrl(params.photo2Url) ? 'ok' : 'none'})`
  );

  const hasTwoCharacters = referenceImages.length >= 2 || Boolean(params.photo2Url) || params.mode === 'two';
  const isSolo = !hasTwoCharacters;

  // 角色描述必须显式指向参考图实体，并用 [ImageN] 占位符与 reference_images 一一对应。
  // 这是官方 schema 规定的引用方式；一旦省略，模型会自行"编"两个陌生人出来，
  // 生成结果与用户上传的照片完全无关。
  let characterDesc = '';
  let duoAction = '';
  let duoLyrics = '';

  if (referenceImages.length >= 2) {
    characterDesc = 'The two people shown in [Image1] and [Image2] standing side-by-side in the same frame as a viral rap duo, keeping their real faces, hairstyles and outfits exactly as in the reference photos';
    duoAction = 'Both people from [Image1] and [Image2] vibing together, enthusiastically nodding heads to the 142 BPM punchy 808 hip hop beat, pointing and gesturing to the camera, delivering an electrifying rap duet with synchronized lip-syncing and hilarious chemistry';
    duoLyrics = `Both performers shout together into the mic: "${userTopic}! Tag team legends running the game, we own every single day!"`;
  } else if (referenceImages.length === 1) {
    characterDesc = isSolo
      ? 'The two people shown in [Image1] performing together as a viral rap duo, keeping their real faces, hairstyles and outfits exactly as in the reference photo'
      : 'The person shown in [Image1] performing as a charismatic rap star, keeping their real face, hairstyle and outfit exactly as in the reference photo';
    duoAction = isSolo
      ? 'Both people from [Image1] vibing together, enthusiastically nodding heads to the 142 BPM punchy 808 hip hop beat, pointing and gesturing to the camera, rapping with synchronized lip-syncing'
      : 'The person from [Image1] vibing and aggressively nodding head to the 142 BPM punchy 808 hip hop beat, pointing fingers and making iconic hip hop gestures, rapping with synchronized lip-syncing';
    duoLyrics = `Rapping with swagger: "${userTopic}! Living our best life on the top floor, unstoppable every day!"`;
  } else {
    // 兜底：没有任何可用的公网参考图（例如前端上传未完成）。此时只能纯文本驱动，
    // 成片与用户无关 —— 属于异常路径，正常流程不应走到这里。
    console.warn('[createSeedancePrediction] No usable reference image, falling back to text-only generation');
    characterDesc = 'Two charismatic rap performers standing side-by-side in the same frame as a viral rap duo';
    duoAction = 'Both performers vibing together, enthusiastically nodding heads to the 142 BPM punchy 808 hip hop beat, pointing and gesturing to the camera, delivering an electrifying rap duet with synchronized lip-syncing';
    duoLyrics = `Both performers shout together into the mic: "${userTopic}! Tag team legends running the game!"`;
  }

  const promptText = `${characterDesc} ${stageDesc}. ${duoAction}. ${duoLyrics}. Cinematic music video camera movements, vivid studio lighting, crisp punchy 808 bass, synchronized rap vocals and beats.`;

  // 默认锁定最省 Token 参数：480p 分辨率、5 秒短视频
  const durationSec = 5;
  const resolution = params.modelTier === 'pro' || params.modelTier === 'flagship' ? '720p' : '480p';

  const input: Record<string, any> = {
    prompt: promptText,
    aspect_ratio: params.aspectRatio || '9:16',
    duration: durationSec,
    resolution,
    generate_audio: true,
  };

  // 关键：必须把用户上传的照片作为 reference_images 送进模型。
  // 官方 schema 明确：reference_images 最多 9 张，用于 character consistency，
  // 可在 prompt 中以 [Image1]、[Image2] 引用。
  // ⚠️ reference_images 与 image / last_frame_image 互斥，不可同时传。
  if (referenceImages.length > 0) {
    input.reference_images = referenceImages;
  }

  try {
    // 异步创建 Prediction 任务，避免 Vercel Serverless 超时截断
    //
    // ⚠️ 走「官方模型名」而不是硬编码 64 位 version 哈希。
    // Replicate 官方文档：`version` 字段接受 `{owner}/{model}` 形式，**仅对 official model 有效**；
    // SDK 中直接传 `model` 则调用 POST /models/{model}/predictions，即「跑该模型的最新版本」。
    //
    // 原先硬编码的 version 哈希（4c173327…）版本年代不明，若它早于 reference_images
    // 参数上线，传进去的参考图会被静默忽略或直接 422 —— 表现正是「成片和上传的照片毫无关系」。
    //
    // 如需锁定版本复现历史行为，设置环境变量 SEEDANCE_MODEL_VERSION=<64位哈希>。
    const SEEDANCE_MODEL = 'bytedance/seedance-2.0-mini';
    const pinnedVersion = process.env.SEEDANCE_MODEL_VERSION;

    console.log(
      `[createSeedancePrediction] model=${pinnedVersion ? `pinned:${pinnedVersion.slice(0, 12)}` : SEEDANCE_MODEL} ` +
        `input_keys=[${Object.keys(input).join(', ')}] reference_images=${(input.reference_images || []).length}`
    );

    const prediction: any = await client.predictions.create({
      ...(pinnedVersion ? { version: pinnedVersion } : { model: SEEDANCE_MODEL }),
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
