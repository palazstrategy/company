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
  assert.equal(isKnownPath('/contato'), true, '/contato should be known');

  const homeMdPt = getPageMarkdown('/');
  assert.ok(homeMdPt.length > 100, 'Home markdown PT must be non-empty and comprehensive');
  assert.match(homeMdPt, /Palaz Strategy Company/, 'Must contain brand name');
  assert.match(homeMdPt, /Quando acionar a Palaz/, 'Must contain when-to-use section');
  assert.match(homeMdPt, /llms\.txt/, 'Must link to llms.txt');

  const homeMdEn = getPageMarkdown('/en');
  assert.ok(homeMdEn.length > 100, 'Home markdown EN must be non-empty');
  assert.match(homeMdEn, /When to Use Palaz/, 'Must contain When to Use section in English');

  const casesMd = getPageMarkdown('/cases');
  assert.ok(casesMd.length > 50, 'Cases markdown must be non-empty');
  assert.match(casesMd, /NcGlass/, 'Must list cases');
});

test('3. Machine-readable llms.txt exists in root and .well-known', () => {
  const rootLlmsPath = path.resolve('public/llms.txt');
  const wellKnownLlmsPath = path.resolve('public/.well-known/llms.txt');

  assert.ok(fs.existsSync(rootLlmsPath), 'public/llms.txt must exist');
  assert.ok(fs.existsSync(wellKnownLlmsPath), 'public/.well-known/llms.txt must exist');

  const content = fs.readFileSync(rootLlmsPath, 'utf-8');
  assert.match(content, /# Palaz Strategy Company/, 'Must have Palaz heading');
  assert.match(content, /## When to use Palaz/, 'Must have when to use section (Fix #5)');
  assert.match(content, /## What Palaz does/, 'Must describe services (Fix #3 & #4)');
  assert.match(content, /## Portfolio cases/, 'Must link portfolio cases');
  assert.match(content, /## Site structure/, 'Must provide site structure');
});

test('4. Sitemap includes machine-readable files', () => {
  const sitemapSource = fs.readFileSync(path.resolve('src/app/sitemap.ts'), 'utf-8');
  assert.match(sitemapSource, /\/llms\.txt/, 'sitemap.ts must include /llms.txt');
});
