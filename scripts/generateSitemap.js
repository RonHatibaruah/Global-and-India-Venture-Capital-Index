import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { VC_FUNDS } from '../src/data/vcFunds.js';
import { slugify } from '../src/data/categories.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://vc.flugelsoft.com';
const today = new Date().toISOString().split('T')[0];

const urls = [
  { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'daily' },
  { loc: `${BASE_URL}/?india=true`, priority: '0.9', changefreq: 'daily' },
  { loc: `${BASE_URL}/?guide=true`, priority: '0.9', changefreq: 'weekly' }
];

// Add each fund detail page
VC_FUNDS.forEach((fund) => {
  const slug = slugify(fund.name);
  urls.push({
    loc: `${BASE_URL}/fund/${slug}`,
    priority: fund.hasIndiaInvestments ? '0.85' : '0.8',
    changefreq: 'weekly'
  });
});

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

const publicDir = path.resolve(__dirname, '../public');
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml.trim());
console.log(`Generated sitemap with ${urls.length} URLs for ${BASE_URL}`);
