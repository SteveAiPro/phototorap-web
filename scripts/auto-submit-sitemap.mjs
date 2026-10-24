import https from 'https';

const host = 'phototorap.com';
const key = 'ad3b3f17661a4bfab2047e65f53f8ccf';
const keyLocation = `https://${host}/${key}.txt`;

// List of all essential indexed URLs
//
// ⚠️ 不要再加入语言 URL（/zh /es /fr /pt /de /ja /ko）：
// 本站没有语言路由，这些 URL 全部返回 404（实测 2026-10-11）。
// 向 IndexNow 提交 404 页面会污染提交质量，也可能导致整批被拒。
const urlList = [
  `https://${host}`,
  `https://${host}/hotel-lobby-ai`,
  `https://${host}/ai-rap-generator`,
  `https://${host}/birthday-rap-song`,
  `https://${host}/ai-rap-battle-generator`,
  `https://${host}/diss-track-generator`,
  `https://${host}/rap-duo-name-generator`,
  `https://${host}/halloween-rap-song`,
  `https://${host}/pricing`,
  `https://${host}/guides`,
  `https://${host}/privacy`,
  `https://${host}/terms`,
  `https://${host}/refund`,
  `https://${host}/ethics`,
  `https://${host}/guides/higgsfield-hotel-lobby`,
  `https://${host}/guides/funny-rap-lyrics`,
  `https://${host}/guides/hotel-lobby-capcut-template`,
  `https://${host}/guides/hotel-lobby-trend-ideas`,
  `https://${host}/guides/rap-battle-roasts`,
  `https://${host}/guides/rap-songs-about-friends`,
  `https://${host}/guides/best-ai-music-video-generators`,
  `https://${host}/guides/best-ai-rap-generator`,
  `https://${host}/guides/best-rap-duos`,
  `https://${host}/guides/how-to-make-an-ai-rap-video`,
  `https://${host}/guides/quavo-and-takeoff`,
  `https://${host}/guides/hotel-lobby-song-quavo-takeoff`,
  `https://${host}/guides/how-to-do-the-hotel-lobby-trend`,
  `https://${host}/guides/hotel-lobby-ai-apps`,
  `https://${host}/guides/how-to-make-a-diss-track`,
];

const postData = JSON.stringify({
  host,
  key,
  keyLocation,
  urlList,
});

const endpoints = [
  { hostname: 'api.indexnow.org', path: '/IndexNow' },
  { hostname: 'www.bing.com', path: '/IndexNow' },
];

console.log(`[Auto-Sitemap Submission] Broadcasting ${urlList.length} URLs to IndexNow...`);

endpoints.forEach(({ hostname, path }) => {
  const req = https.request(
    {
      hostname,
      port: 443,
      path,
      method: 'POST',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(postData),
      },
    },
    (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        console.log(`[IndexNow - ${hostname}] Response: HTTP ${res.statusCode} ${data ? '- ' + data : '(Success/Accepted)'}`);
      });
    }
  );

  req.on('error', (e) => {
    console.error(`[IndexNow - ${hostname}] Error: ${e.message}`);
  });

  req.write(postData);
  req.end();
});
