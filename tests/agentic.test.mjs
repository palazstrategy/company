import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// Import the compiled/transpiled or direct logic
import { isKnownPath, getNotFoundMarkdown, getPageMarkdown } from '../src/lib/agenticMarkdown.ts';

test('1. Agent-friendly 404 markdown generation', () => {
  const probePath = '/__ora-404-probe-f5r77bfe';
  assert.equal(isKnownPath(probePath), false, 'Probe path should not be a known path');

  const notFoundMd = getNotFoundMarkdown(probePath);
  assert.ok(notFoundMd.length > 20, '404 markdown must have at least 20 characters explaining the error');
  assert.match(notFoundMd, /404 - Page Not Found/, 'Must contain 404 heading');
  assert.match(notFoundMd, /https:\/\/palazstrategy\.vercel\.app\/sitemap\.xml/, 'Must link to sitemap');
  assert.match(notFoundMd, /https:\/\/palazstrategy\.vercel\.app\/llms\.txt/, 'Must link to llms.txt');
  assert.match(notFoundMd, /https:\/\/palazstrategy\.vercel\.app\//, 'Must link to homepage');
});

test('2. Markdown content negotiation for homepage and routes', () => {
  assert.equal(isKnownPath('/'), true, 'Root path should be known');
  assert.equal(isKnownPath('/pt'), true, '/pt should be known');
  assert.equal(isKnownPath('/en'), true, '/en should be known');
  assert.equal(isKnownPath('/cases'), true, '/cases should be known');
  assert.equal(isKnownPath('/cases/fatuz'), true, '/cases/fatuz should be known');
  assert.equal(isKnownPath('/sobre'), true, '/sobre should be known');
  assert.equal(isKnownPath('/about'), true, '/about should be known');
  assert.equal(isKnownPath('/contato'), true, '/contato should be known');
  assert.equal(isKnownPath('/contact'), true, '/contact should be known');
  assert.equal(isKnownPath('/politica-de-privacidade'), true, '/politica-de-privacidade should be known');
  assert.equal(isKnownPath('/privacy'), true, '/privacy should be known');

  const homeMdPt = getPageMarkdown('/');
  assert.ok(homeMdPt.length > 100, 'Home markdown PT must be non-empty and comprehensive');
  assert.match(homeMdPt, /Palaz Strategy Company/, 'Must contain brand name');
  assert.match(homeMdPt, /Palaz Design Studio/, 'Must contain Palaz Design Studio for discoverability');
  assert.match(homeMdPt, /Quando acionar a Palaz/, 'Must contain when-to-use section');
  assert.match(homeMdPt, /llms\.txt/, 'Must link to llms.txt');

  const homeMdEn = getPageMarkdown('/en');
  assert.ok(homeMdEn.length > 100, 'Home markdown EN must be non-empty');
  assert.match(homeMdEn, /When to Use Palaz/, 'Must contain When to Use section in English');

  const casesMd = getPageMarkdown('/cases');
  assert.ok(casesMd.length > 50, 'Cases markdown must be non-empty');
  assert.match(casesMd, /NcGlass/, 'Must list cases');
});

test('3. Machine-readable llms.txt and developer resources exist', () => {
  const rootLlmsPath = path.resolve('public/llms.txt');
  const wellKnownLlmsPath = path.resolve('public/.well-known/llms.txt');
  const mcpManifestPath = path.resolve('public/.well-known/mcp');
  const openApiPath = path.resolve('public/openapi.json');

  assert.ok(fs.existsSync(rootLlmsPath), 'public/llms.txt must exist');
  assert.ok(fs.existsSync(wellKnownLlmsPath), 'public/.well-known/llms.txt must exist');
  assert.ok(fs.existsSync(mcpManifestPath), 'public/.well-known/mcp must exist');
  assert.ok(fs.existsSync(openApiPath), 'public/openapi.json must exist');

  const content = fs.readFileSync(rootLlmsPath, 'utf-8');
  assert.match(content, /# Palaz Strategy Company/, 'Must have Palaz heading');
  assert.match(content, /Palaz Design Studio/, 'Must mention Palaz Design Studio');
  assert.match(content, /## When to use Palaz/, 'Must have when to use section');
  assert.match(content, /## Developer Resources & MCP Server/, 'Must have developer resources');
  assert.match(content, /## Portfolio cases/, 'Must link portfolio cases');
  assert.match(content, /## Site structure/, 'Must provide site structure');

  const mcpContent = JSON.parse(fs.readFileSync(mcpManifestPath, 'utf-8'));
  assert.equal(mcpContent.name, 'palaz-strategy-company');
  assert.equal(mcpContent.transport.type, 'streamable-http');
  assert.ok(Array.isArray(mcpContent.tools), 'Must declare tools');
});

test('4. Trust anchor pages have > 500 characters of substantive content', () => {
  // Test contact markdown content length (>500 chars)
  const contactPt = getPageMarkdown('/contato');
  const contactEn = getPageMarkdown('/contact');
  assert.ok(contactPt.length >= 500, `Contact PT content must be at least 500 characters (got ${contactPt.length})`);
  assert.ok(contactEn.length >= 500, `Contact EN content must be at least 500 characters (got ${contactEn.length})`);
  assert.match(contactPt, /62\.808\.025\/0001-73/, 'Contact must include CNPJ');
  assert.match(contactPt, /Belo Horizonte/, 'Contact must include location');

  // Test privacy markdown content length (>500 chars)
  const privacyPt = getPageMarkdown('/politica-de-privacidade');
  const privacyEn = getPageMarkdown('/privacy');
  assert.ok(privacyPt.length >= 500, `Privacy PT content must be at least 500 characters (got ${privacyPt.length})`);
  assert.ok(privacyEn.length >= 500, `Privacy EN content must be at least 500 characters (got ${privacyEn.length})`);

  // Test about markdown content length (>500 chars)
  const aboutPt = getPageMarkdown('/sobre');
  const aboutEn = getPageMarkdown('/about');
  assert.ok(aboutPt.length >= 500, `About PT content must be at least 500 characters (got ${aboutPt.length})`);
  assert.ok(aboutEn.length >= 500, `About EN content must be at least 500 characters (got ${aboutEn.length})`);
});

test('5. Metadata completeness - og:image in page.tsx metadata', () => {
  const pageSource = fs.readFileSync(path.resolve('src/app/[locale]/page.tsx'), 'utf-8');
  assert.match(pageSource, /imagem-compartilhamento\.png/, 'page.tsx must define og:image');
  assert.match(pageSource, /Palaz Design Studio/, 'page.tsx must reference Palaz Design Studio');
});

test('6. Sitemap includes trust anchors and developer endpoints', () => {
  const sitemapSource = fs.readFileSync(path.resolve('src/app/sitemap.ts'), 'utf-8');
  assert.match(sitemapSource, /\/llms\.txt/, 'sitemap.ts must include /llms.txt');
  assert.match(sitemapSource, /\/about/, 'sitemap.ts must include /about');
  assert.match(sitemapSource, /\/contact/, 'sitemap.ts must include /contact');
  assert.match(sitemapSource, /\/privacy/, 'sitemap.ts must include /privacy');
  assert.match(sitemapSource, /\/openapi\.json/, 'sitemap.ts must include /openapi.json');
});
