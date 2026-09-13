/**
 * /ads.txt — AdSense doğrulama.
 * public/ads.txt deploy’da yoksa bile bu endpoint düzgün text döner.
 */
const ADS_TXT = 'google.com, pub-3187848592164532, DIRECT, f08c47fec0942fa0\n';

export default function handler(req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
  res.end(ADS_TXT);
}
