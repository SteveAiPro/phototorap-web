export type Locale = 'en' | 'zh' | 'es' | 'fr' | 'pt' | 'de' | 'ja' | 'ko';

export interface Translations {
  nav: {
    makeVideo: string;
    featuredHits: string;
    hotelLobby: string;
    guides: string;
    pricing: string;
    faq: string;
    credits: string;
    signIn: string;
    signOut: string;
  };
  hero: {
    badge: string;
    title1: string;
    title2: string;
    title3: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: string;
    bpm: string;
  };
  generator: {
    step1TitleTwo: string;
    step1TitleOne: string;
    tabTwoSolo: string;
    tabOnePhoto: string;
    photo1Label: string;
    photo1Hint: string;
    photo2Label: string;
    photo2Hint: string;
    duoPhotoLabel: string;
    duoPhotoHint: string;
    step1Footer: string;

    step2Title: string;
    stageHotelLobby: string;
    stageHotelLobbySub: string;
    stageLuxury: string;
    stageStudio: string;
    stageStreet: string;

    step3Title: string;
    qualityChangePrompt: string;
    creditsTag: string;
    modelSection: string;
    modelStandard: string;
    modelFast: string;
    modelPro: string;
    modelFlagship: string;
    resolutionSection: string;
    durationSection: string;
    aspectRatioSection: string;

    step4Title: string;
    occasionBirthday: string;
    occasionAnniversary: string;
    occasionBestFriends: string;
    occasionBusiness: string;
    topicPlaceholder: string;
    step4Footer: string;

    ctaBtn: string;
    generatingBtn: string;
    guaranteeText: string;
  };
}

