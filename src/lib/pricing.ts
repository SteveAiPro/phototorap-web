/**
 * 统一的积分计价模块 —— 前端（GeneratorCard）与后端（/api/generate）共用。
 *
 * 为什么必须共用：历史上"15 秒加价 1.3 倍"在前端和后端各算了一遍，
 * 结果两个数字对不上（前端展示的含加价、后端实扣的不含），用户看到的扣费
 * 和实际扣费不一致。**计价只能有一个真相来源**，就是这里。
 *
 * 计价规则（由站长拍定，2026-10-11）：
 *   基准档：480p + 5s = 10 积分
 *   每上升一个档位（分辨率或时长任一维度）累乘 30%
 *   积分 = round(10 × 1.3^(分辨率档位序号 + 时长档位序号))
 *
 * 因此形成的价格矩阵：
 *         5s   8s   10s  12s  15s
 *   480p   10   13   17   22   29
 *   720p   13   17   22   29   37
 */

/** 分辨率档位，顺序即档位高低（不可随意调序，直接影响价格） */
export const RESOLUTIONS = ['480p', '720p'] as const;
export type Resolution = (typeof RESOLUTIONS)[number];

/** 时长档位，顺序即档位高低（不可随意调序，直接影响价格） */
export const DURATIONS = ['5s', '8s', '10s', '12s', '15s'] as const;
export type Duration = (typeof DURATIONS)[number];

/** 基准积分：480p + 5s */
export const BASE_CREDITS = 10;

/** 每上升一档的倍率 */
export const STEP_MULTIPLIER = 1.3;

/** 每个时长档位对应的秒数 */
const DURATION_SECONDS: Record<string, number> = {
  '5s': 5,
  '8s': 8,
  '10s': 10,
  '12s': 12,
  '15s': 15,
};

/** 兜底档位（参数非法时回落到基准档，避免算出离谱价格） */
export const DEFAULT_RESOLUTION: Resolution = '480p';
export const DEFAULT_DURATION: Duration = '5s';

export function normalizeResolution(value?: string | null): Resolution {
  return (RESOLUTIONS as readonly string[]).includes(value ?? '')
    ? (value as Resolution)
    : DEFAULT_RESOLUTION;
}

export function normalizeDuration(value?: string | null): Duration {
  return (DURATIONS as readonly string[]).includes(value ?? '')
    ? (value as Duration)
    : DEFAULT_DURATION;
}

/** 把 '12s' 这类时长标签转成传给模型的秒数（数字） */
export function parseDurationSeconds(value?: string | null): number {
  const key = normalizeDuration(value);
  return DURATION_SECONDS[key] ?? DURATION_SECONDS[DEFAULT_DURATION];
}

/** 分辨率档位序号：480p=0, 720p=1 */
function resolutionStep(resolution?: string | null): number {
  const idx = (RESOLUTIONS as readonly string[]).indexOf(normalizeResolution(resolution));
  return Math.max(0, idx);
}

/** 时长档位序号：5s=0, 8s=1, 10s=2, 12s=3, 15s=4 */
function durationStep(duration?: string | null): number {
  const idx = (DURATIONS as readonly string[]).indexOf(normalizeDuration(duration));
  return Math.max(0, idx);
}

/**
 * 计算一次生成需要多少积分。
 * 分辨率与时长各贡献一个档位，累乘 1.3 后四舍五入取整。
 */
export function computeCredits(resolution?: string | null, duration?: string | null): number {
  const steps = resolutionStep(resolution) + durationStep(duration);
  return Math.round(BASE_CREDITS * Math.pow(STEP_MULTIPLIER, steps));
}
