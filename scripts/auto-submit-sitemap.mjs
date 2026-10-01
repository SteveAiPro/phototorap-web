import https from 'https';

const host = 'phototorap.com';
const key = '3a598e916a2d48bfbcba89f0e15c3e09';
const keyLocation = `https://${host}/${key}.txt`;

// List of all essential indexed URLs
const urlList = [
  `https://${host}`,
  `https://${host}/zh`,
  `https://${host}/es`,
  `https://${host}/fr`,
  `https://${host}/pt`,
  `https://${host}/de`,
  `https://${host}/ja`,
  `https://${host}/ko`,
  `https://${host}/hotel-lobby-ai`,
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
