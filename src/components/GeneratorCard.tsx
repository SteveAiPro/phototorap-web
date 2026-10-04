'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { ImagePlus, Check, ChevronDown, Coins, Mic, Sparkles, X, Disc, Loader2, Music, Radio } from 'lucide-react';
import { trackGenerateClick, trackPreviewReady } from '@/lib/analytics';

interface Stage {
  id: string;
  nameKey: 'stageHotelLobby' | 'stageLuxury' | 'stageStudio' | 'stageStreet';
  subKey?: 'stageHotelLobbySub';
  colorGrad: string;
}

const STAGES: Stage[] = [
  {
    id: 'hotel-lobby',
    nameKey: 'stageHotelLobby',
    subKey: 'stageHotelLobbySub',
    colorGrad: 'from-orange-400 to-orange-600',
  },
  {
    id: 'luxury-lobby',
    nameKey: 'stageLuxury',
    colorGrad: 'from-amber-200 via-yellow-500 to-stone-700',
  },
  {
    id: 'studio-booth',
    nameKey: 'stageStudio',
    colorGrad: 'from-fuchsia-500 via-violet-700 to-slate-900',
  },
  {
    id: 'street-cypher',
    nameKey: 'stageStreet',
    colorGrad: 'from-sky-500 via-slate-700 to-slate-950',
  },
];

interface ModelOption {
  id: string;
  titleKey: 'modelStandard' | 'modelFast' | 'modelPro' | 'modelFlagship';
  engine: string;
  credits: number;
}

const MODELS: ModelOption[] = [
  { id: 'standard', titleKey: 'modelStandard', engine: 'Seedance 2.0 Mini', credits: 10 },
  { id: 'fast', titleKey: 'modelFast', engine: 'Seedance 2.0 Fast', credits: 17 },
  { id: 'pro', titleKey: 'modelPro', engine: 'Seedance 2.0', credits: 20 },
  { id: 'flagship', titleKey: 'modelFlagship', engine: 'Seedance 2.5', credits: 37 },
];

