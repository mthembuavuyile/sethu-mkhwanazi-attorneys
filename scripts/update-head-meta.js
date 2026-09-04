const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

const filesToUpdate = [
  'index.html',
  'about.html',
  'contact.html',
  'book-consultation.html',
  'privacy.html',
  'terms.html',
  '404.html',
  'services/index.html',
  'services/civil-litigation.html',
  'services/corporate-commercial-law.html',
  'services/estate-planning-wills.html',
  'services/family-law-attorneys.html',
  'services/labour-employment-law.html',
];

const faviconSnippet = `  <!-- Favicon & App Icons (Google Search & Browser Tabs) -->
  <link rel="icon" type="image/png" sizes="48x48" href="/images/favicon-48x48.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <meta name="theme-color" content="#111115">`;

const ogImageReplacement = `  <meta property="og:image" content="https://sethumkhwanaziattorneys.co.za/images/og-image.jpg">
  <meta property="og:image:secure_url" content="https://sethumkhwanaziattorneys.co.za/images/og-image.jpg">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Sethu Mkhwanazi Attorneys Inc. - Durban Law Firm">`;

let updatedCount = 0;

for (const relFile of filesToUpdate) {
  const filePath = path.join(ROOT_DIR, relFile);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf-8');

  // 1. Replace og:image and ensure full OG image metadata
  // Remove existing og:image, og:image:width, og:image:height, og:image:alt, og:image:secure_url, og:image:type if present
  content = content.replace(/[ \t]*<meta property="og:image"[^>]*>[\r\n]*/g, '');
  content = content.replace(/[ \t]*<meta property="og:image:secure_url"[^>]*>[\r\n]*/g, '');
  content = content.replace(/[ \t]*<meta property="og:image:type"[^>]*>[\r\n]*/g, '');
  content = content.replace(/[ \t]*<meta property="og:image:width"[^>]*>[\r\n]*/g, '');
  content = content.replace(/[ \t]*<meta property="og:image:height"[^>]*>[\r\n]*/g, '');
  content = content.replace(/[ \t]*<meta property="og:image:alt"[^>]*>[\r\n]*/g, '');

  if (content.includes('<meta property="og:locale"')) {
    content = content.replace(
      /([ \t]*<meta property="og:locale"[^>]*>)/,
      `${ogImageReplacement}\n$1`
    );
  } else {
    content = content.replace(
      /(<!-- Open Graph \/ Social Media -->[\r\n]+)/,
      `$1${ogImageReplacement}\n`
    );
  }

  // 2. Replace twitter:image
  content = content.replace(/[ \t]*<meta name="twitter:image"[^>]*>[\r\n]*/g, '');
  if (content.includes('<!-- Twitter Card -->')) {
    content = content.replace(
      /(<!-- Twitter Card -->[\s\S]*?<meta name="twitter:description"[^>]*>)/,
      `$1\n  <meta name="twitter:image" content="https://sethumkhwanaziattorneys.co.za/images/og-image.jpg">`
    );
  }

  // 3. Inject Favicon block if not already present
  if (!content.includes('rel="apple-touch-icon"')) {
    if (content.includes('<!-- Fonts -->')) {
      content = content.replace(
        /([ \t]*<!-- Fonts -->)/,
        `${faviconSnippet}\n\n$1`
      );
    } else {
      content = content.replace(
        /<\/head>/i,
        `${faviconSnippet}\n</head>`
      );
    }
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated head & meta tags in: ${relFile}`);
  updatedCount++;
}

console.log(`Successfully updated ${updatedCount} files!`);