export const DICTIONARY: Record<Locale, Translations> = {
  zh: {
    nav: {
      makeVideo: '制作视频',
      featuredHits: '精选爆款',
      hotelLobby: 'Hotel Lobby AI',
      guides: '攻略指南',
      pricing: '价格与点数',
      faq: '常见问题',
      credits: '积分',
      signIn: '登录账号',
      signOut: '退出登录',
    },
    hero: {
      badge: '全网火爆爆款 • 本周已生成超120万支',
      title1: '将你的',
      title2: '自拍照片',
      title3: '一键变成说唱短视频',
      subtitle: '上传2张自拍，选择经典橙色演播厅。PhotoToRap AI 在3分钟内自动生成卡点节拍、双人对口型与原创押韵歌词。',
      ctaPrimary: '立即制作说唱视频',
      ctaSecondary: '查看效果演示',
      stats: '超过 12,348 位创作者共同推荐',
      bpm: 'AI 声波实时对口型模型 • 142 BPM',
    },
    generator: {
      step1TitleTwo: '添加两张照片，每张一个人',
      step1TitleOne: '添加一张合照',
      tabTwoSolo: '两张单人照',
      tabOnePhoto: '一张合照',
      photo1Label: '照片 1 · 你',
      photo1Hint: '点击添加一张清晰自拍',
      photo2Label: '照片 2 · 你的搭档',
      photo2Hint: '点击添加一张清晰自拍',
      duoPhotoLabel: '双人合照 (包含2个人)',
      duoPhotoHint: '上传一张包含你们两人的清晰合影',
      step1Footer: '正脸、光线充足的照片效果最好。两张单人照或一张清晰合照，均会生成同样震撼的联手说唱视频！',

      step2Title: '选择舞台',
      stageHotelLobby: 'Hotel Lobby',
      stageHotelLobbySub: '(橙色)',
      stageLuxury: '豪华大堂',
      stageStudio: '录音棚',
      stageStreet: '街头 Cypher',

      step3Title: '选择画质与时长',
      qualityChangePrompt: '更改模型、分辨率、时长或画面比例',
      creditsTag: '积分',
      modelSection: '模型',
      modelStandard: '标准',
      modelFast: '快速',
      modelPro: '专业',
      modelFlagship: '旗舰',
      resolutionSection: '分辨率',
      durationSection: '时长',
      aspectRatioSection: '画面比例',

      step4Title: '这首歌唱给谁？写上名字和场合',
      occasionBirthday: '🎂 生日',
      occasionAnniversary: '💍 纪念日',
      occasionBestFriends: '🤝 好朋友',
      occasionBusiness: '🏪 我的生意',
      topicPlaceholder: '例如：小杰 30 岁生日、从小学就是好兄弟',
      step4Footer: '歌词会围绕你写的内容来唱，写上真名和一个小细节，歌就是你们的。不写也行，会唱一首通用的燃曲。',

      ctaBtn: '生成我们的说唱视频',
      generatingBtn: 'AI 正在谱写歌词并渲染说唱视频...',
      guaranteeText: '你的第一首歌可免费渲染 — 观看满意后再决定。',
    },
  },
  en: {
    nav: {
      makeVideo: 'Make a video',
      featuredHits: 'Featured Hits',
      hotelLobby: 'Hotel Lobby AI',
      guides: 'Guides',
      pricing: 'Pricing',
      faq: 'FAQ',
      credits: 'Credits',
      signIn: 'Sign In',
      signOut: 'Sign Out',
    },
    hero: {
      badge: 'Trending viral trend • 1.2M videos this week',
      title1: 'Turn your',
      title2: 'photos',
      title3: 'into rap videos',
      subtitle: 'Upload 2 selfies. Pick a stage. PhotoToRap AI generates viral hip-hop rap videos for any moment in 3 minutes.',
      ctaPrimary: 'Make a video',
      ctaSecondary: 'Watch how it works',
      stats: '12,348 creators made 1.2M+ videos',
      bpm: 'Sound-Reactive AI Model • 142 BPM',
    },
    generator: {
      step1TitleTwo: 'Add two photos — one person each',
      step1TitleOne: 'Add one photo of both',
      tabTwoSolo: 'Two photos',
      tabOnePhoto: 'One photo of both',
      photo1Label: 'Photo 1 · You',
      photo1Hint: 'Tap to add a clear selfie',
      photo2Label: 'Photo 2 · Your duo',
      photo2Hint: 'Tap to add a clear selfie',
      duoPhotoLabel: 'Duo Photo (2 People in 1 Picture)',
      duoPhotoHint: 'Upload a clear shot showing both faces',
      step1Footer: 'Front-facing, well-lit photos work best. Whether 2 separate selfies or 1 group photo, both generate the same viral rap duo video!',

      step2Title: 'Pick the stage',
      stageHotelLobby: 'Hotel Lobby',
      stageHotelLobbySub: '(orange)',
      stageLuxury: 'Luxury Lobby',
      stageStudio: 'Studio Booth',
      stageStreet: 'Street Cypher',

      step3Title: 'Pick quality & length',
      qualityChangePrompt: 'Change model, resolution, length or format',
      creditsTag: 'credits',
      modelSection: 'Model',
      modelStandard: 'Standard',
      modelFast: 'Fast',
      modelPro: 'Pro',
      modelFlagship: 'Flagship',
      resolutionSection: 'Resolution',
      durationSection: 'Length',
      aspectRatioSection: 'Aspect ratio',

      step4Title: 'Who\'s the song for? Add names and the occasion',
      occasionBirthday: '🎂 Birthday',
      occasionAnniversary: '💍 Anniversary',
      occasionBestFriends: '🤝 Best friends',
      occasionBusiness: '🏪 My business',
      topicPlaceholder: 'e.g. Jake\'s 30th birthday, best friends since kindergarten',
      step4Footer: 'The lyrics are written around what you type — real names and one detail make it yours. Leave it empty for a general hype song.',

      ctaBtn: 'Make our rap video',
      generatingBtn: 'Rendering AI Rap Video...',
      guaranteeText: 'Your first song renders free — watch it, then decide.',
    },
  },
  es: {
    nav: {
      makeVideo: 'Hacer video',
      featuredHits: 'Éxitos virales',
      hotelLobby: 'Hotel Lobby AI',
      guides: 'Guías',
      pricing: 'Precios',
      faq: 'Preguntas',
      credits: 'Créditos',
      signIn: 'Iniciar sesión',
      signOut: 'Cerrar sesión',
    },
    hero: {
      badge: 'Tendencia viral • 1.2M videos esta semana',
      title1: 'Convierte tus',
      title2: 'fotos',
      title3: 'en videos de rap',
      subtitle: 'Sube 2 selfies. Elige un escenario. PhotoToRap AI genera videos de rap virales en 3 minutos.',
      ctaPrimary: 'Crear video',
      ctaSecondary: 'Ver cómo funciona',
      stats: 'Más de 12,348 creadores',
      bpm: 'Modelo reactivo al sonido • 142 BPM',
    },
    generator: {
      step1TitleTwo: 'Agrega dos fotos, una persona cada una',
      step1TitleOne: 'Agrega una foto juntos',
      tabTwoSolo: 'Dos fotos',
      tabOnePhoto: 'Foto juntos',
      photo1Label: 'Foto 1 · Tú',
      photo1Hint: 'Toca para subir un selfie',
      photo2Label: 'Foto 2 · Tu dúo',
      photo2Hint: 'Toca para subir un selfie',
      duoPhotoLabel: 'Foto del dúo (2 personas en 1 foto)',
      duoPhotoHint: 'Sube una foto clara con ambos rostros',
      step1Footer: 'Fotos frontales y bien iluminadas funcionan mejor. Ya sean 2 fotos individuales o 1 foto juntos, ambas generan el mismo video de rap dúo.',

      step2Title: 'Elige el escenario',
      stageHotelLobby: 'Hotel Lobby',
      stageHotelLobbySub: '(naranja)',
      stageLuxury: 'Lobby de Lujo',
      stageStudio: 'Cabina de Estudio',
      stageStreet: 'Cypher Callejero',

      step3Title: 'Elige calidad y duración',
      qualityChangePrompt: 'Cambiar modelo, resolución, duración o formato',
      creditsTag: 'créditos',
      modelSection: 'Modelo',
      modelStandard: 'Estándar',
      modelFast: 'Rápido',
      modelPro: 'Profesional',
      modelFlagship: 'Insignia',
      resolutionSection: 'Resolución',
      durationSection: 'Duración',
      aspectRatioSection: 'Relación de aspecto',

      step4Title: '¿Para quién es la canción? Nombres y ocasión',
      occasionBirthday: '🎂 Cumpleaños',
      occasionAnniversary: '💍 Aniversario',
      occasionBestFriends: '🤝 Mejores amigos',
      occasionBusiness: '🏪 Mi negocio',
      topicPlaceholder: 'ej. Cumpleaños 30 de Alex, amigos desde la escuela',
      step4Footer: 'La letra se escribe en torno a lo que escribas.',

      ctaBtn: 'Hacer nuestro video de rap',
      generatingBtn: 'Generando video de rap con IA...',
      guaranteeText: 'Tu primera canción se procesa gratis — mírala antes de pagar.',
    },
  },
  fr: {
    nav: {
      makeVideo: 'Créer une vidéo',
      featuredHits: 'Hits populaires',
      hotelLobby: 'Hotel Lobby AI',
      guides: 'Guides',
      pricing: 'Tarifs',
      faq: 'FAQ',
      credits: 'Crédits',
      signIn: 'Connexion',
      signOut: 'Déconnexion',
    },
    hero: {
      badge: 'Tendance virale • 1,2M de vidéos cette semaine',
      title1: 'Transformez vos',
      title2: 'photos',
      title3: 'en clips de rap',
      subtitle: 'Téléchargez 2 selfies. Choisissez un studio. PhotoToRap AI génère des vidéos de rap en 3 minutes.',
      ctaPrimary: 'Faire une vidéo',
      ctaSecondary: 'Voir la démo',
      stats: '12 348 créateurs conquis',
      bpm: 'Modèle audio réactif • 142 BPM',
    },
    generator: {
      step1TitleTwo: 'Ajoutez deux photos — une par personne',
      step1TitleOne: 'Ajoutez une photo ensemble',
      tabTwoSolo: 'Deux photos',
      tabOnePhoto: 'Photo ensemble',
      photo1Label: 'Photo 1 · Vous',
      photo1Hint: 'Appuyez pour ajouter un selfie',
      photo2Label: 'Photo 2 · Votre duo',
      photo2Hint: 'Appuyez pour ajouter un selfie',
      duoPhotoLabel: 'Photo en duo (2 personnes sur 1 photo)',
      duoPhotoHint: 'Téléchargez une photo nette avec les deux visages',
      step1Footer: 'Des photos de face bien éclairées donnent les meilleurs résultats. 2 selfies ou 1 photo à deux créent le même clip de rap en duo.',

      step2Title: 'Choisissez le studio',
      stageHotelLobby: 'Hotel Lobby',
      stageHotelLobbySub: '(orange)',
      stageLuxury: 'Luxe Lobby',
      stageStudio: 'Studio Micro',
      stageStreet: 'Street Cypher',

      step3Title: 'Qualité et durée',
      qualityChangePrompt: 'Changer le modèle, la résolution ou la durée',
      creditsTag: 'crédits',
      modelSection: 'Modèle',
      modelStandard: 'Standard',
      modelFast: 'Rapide',
      modelPro: 'Pro',
      modelFlagship: 'Fleuron',
      resolutionSection: 'Résolution',
      durationSection: 'Durée',
      aspectRatioSection: 'Format d\'image',

      step4Title: 'Pour qui est la chanson ? Noms et occasion',
      occasionBirthday: '🎂 Anniversaire',
      occasionAnniversary: '💍 Mariage',
      occasionBestFriends: '🤝 Meilleurs amis',
      occasionBusiness: '🏪 Mon entreprise',
      topicPlaceholder: 'ex: 30 ans de Thomas, amis d\'enfance',
      step4Footer: 'Les paroles sont écrites selon vos détails.',

      ctaBtn: 'Créer notre vidéo de rap',
      generatingBtn: 'Génération du clip en cours...',
      guaranteeText: 'Votre premier aperçu est gratuit — regardez avant de payer.',
    },
  },
  pt: {
    nav: {
      makeVideo: 'Criar vídeo',
      featuredHits: 'Destaques',
      hotelLobby: 'Hotel Lobby AI',
      guides: 'Guias',
      pricing: 'Preços',
      faq: 'Perguntas',
      credits: 'Créditos',
      signIn: 'Entrar',
      signOut: 'Sair',
    },
    hero: {
      badge: 'Tendência viral • 1.2M vídeos esta semana',
      title1: 'Transforme suas',
      title2: 'fotos',
      title3: 'em vídeos de rap',
      subtitle: 'Envie 2 selfies. Escolha o palco. PhotoToRap AI cria vídeos de rap com rimas e sincronia labial em 3 minutos.',
      ctaPrimary: 'Criar vídeo',
      ctaSecondary: 'Como funciona',
      stats: 'Mais de 12.348 criadores',
      bpm: 'Modelo IA reativo ao som • 142 BPM',
    },
    generator: {
      step1TitleTwo: 'Adicione duas fotos — uma de cada pessoa',
      step1TitleOne: 'Adicione uma foto juntos',
      tabTwoSolo: 'Duas fotos',
      tabOnePhoto: 'Foto juntos',
      photo1Label: 'Foto 1 · Você',
      photo1Hint: 'Toque para adicionar uma selfie',
      photo2Label: 'Foto 2 · Sua dupla',
      photo2Hint: 'Toque para adicionar uma selfie',
      duoPhotoLabel: 'Foto da dupla (2 pessoas em 1 foto)',
      duoPhotoHint: 'Envie uma foto nítida com os dois rostos',
      step1Footer: 'Fotos frontais bem iluminadas funcionam melhor. Duas selfies ou uma foto juntos geram o mesmo vídeo de rap em dupla!',

      step2Title: 'Escolha o palco',
      stageHotelLobby: 'Hotel Lobby',
      stageHotelLobbySub: '(laranja)',
      stageLuxury: 'Hall de Luxo',
      stageStudio: 'Cabine de Estúdio',
      stageStreet: 'Roda de Rua',

      step3Title: 'Qualidade e duração',
      qualityChangePrompt: 'Alterar modelo, resolução, duração ou formato',
      creditsTag: 'créditos',
      modelSection: 'Modelo',
      modelStandard: 'Padrão',
      modelFast: 'Rápido',
      modelPro: 'Profissional',
      modelFlagship: 'Topo de Linha',
      resolutionSection: 'Resolução',
      durationSection: 'Duração',
      aspectRatioSection: 'Proporção',

      step4Title: 'Para quem é a música? Nomes e ocasião',
      occasionBirthday: '🎂 Aniversário',
      occasionAnniversary: '💍 Bodas',
      occasionBestFriends: '🤝 Melhores amigos',
      occasionBusiness: '🏪 Meu negócio',
      topicPlaceholder: 'ex: 30 anos do Lucas, amigos de infância',
      step4Footer: 'A letra é escrita em torno dos detalhes enviados.',

      ctaBtn: 'Gerar nosso vídeo de rap',
      generatingBtn: 'Gerando vídeo de rap com IA...',
      guaranteeText: 'Seu primeiro vídeo renderiza grátis — assista antes de pagar.',
    },
  },
  de: {
    nav: {
      makeVideo: 'Video erstellen',
      featuredHits: 'Top Hits',
      hotelLobby: 'Hotel Lobby AI',
      guides: 'Anleitungen',
      pricing: 'Preise',
      faq: 'FAQ',
      credits: 'Credits',
      signIn: 'Anmelden',
      signOut: 'Abmelden',
    },
    hero: {
      badge: 'Viraler Trend • 1,2 Mio. Videos diese Woche',
      title1: 'Verwandle deine',
      title2: 'Fotos',
      title3: 'in Rap-Videos',
      subtitle: '2 Selfies hochladen. Studio wählen. PhotoToRap AI generiert virale Rap-Duo-Videos in 3 Minuten.',
      ctaPrimary: 'Video erstellen',
      ctaSecondary: 'Video ansehen',
      stats: 'Über 12.348 Creators',
      bpm: 'Sound-reaktives KI-Modell • 142 BPM',
    },
    generator: {
      step1TitleTwo: 'Zwei Fotos hinzufügen — jeweils eine Person',
      step1TitleOne: 'Ein gemeinsames Foto hinzufügen',
      tabTwoSolo: 'Zwei Einzelfotos',
      tabOnePhoto: 'Gemeinsames Foto',
      photo1Label: 'Foto 1 · Du',
      photo1Hint: 'Tippen für klares Selfie',
      photo2Label: 'Foto 2 · Partner',
      photo2Hint: 'Tippen für klares Selfie',
      duoPhotoLabel: 'Duo-Foto (2 Personen auf 1 Bild)',
      duoPhotoHint: 'Klares Foto mit beiden Gesichtern hochladen',
      step1Footer: 'Frontale, gut beleuchtete Fotos eignen sich am besten. Ob 2 Einzelfotos oder 1 gemeinsames Bild — beides liefert das gleiche Rap-Duo-Video!',

      step2Title: 'Wähle die Bühne',
      stageHotelLobby: 'Hotel Lobby',
      stageHotelLobbySub: '(orange)',
      stageLuxury: 'Luxus Lobby',
      stageStudio: 'Studio Kabine',
      stageStreet: 'Street Cypher',

      step3Title: 'Qualität & Länge wählen',
      qualityChangePrompt: 'Modell, Auflösung, Länge oder Format ändern',
      creditsTag: 'Credits',
      modelSection: 'Modell',
      modelStandard: 'Standard',
      modelFast: 'Schnell',
      modelPro: 'Pro',
      modelFlagship: 'Flaggschiff',
      resolutionSection: 'Auflösung',
      durationSection: 'Dauer',
      aspectRatioSection: 'Bildformat',

      step4Title: 'Für wen ist der Song? Namen und Anlass',
      occasionBirthday: '🎂 Geburtstag',
      occasionAnniversary: '💍 Jubiläum',
      occasionBestFriends: '🤝 Beste Freunde',
      occasionBusiness: '🏪 Mein Business',
      topicPlaceholder: 'z.B. Jakes 30. Geburtstag, Freunde seit der Schule',
      step4Footer: 'Der Text dreht sich um deine Angaben.',

      ctaBtn: 'Unser Rap-Video erstellen',
      generatingBtn: 'KI-Rap-Video wird gerendert...',
      guaranteeText: 'Dein erster Song rendert kostenlos — erst ansehen, dann entscheiden.',
    },
  },
  ja: {
    nav: {
      makeVideo: '動画を作成',
      featuredHits: '人気デモ',
      hotelLobby: 'Hotel Lobby AI',
      guides: 'ガイド',
      pricing: '料金プラン',
      faq: 'よくある質問',
      credits: 'クレジット',
      signIn: 'ログイン',
      signOut: 'ログアウト',
    },
    hero: {
      badge: '世界中で大流行 • 今週120万本以上の動画が生成',
      title1: '写真2枚を',
      title2: 'AIラップ動画',
      title3: 'へ瞬時に変換',
      subtitle: 'セルフィーを2枚アップロードしてステージを選ぶだけ。PhotoToRap AIが3分でオリジナルのラップ動画を生成します。',
      ctaPrimary: '今すぐ動画を作る',
      ctaSecondary: 'デモを見る',
      stats: '12,348人以上のクリエイターが愛用',
      bpm: 'リアルタイム音波同期モデル • 142 BPM',
    },
    generator: {
      step1TitleTwo: '写真を2枚追加（各1人）',
      step1TitleOne: '2人の集合写真を追加',
      tabTwoSolo: '個人写真2枚',
      tabOnePhoto: '集合写真1枚',
      photo1Label: '写真 1 · あなた',
      photo1Hint: 'タップして自撮りを追加',
      photo2Label: '写真 2 · パートナー',
      photo2Hint: 'タップして自撮りを追加',
      duoPhotoLabel: '2人の写真（1枚に2人）',
      duoPhotoHint: '2人の顔がはっきり写った写真を追加',
      step1Footer: '正面を向いた明るい写真が最も綺麗に仕上がります。個別写真2枚でも2人の写真1枚でも、同じ本格ラップ動画が完成します！',

      step2Title: 'ステージを選択',
      stageHotelLobby: 'Hotel Lobby',
      stageHotelLobbySub: '(オレンジ)',
      stageLuxury: '高級ロビー',
      stageStudio: '録音ブース',
      stageStreet: 'ストリート Cypher',

      step3Title: '画質と動画の長さを選択',
      qualityChangePrompt: 'モデル、解像度、長さ、縦横比を変更',
      creditsTag: 'クレジット',
      modelSection: 'モデル',
      modelStandard: '標準',
      modelFast: '高速',
      modelPro: 'プロ',
      modelFlagship: 'フラッグシップ',
      resolutionSection: '解像度',
      durationSection: '長さ',
      aspectRatioSection: '画面比率',

      step4Title: '誰に捧げる曲ですか？名前とシチュエーション',
      occasionBirthday: '🎂 誕生日',
      occasionAnniversary: '💍 記念日',
      occasionBestFriends: '🤝 親友',
      occasionBusiness: '🏪 ビジネス',
      topicPlaceholder: '例：ケンタの30歳の誕生日、小学校からの親友',
      step4Footer: '入力した詳細に合わせてAIがオリジナルのリリックを作詞します。',

      ctaBtn: '二人のラップ動画を生成',
      generatingBtn: 'AIがラップ動画を生成中...',
      guaranteeText: '最初の1本は無料プレビュー可能 — 確認してから決定できます。',
    },
  },
  ko: {
    nav: {
      makeVideo: '비디오 제작',
      featuredHits: '인기 데모',
      hotelLobby: 'Hotel Lobby AI',
      guides: '가이드',
      pricing: '요금제',
      faq: '자주 묻는 질문',
      credits: '크레딧',
      signIn: '로그인',
      signOut: '로그아웃',
    },
    hero: {
      badge: '바이럴 트렌드 • 이번 주 120만 개 이상의 비디오 생성',
      title1: '셀카 사진을',
      title2: '힙합 랩 비디오',
      title3: '로 즉시 변환하세요',
      subtitle: '사진 2장을 업로드하고 스튜디오를 선택하세요. PhotoToRap AI가 3분 만에 비트와 립싱크가 포함된 랩 비디오를 생성합니다.',
      ctaPrimary: '랩 비디오 만들기',
      ctaSecondary: '작동 방식 보기',
      stats: '12,348명 이상의 크리에이터 사용',
      bpm: '비트 반응형 AI 모델 • 142 BPM',
    },
    generator: {
      step1TitleTwo: '사진 2장 추가 (각 1명씩)',
      step1TitleOne: '2인 단체 사진 추가',
      tabTwoSolo: '개인 사진 2장',
      tabOnePhoto: '함께 찍은 사진 1장',
      photo1Label: '사진 1 · 나',
      photo1Hint: '선명한 셀카 추가',
      photo2Label: '사진 2 · 파트너',
      photo2Hint: '선명한 셀카 추가',
      duoPhotoLabel: '2인 단체 사진 (1장에 2명)',
      duoPhotoHint: '두 사람의 얼굴이 선명한 사진 업로드',
      step1Footer: '정면을 바라보고 조명이 밝은 사진이 가장 잘 나옵니다. 개인 사진 2장이든 1장의 단체 사진이든, 동일하게 완성도 높은 랩 비디오가 생성됩니다!',

      step2Title: '무대 선택',
      stageHotelLobby: 'Hotel Lobby',
      stageHotelLobbySub: '(오렌지)',
      stageLuxury: '럭셔리 로비',
      stageStudio: '스튜디오 부스',
      stageStreet: '스트리트 사이퍼',

      step3Title: '화질 및 재생 시간 선택',
      qualityChangePrompt: '모델, 해상도, 시간 또는 화면 비율 변경',
      creditsTag: '크레딧',
      modelSection: '모델',
      modelStandard: '표준',
      modelFast: '고속',
      modelPro: '프로',
      modelFlagship: '플래그십',
      resolutionSection: '해상도',
      durationSection: '재생 시간',
      aspectRatioSection: '화면 비율',

      step4Title: '누구를 위한 노래인가요? 이름과 기념일',
      occasionBirthday: '🎂 생일',
      occasionAnniversary: '💍 기념일',
      occasionBestFriends: '🤝 베스트 프렌드',
      occasionBusiness: '🏪 비즈니스',
      topicPlaceholder: '예: 민수의 30번째 생일, 초등학교 때부터 절친',
      step4Footer: '적어주신 내용을 바탕으로 맞춤형 랩 가사가 제작됩니다.',

      ctaBtn: '우리의 랩 비디오 생성하기',
      generatingBtn: 'AI 랩 비디오 렌더링 중...',
      guaranteeText: '첫 번째 비디오는 무료로 렌더링됩니다 — 확인 후 결정하세요.',
    },
  },
};