export default function GeneratorCard() {
  const { user, deductCredits, setUserCredits, openAuthModal } = useAuth();
  const { t } = useLanguage();

  // Tab switch: 两张单人照 vs 一张合照
  const [photoMode, setPhotoMode] = useState<'two' | 'one'>('two');
  const [photo1, setPhoto1] = useState<string | null>(null);
  const [photo2, setPhoto2] = useState<string | null>(null);
  const [isUploading1, setIsUploading1] = useState(false);
  const [isUploading2, setIsUploading2] = useState(false);

  // 上传图片至 Supabase Storage 获取公网 URL 供 AI 渲染与后台查看
  const uploadImageFile = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        return data.url;
      }
    } catch (e) {
      console.error('Failed to upload image', e);
    }
    return null;
  };

  // Stage selection
  const [selectedStage, setSelectedStage] = useState('hotel-lobby');

  // Step 3 精细状态 (完全对照截图)
  const [qualityExpanded, setQualityExpanded] = useState(true); // 默认打开可折叠抽屉
  const [selectedModel, setSelectedModel] = useState('standard');
  const [resolution, setResolution] = useState('720p');
  const [duration, setDuration] = useState('12s');
  const [aspectRatio, setAspectRatio] = useState('9:16');

  // Occasions & Topic input
  const [selectedOccasion, setSelectedOccasion] = useState('birthday');
  const [topicInput, setTopicInput] = useState('');

  // Generation state & Progress Modal
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateElapsed, setGenerateElapsed] = useState(0);
  const [generateStepIndex, setGenerateStepIndex] = useState(0);
  const [generatedResult, setGeneratedResult] = useState<{
    videoUrl: string;
    lyrics: string;
  } | null>(null);

  // 渲染中步骤提示轮播与计时器
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      setGenerateElapsed(0);
      setGenerateStepIndex(0);
      interval = setInterval(() => {
        setGenerateElapsed((prev) => {
          const next = prev + 1;
          if (next % 6 === 0) {
            setGenerateStepIndex((s) => (s + 1) % 5);
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const currentModelObj = MODELS.find((m) => m.id === selectedModel) || MODELS[0];
  
  // Calculate credits: if duration is '15s', add 30% surcharge (rounded), otherwise base model credits
  const calculateCredits = (baseCredits: number, dur: string) => {
    if (dur === '15s') {
      return Math.round(baseCredits * 1.3);
    }
    return baseCredits;
  };

  const requiredCredits = calculateCredits(currentModelObj.credits, duration);

  const occasions = [
    { key: 'birthday', label: t.generator.occasionBirthday },
    { key: 'anniversary', label: t.generator.occasionAnniversary },
    { key: 'friends', label: t.generator.occasionBestFriends },
    { key: 'business', label: t.generator.occasionBusiness },
  ];

  const handleGenerate = async () => {
    if (isUploading1 || isUploading2) {
      alert('Photos are still uploading, please wait a moment...');
      return;
    }

    if (!photo1) {
      alert(photoMode === 'one' ? 'Please upload a photo with 2 people' : 'Please upload Photo 1 (You)');
      return;
    }
    if (photoMode === 'two' && !photo2) {
      alert('Please upload Photo 2 (Your partner/duo)');
      return;
    }

    if (!user) {
      openAuthModal();
      return;
    }

    trackGenerateClick({
      mode: photoMode === 'two' ? 'duo' : 'solo',
      stage: selectedStage,
      hasCustomLyrics: Boolean(topicInput),
    });

    const success = deductCredits(requiredCredits);
    if (!success) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photo1,
          photo2,
          stage: selectedStage,
          model: selectedModel,
          quality: resolution,
          duration,
          aspectRatio,
          topic: topicInput || selectedOccasion,
          mode: photoMode,
          userId: user.id,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (typeof data.remainingCredits === 'number') {
          setUserCredits(data.remainingCredits);
        }
        trackPreviewReady({
          mode: photoMode === 'two' ? 'duo' : 'solo',
        });
        setTimeout(() => {
          setIsGenerating(false);
          setGeneratedResult({
            videoUrl: data.videoUrl,
            lyrics: data.lyrics,
          });
        }, 1200);
      } else {
        if (user) {
          setUserCredits(user.credits + requiredCredits);
        }
        alert(data.error || 'Generation failed');
        setIsGenerating(false);
      }
    } catch (e) {
      if (user) {
        setUserCredits(user.credits + requiredCredits);
      }
      setIsGenerating(false);
      alert('Network error');
    }
  };

  return (
    <div
      id="generator"
      className="relative w-full rounded-2xl border border-[#222533] bg-[#12141C] p-5 sm:p-7 shadow-2xl text-left"
    >
      {/* 步骤 1: 添加照片 */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF6A00] text-xs font-black text-black">
              1
            </span>
            <span className="text-sm font-bold text-white">
              {photoMode === 'two' ? t.generator.step1TitleTwo : t.generator.step1TitleOne}
            </span>
          </div>

          {/* 右上角单选切换: 两张单人照 | 一张合照 */}
          <div className="inline-flex rounded-full bg-[#090A0F] p-0.5 border border-[#222533]">
            <button
              type="button"
              onClick={() => setPhotoMode('two')}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                photoMode === 'two'
                  ? 'bg-[#181B26] text-white shadow-sm font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t.generator.tabTwoSolo}
            </button>
            <button
              type="button"
              onClick={() => setPhotoMode('one')}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                photoMode === 'one'
                  ? 'bg-[#181B26] text-white shadow-sm font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t.generator.tabOnePhoto}
            </button>
          </div>
        </div>

        {/* 上传卡片区域 */}
        <div className={`grid gap-3 sm:gap-4 ${photoMode === 'two' ? 'grid-cols-2' : 'grid-cols-1 max-w-sm mx-auto'}`}>
          {/* 照片 1 · 你 */}
          <div className="relative group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#2F3446] bg-[#0A0C13] p-4 aspect-[4/5] sm:aspect-square hover:border-[#FF6A00] transition-all cursor-pointer overflow-hidden">
            <input
              type="file"
              accept="image/*"
              disabled={isUploading1}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // 先设置本地预览给用户极速视觉反馈
                  setPhoto1(URL.createObjectURL(file));
                  setIsUploading1(true);
                  const remoteUrl = await uploadImageFile(file);
                  if (remoteUrl) {
                    setPhoto1(remoteUrl);
                  }
                  setIsUploading1(false);
                }
              }}
            />
            {isUploading1 ? (
              <div className="flex flex-col items-center justify-center">
                <span className="h-8 w-8 rounded-full border-2 border-[#FF6A00] border-t-transparent animate-spin mb-2"></span>
                <span className="text-xs font-semibold text-[#FF6A00]">Uploading photo...</span>
              </div>
            ) : photo1 ? (
              <img src={photo1} alt={photoMode === 'one' ? 'Duo Photo' : 'Photo 1'} className="h-full w-full rounded-xl object-cover object-top" />
            ) : (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF6A00] text-black shadow-md transition-transform group-hover:scale-110">
                  <ImagePlus className="h-6 w-6 stroke-[2.2]" />
                </div>
                <span className="mt-3 text-sm font-bold text-white">
                  {photoMode === 'one' ? t.generator.duoPhotoLabel : t.generator.photo1Label}
                </span>
                <span className="mt-1 text-xs text-gray-400 text-center px-2">
                  {photoMode === 'one' ? t.generator.duoPhotoHint : t.generator.photo1Hint}
                </span>
              </>
            )}
          </div>

          {/* 照片 2 · 你的搭档 */}
          {photoMode === 'two' && (
            <div className="relative group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#2F3446] bg-[#0A0C13] p-4 aspect-[4/5] sm:aspect-square hover:border-[#FF6A00] transition-all cursor-pointer overflow-hidden">
              <input
                type="file"
                accept="image/*"
                disabled={isUploading2}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPhoto2(URL.createObjectURL(file));
                    setIsUploading2(true);
                    const remoteUrl = await uploadImageFile(file);
                    if (remoteUrl) {
                      setPhoto2(remoteUrl);
                    }
                    setIsUploading2(false);
                  }
                }}
              />
              {isUploading2 ? (
                <div className="flex flex-col items-center justify-center">
                  <span className="h-8 w-8 rounded-full border-2 border-[#FF6A00] border-t-transparent animate-spin mb-2"></span>
                  <span className="text-xs font-semibold text-[#FF6A00]">Uploading photo...</span>
                </div>
              ) : photo2 ? (
                <img src={photo2} alt="Photo 2" className="h-full w-full rounded-xl object-cover object-top" />
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF6A00] text-black shadow-md transition-transform group-hover:scale-110">
                    <ImagePlus className="h-6 w-6 stroke-[2.2]" />
                  </div>
                  <span className="mt-3 text-sm font-bold text-white">{t.generator.photo2Label}</span>
                  <span className="mt-1 text-xs text-gray-400">{t.generator.photo2Hint}</span>
                </>
              )}
            </div>
          )}
        </div>

        <p className="mt-2 text-xs text-gray-400">
          {t.generator.step1Footer}
        </p>
      </div>

      {/* 步骤 2: 选择舞台 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF6A00] text-xs font-black text-black">
            2
          </span>
          <span className="text-sm font-bold text-white">{t.generator.step2Title}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
          {STAGES.map((stage) => {
            const isSelected = selectedStage === stage.id;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setSelectedStage(stage.id)}
                className={`relative flex items-center gap-2 rounded-xl border p-2 text-left text-xs sm:text-sm transition-all ${
                  isSelected
                    ? 'border-[#FF6A00] bg-[#FF6A00]/10 ring-2 ring-[#FF6A00]/40 font-semibold'
                    : 'border-[#222533] bg-[#0A0C13] hover:border-gray-500'
                }`}
              >
                {/* 舞台圆形图标 */}
                <span className={`h-8 w-8 shrink-0 rounded-full bg-gradient-to-br ${stage.colorGrad} shadow-inner`}></span>
                <span className="leading-tight text-white flex-1">
                  {t.generator[stage.nameKey]} {stage.subKey && <span className="block text-xs text-gray-300">{t.generator[stage.subKey]}</span>}
                </span>

                {isSelected && (
                  <Check className="h-4 w-4 text-[#FF6A00] absolute top-1.5 right-1.5 stroke-[3]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 步骤 3: 选择画质与时长 (100% 像素级对齐用户第二张截图) */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF6A00] text-xs font-black text-black">
            3
          </span>
          <span className="text-sm font-bold text-white">{t.generator.step3Title}</span>
        </div>

        <div className="rounded-2xl border border-[#222533] bg-[#0A0C13] p-4">
          {/* 折叠标题栏 */}
          <button
            type="button"
            onClick={() => setQualityExpanded(!qualityExpanded)}
            className="flex w-full items-center justify-between text-left"
          >
            <div>
              <span className="block text-sm font-medium text-white">
                {t.generator[currentModelObj.titleKey]} · {resolution} · {duration} · {aspectRatio}
              </span>
              <span className="text-xs text-[#FF6A00] font-medium hover:underline">
                {t.generator.qualityChangePrompt}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF6A00]/15 px-3 py-1 text-xs font-bold text-[#FF6A00]">
                <Coins className="h-3.5 w-3.5" />
                <span>{requiredCredits} {t.generator.creditsTag}</span>
              </span>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${qualityExpanded ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {/* 展开的精细调节区域 (完全对齐截图) */}
          {qualityExpanded && (
            <div className="mt-5 pt-4 border-t border-[#1C1F2B] space-y-5">
              {/* 1. 模型 (2x2 网格) */}
              <div>
                <span className="text-xs text-gray-400 block mb-2 font-medium">
                  {t.generator.modelSection}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {MODELS.map((m) => {
                    const isSelected = selectedModel === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedModel(m.id)}
                        className={`rounded-xl border p-3 text-left transition-all ${
                          isSelected
                            ? 'border-[#FF6A00] bg-[#FF6A00]/10 ring-1 ring-[#FF6A00]/50'
                            : 'border-[#222533] bg-[#12141C] hover:border-gray-500'
                        }`}
                      >
                        <div className="text-sm font-bold text-white">
                          {t.generator[m.titleKey]}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {m.engine}
                        </div>
                        <div className="text-xs font-bold text-[#FF6A00] mt-1.5 flex items-center gap-1.5">
                          <span>{calculateCredits(m.credits, duration)} {t.generator.creditsTag}</span>
                          {duration === '15s' && (
                            <span className="text-[10px] font-semibold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                              +30% (15s)
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. 分辨率 (480p, 720p) */}
              <div>
                <span className="text-xs text-gray-400 block mb-2 font-medium">
                  {t.generator.resolutionSection}
                </span>
                <div className="flex gap-2">
                  {['480p', '720p'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setResolution(r)}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                        resolution === r
                          ? 'bg-[#FF6A00] text-black shadow-sm font-bold'
                          : 'border border-[#222533] bg-[#12141C] text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. 时长 (5s, 8s, 10s, 12s, 15s) */}
              <div>
                <span className="text-xs text-gray-400 block mb-2 font-medium">
                  {t.generator.durationSection}
                </span>
                <div className="flex flex-wrap gap-2">
                  {['5s', '8s', '10s', '12s', '15s'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDuration(d)}
                      className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                        duration === d
                          ? 'bg-[#FF6A00] text-black shadow-sm font-bold'
                          : 'border border-[#222533] bg-[#12141C] text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <span>{d}</span>
                      {d === '15s' && (
                        <span className={`ml-1 text-[10px] px-1 py-0.2 rounded font-mono ${
                          duration === '15s' ? 'bg-black/20 text-black font-bold' : 'text-[#FF6A00] bg-[#FF6A00]/10'
                        }`}>
                          +30%
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. 画面比例 (9:16, 1:1, 16:9) */}
              <div>
                <span className="text-xs text-gray-400 block mb-2 font-medium">
                  {t.generator.aspectRatioSection}
                </span>
                <div className="flex gap-2">
                  {['9:16', '1:1', '16:9'].map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAspectRatio(a)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                        aspectRatio === a
                          ? 'bg-[#FF6A00] text-black shadow-sm font-bold'
                          : 'border border-[#222533] bg-[#12141C] text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 步骤 4: 这首歌唱给谁？写上名字和场合 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#181B26] text-xs font-black text-gray-400">
            4
          </span>
          <span className="text-sm font-bold text-white">{t.generator.step4Title}</span>
        </div>

        {/* 快捷场合胶囊 */}
        <div className="flex flex-wrap gap-2 mb-3">
          {occasions.map((occ) => {
            const isSelected = selectedOccasion === occ.key;
            return (
              <button
                key={occ.key}
                type="button"
                onClick={() => {
                  setSelectedOccasion(occ.key);
                  if (!topicInput) setTopicInput(occ.label.replace(/^[^\s]+\s*/, ''));
                }}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  isSelected
                    ? 'border-[#FF6A00] bg-[#FF6A00]/15 text-[#FF6A00]'
                    : 'border-[#222533] bg-[#0A0C13] text-gray-300 hover:border-[#FF6A00]'
                }`}
              >
                {occ.label}
              </button>
            );
          })}
        </div>

        {/* 文本输入框 */}
        <input
          type="text"
          maxLength={120}
          value={topicInput}
          onChange={(e) => setTopicInput(e.target.value)}
          placeholder={t.generator.topicPlaceholder}
          className="w-full rounded-xl border border-[#222533] bg-[#0A0C13] px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#FF6A00] focus:outline-none"
        />

        <p className="mt-2 text-xs text-gray-400">
          {t.generator.step4Footer}
        </p>

        {/* AI 内容安全合规提示与前置扫描保障 */}
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-gray-400">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          <span>Protected by automated content moderation & prompt safety screening (AUP & Copyright compliant).</span>
        </div>
      </div>

      {/* 橙色大号 CTA 生成按钮 */}
      {!user ? (
        <button
          type="button"
          onClick={openAuthModal}
          className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#FF8A00] py-4 text-base font-black uppercase tracking-wider text-black shadow-xl shadow-[#FF6A00]/30 hover:from-[#FF7D1A] hover:to-[#FFA01A] transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <Mic className="h-5 w-5 fill-black stroke-black" />
          <span>Sign In to Generate (10 Free Credits)</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#FF8A00] py-4 text-base font-black uppercase tracking-wider text-black shadow-xl shadow-[#FF6A00]/30 hover:from-[#FF7D1A] hover:to-[#FFA01A] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <span className="h-5 w-5 rounded-full border-2 border-black border-t-transparent animate-spin"></span>
              <span>{t.generator.generatingBtn}</span>
            </>
          ) : (
            <>
              <Mic className="h-5 w-5 fill-black stroke-black" />
              <span>{t.generator.ctaBtn}</span>
            </>
          )}
        </button>
      )}

      {/* 底部保障提示 */}
      <p className="mt-3 text-center text-xs text-gray-400">
        {t.generator.guaranteeText}
      </p>

      {/* 沉浸式 AI 渲染全屏等待弹窗 (带动态进度、旋转光环、动效声波与步骤轮播) */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-sm rounded-3xl border border-[#FF6A00]/40 bg-[#12141C] p-6 text-center shadow-2xl">
            {/* 顶栏状态徽章 */}
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FF6A00]/15 px-3 py-1 text-xs font-bold text-[#FF6A00] mb-4">
              <span className="h-2 w-2 rounded-full bg-[#FF6A00] animate-ping"></span>
              <span>AI GPU Generating Video</span>
            </div>

            {/* 视觉动效中心：发光黑胶唱片与旋转声波 */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute h-28 w-28 rounded-full bg-[#FF6A00]/20 blur-xl animate-pulse"></div>
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-[#FF6A00]/40 bg-[#0A0C13] shadow-inner shadow-black">
                <Disc className="h-12 w-12 text-[#FF6A00] animate-[spin_4s_linear_infinite]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Music className="h-5 w-5 text-white animate-bounce" />
                </div>
              </div>
            </div>

            {/* 标题与计时 */}
            <h3 className="font-display text-lg font-bold text-white mb-1">
              Rendering Your Rap Video
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              ByteDance Seedance 2.0 Mini • Elapsed <span className="font-mono font-semibold text-white">{generateElapsed}s</span>
            </p>

            {/* 动态进度条 */}
            <div className="w-full bg-[#0A0C13] rounded-full h-2 mb-3 overflow-hidden border border-[#222533]">
              <div
                className="bg-gradient-to-r from-[#FF6A00] via-[#FF8A00] to-[#FFA01A] h-2 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${Math.min(95, Math.max(12, Math.round(generateElapsed * 1.3)))}%`,
                }}
              ></div>
            </div>

            {/* 步骤提示轮播 */}
            <div className="min-h-[40px] flex items-center justify-center">
              <p className="text-xs font-medium text-amber-200/90 animate-pulse transition-all">
                {[
                  '✨ Analyzing photo facial landmarks & angles...',
                  '🔥 Writing custom rhyming rap lyrics & 142 BPM beat...',
                  '🎤 Synthesizing flow & lip-synced facial animation...',
                  '🎬 Rendering dynamic camera motions & stage lighting...',
                  '⚡ Finalizing 720p music video master track...',
                ][generateStepIndex]}
              </p>
            </div>

            {/* 底部贴心防跳出提示 */}
            <div className="mt-4 pt-3 border-t border-[#222533]/60 flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
              <Radio className="h-3 w-3 text-[#FF6A00] animate-pulse" />
              <span>Please keep this window open while rendering</span>
            </div>
          </div>
        </div>
      )}

      {/* 结果播放弹窗 */}
      {generatedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-sm rounded-3xl border border-[#FF6A00]/50 bg-[#12141C] p-5 text-center shadow-2xl">
            <button
              onClick={() => setGeneratedResult(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <span className="inline-block rounded-full bg-[#FF6A00]/20 px-3 py-1 text-[11px] font-bold text-[#FF6A00] mb-2">
              🎉 Render Complete
            </span>
            <h3 className="font-display text-lg font-bold text-white mb-2">
              Your Viral Rap Duo Video
            </h3>
            <div className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-black mb-3 border border-[#222533]">
              <video
                src={generatedResult.videoUrl}
                autoPlay
                loop
                playsInline
                controls
                className="h-full w-full object-cover object-top"
              />
            </div>
            <p className="text-xs text-gray-400 italic mb-4">
              "{generatedResult.lyrics}"
            </p>
            <div className="flex gap-2">
              <a
                href={generatedResult.videoUrl}
                download="rapduo-video.mp4"
                className="flex-1 rounded-xl bg-[#FF6A00] py-2.5 text-xs font-bold text-black hover:bg-[#FF7D1A]"
              >
                Download Video
              </a>
              <button
                onClick={() => setGeneratedResult(null)}
                className="rounded-xl border border-[#222533] bg-[#181B26] px-4 py-2.5 text-xs font-semibold text-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
