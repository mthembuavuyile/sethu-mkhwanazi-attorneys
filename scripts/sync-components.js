/**
 * Sethu Mkhwanazi Attorneys Inc.
 * Build & Synchronization Script for Standardized Components
 * 
 * Synchronizes header, footer, WhatsApp CTA, and social icons
 * across all root and service pages with 100% pre-rendered static HTML
 * for optimal SEO, accessibility, and zero-JS compatibility.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

// Master component templates
const headerTemplate = fs.readFileSync(path.join(ROOT_DIR, 'components', 'header.html'), 'utf-8');
const footerTemplate = fs.readFileSync(path.join(ROOT_DIR, 'components', 'footer.html'), 'utf-8');
const whatsappTemplate = fs.readFileSync(path.join(ROOT_DIR, 'components', 'whatsapp-button.html'), 'utf-8');

// Pages configuration
const pages = [
  // Root Pages
  { file: 'index.html', dir: '', active: 'home', headerBg: 'bg-transparent' },
  { file: 'about.html', dir: '', active: 'about', headerBg: 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm' },
  { file: 'contact.html', dir: '', active: 'contact', headerBg: 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm' },
  { file: 'book-consultation.html', dir: '', active: 'book', headerBg: 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm' },
  { file: 'privacy.html', dir: '', active: 'none', headerBg: 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm' },
  { file: 'terms.html', dir: '', active: 'none', headerBg: 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm' },
  { file: '404.html', dir: '', active: 'none', headerBg: 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm' },

  // Services Pages
  { file: 'services/index.html', dir: 'services', active: 'services', headerBg: 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm' },
  { file: 'services/civil-litigation.html', dir: 'services', active: 'services', headerBg: 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm' },
  { file: 'services/corporate-commercial-law.html', dir: 'services', active: 'services', headerBg: 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm' },
  { file: 'services/estate-planning-wills.html', dir: 'services', active: 'services', headerBg: 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm' },
  { file: 'services/family-law-attorneys.html', dir: 'services', active: 'services', headerBg: 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm' },
  { file: 'services/labour-employment-law.html', dir: 'services', active: 'services', headerBg: 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm' },
];

function generateHeader(page) {
  const prefix = page.dir ? '../' : '';
  const activeClass = 'text-accent font-semibold';
  const inactiveClass = 'text-foreground/80';
  const activeMobileClass = 'text-accent font-semibold';
  const inactiveMobileClass = 'text-foreground';

  let rendered = headerTemplate
    .replace(/\{\{PREFIX\}\}/g, prefix)
    .replace(/\{\{HEADER_BG_CLASS\}\}/g, page.headerBg)
    .replace(/\{\{ACTIVE_HOME\}\}/g, page.active === 'home' ? activeClass : inactiveClass)
    .replace(/\{\{ACTIVE_SERVICES\}\}/g, page.active === 'services' ? activeClass : inactiveClass)
    .replace(/\{\{ACTIVE_ABOUT\}\}/g, page.active === 'about' ? activeClass : inactiveClass)
    .replace(/\{\{ACTIVE_CONTACT\}\}/g, page.active === 'contact' ? activeClass : inactiveClass)
    .replace(/\{\{ACTIVE_BOOK\}\}/g, page.active === 'book' ? 'ring-2 ring-accent' : '')
    .replace(/\{\{ACTIVE_HOME_MOBILE\}\}/g, page.active === 'home' ? activeMobileClass : inactiveMobileClass)
    .replace(/\{\{ACTIVE_SERVICES_MOBILE\}\}/g, page.active === 'services' ? activeMobileClass : inactiveMobileClass)
    .replace(/\{\{ACTIVE_ABOUT_MOBILE\}\}/g, page.active === 'about' ? activeMobileClass : inactiveMobileClass)
    .replace(/\{\{ACTIVE_CONTACT_MOBILE\}\}/g, page.active === 'contact' ? activeMobileClass : inactiveMobileClass);

  return rendered.trim();
}

function generateFooter(page) {
  const prefix = page.dir ? '../' : '';
  let rendered = footerTemplate.replace(/\{\{PREFIX\}\}/g, prefix);
  return rendered.trim();
}

function generateWhatsappBtn(page) {
  return whatsappTemplate.trim();
}

function syncPage(page) {
  const filePath = path.join(ROOT_DIR, page.file);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  const prefix = page.dir ? '../' : '';

  const headerContent = generateHeader(page);
  const footerContent = generateFooter(page);
  const whatsappContent = generateWhatsappBtn(page);

  // 1. Replace or inject Header
  if (content.includes('<!-- HEADER_START -->') && content.includes('<!-- HEADER_END -->')) {
    content = content.replace(/<!-- HEADER_START -->[\s\S]*?<!-- HEADER_END -->/, headerContent);
  } else {
    content = content.replace(/<header[\s\S]*?<\/header>/i, headerContent);
  }

  // 2. Replace or inject Footer
  if (content.includes('<!-- FOOTER_START -->') && content.includes('<!-- FOOTER_END -->')) {
    content = content.replace(/<!-- FOOTER_START -->[\s\S]*?<!-- FOOTER_END -->/, footerContent);
  } else {
    content = content.replace(/<footer[\s\S]*?<\/footer>/i, footerContent);
  }

  // 3. Replace or inject WhatsApp Button
  content = content.replace(/(<!-- WHATSAPP_BTN_START -->\s*)+/g, '<!-- WHATSAPP_BTN_START -->\n');
  content = content.replace(/(<!-- WHATSAPP_BTN_END -->\s*)+/g, '<!-- WHATSAPP_BTN_END -->\n');
  
  if (content.includes('<!-- WHATSAPP_BTN_START -->') && content.includes('<!-- WHATSAPP_BTN_END -->')) {
    content = content.replace(/<!-- WHATSAPP_BTN_START -->[\s\S]*?<!-- WHATSAPP_BTN_END -->/, whatsappContent);
  } else {
    content = content.replace(/<!-- WhatsApp Button -->\s*<a href="https:\/\/wa\.me\/[\s\S]*?<\/a>/i, whatsappContent);
    content = content.replace(/<a href="https:\/\/wa\.me\/27763000443[\s\S]*?<\/a>/i, whatsappContent);
  }

  // 4. Ensure components.js script tag is placed before </body>
  const scriptTag = `<script src="${prefix}js/components.js"></script>`;
  if (!content.includes('js/components.js')) {
    content = content.replace('</body>', `  ${scriptTag}\n</body>`);
  } else {
    content = content.replace(/<script src="[^"]*js\/components\.js"><\/script>/g, scriptTag);
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Synced: ${page.file}`);
}

console.log('Starting component synchronization...');
pages.forEach(syncPage);
console.log(`Successfully synchronized ${pages.length} pages!`);
