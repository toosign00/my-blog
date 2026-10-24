#!/usr/bin/env node
/**
 * Design token guard.
 * Fails when styling bypasses the design system tokens defined in src/styles/tokens/.
 * Rules and the reasoning behind each exception are documented in DESIGN.md.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { __unstable__loadDesignSystem } from '@tailwindcss/node';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STYLES_DIR = path.join(ROOT, 'src/styles');
const TOKENS_DIR = path.join(STYLES_DIR, 'tokens');

/** Files skipped entirely. Brand icons keep their official brand colors. */
const IGNORED_PATHS = ['src/components/icons/'];

/** Plain marker classes used as selectors, not as Tailwind utilities. */
const MARKER_CLASSES = new Set([
  'group',
  'title',
  'subtitle',
  'description',
  'hoverable-surface',
  'shiki',
  'css-variables',
  'github-heatmap-wrapper',
]);

/** `style={{ ... }}` is allowed only for values computed at runtime. */
const INLINE_STYLE_ALLOWLIST = {
  'src/components/ui/lazyImage.tsx': 'aspect ratio comes from the image dimensions',
};

/** Tailwind numeric spacing steps allowed (multiples of --spacing). */
export const SPACING_STEPS = new Set([
  '0',
  '0.5',
  '1',
  '1.5',
  '2',
  '2.5',
  '3',
  '3.5',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '14',
  '16',
  '20',
  '24',
  '28',
  '32',
  '36',
  '40',
  '44',
  '48',
]);

const SPACING_UTILITY =
  /^-?(?:p[xytrblse]?|m[xytrblse]?|gap(?:-[xy])?|space-[xy]|top|left|right|bottom|start|end|inset(?:-[xy])?|w|h|size|min-w|min-h|max-w|max-h|translate-[xy]|basis|scroll-[mp][xytrblse]?)-(\d+(?:\.\d+)?)$/;
const NUMERIC_UTILITY =
  /^-?(duration|delay|z|scale(?:-[xy])?|opacity|rotate|order|leading|blur|brightness)-(\d+(?:\.\d+)?)$/;
const ALLOWED_NUMERIC = { opacity: new Set(['0', '100']), rotate: new Set(['45', '180']) };
const RAW_COLOR = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|hwb|lab|lch)\(/gi;
const CSS_LENGTH = /(?<![\w-])-?\d*\.?\d+(?:px|rem|em|ms|s)\b/g;

const rel = (file) => path.relative(ROOT, file).split(path.sep).join('/');

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });

const lineOf = (text, index) => text.slice(0, index).split('\n').length;

/** Reads a balanced (...) or {...} expression starting at `start`. */
const readBalanced = (text, start) => {
  const open = text[start];
  const close = open === '(' ? ')' : '}';
  let depth = 0;
  let quote = null;
  for (let i = start; i < text.length; i += 1) {
    const ch = text[i];
    if (quote) {
      if (ch === '\\') i += 1;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') quote = ch;
    else if (ch === open) depth += 1;
    else if (ch === close) {
      depth -= 1;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return text.slice(start);
};

/** Static string literal parts inside an expression (template `${}` holes removed). */
const stringLiterals = (expr, offset) => {
  const found = [];
  const re = /'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g;
  for (const match of expr.matchAll(re)) {
    const value = (match[1] ?? match[2] ?? match[3]).replace(/\$\{[^}]*\}/g, ' ');
    found.push({ value, index: offset + match.index });
  }
  return found;
};

/** Every string that is used as a className: JSX attributes, twMerge() calls and *_CLASS constants. */
export const extractClassStrings = (text) => {
  const strings = [];
  for (const match of text.matchAll(/className=(?=['"{])/g)) {
    const start = match.index + match[0].length;
    const expr =
      text[start] === '{' ? readBalanced(text, start) : text.slice(start).match(/^(['"]).*?\1/s)[0];
    strings.push(...stringLiterals(expr, start));
  }
  for (const match of text.matchAll(/\btwMerge\(/g)) {
    const start = match.index + match[0].length - 1;
    strings.push(...stringLiterals(readBalanced(text, start), start));
  }
  for (const match of text.matchAll(
    /\b(?:const|let)\s+\w*(?:CLASS|Class|ClassName)\w*\s*(?::[^=]+)?=\s*/g
  )) {
    const start = match.index + match[0].length;
    const expr =
      text[start] === '{' ? readBalanced(text, start) : text.slice(start).split(/;\n/)[0];
    strings.push(...stringLiterals(expr, start));
  }
  return strings;
};

const classTokens = (strings) =>
  strings.flatMap(({ value, index }) =>
    value
      .split(/\s+/)
      .filter((token) => token && !token.includes('://'))
      .map((token) => ({ token, index }))
  );

/** Utility part of a candidate, without variants such as `hover:` or `[&_p]:`. */
const utilityOf = (candidate) => {
  let depth = 0;
  let last = 0;
  for (let i = 0; i < candidate.length; i += 1) {
    if (candidate[i] === '[') depth += 1;
    else if (candidate[i] === ']') depth -= 1;
    else if (candidate[i] === ':' && depth === 0) last = i + 1;
  }
  return candidate.slice(last).replace(/^!/, '');
};

export const checkCandidate = (candidate) => {
  const utility = utilityOf(candidate);
  if (/\[.*\]|\(--/.test(utility)) {
    return `arbitrary value "${candidate}": add a token to src/styles/tokens/ or a utility to utilities.css`;
  }
  const spacing = utility.match(SPACING_UTILITY);
  if (spacing && !SPACING_STEPS.has(spacing[1])) {
    return `off-scale spacing "${candidate}": use one of ${[...SPACING_STEPS].join(', ')}`;
  }
  const numeric = utility.match(NUMERIC_UTILITY);
  if (numeric && !ALLOWED_NUMERIC[numeric[1]]?.has(numeric[2])) {
    return `raw numeric utility "${candidate}": use the named token utility (duration-fast, z-header, hover-fade, ...)`;
  }
  return null;
};

const stripMdxCode = (text) =>
  text.replace(/```[\s\S]*?```|`[^`\n]*`/g, (block) => block.replace(/[^\n]/g, ' '));

const checkSourceFile = (file, text, designSystem, report) => {
  const source = file.endsWith('.mdx') ? stripMdxCode(text) : text;
  const tokens = classTokens(extractClassStrings(source));

  for (const { token, index } of tokens) {
    const problem = checkCandidate(token);
    if (problem) report(file, lineOf(source, index), problem);
  }

  const unknown = tokens.filter(({ token }) => !MARKER_CLASSES.has(token));
  const css = designSystem.candidatesToCss(unknown.map(({ token }) => token));
  unknown.forEach(({ token, index }, i) => {
    if (css[i] === null && !checkCandidate(token)) {
      report(
        file,
        lineOf(source, index),
        `unknown class "${token}": it generates no CSS (not a design token)`
      );
    }
  });

  for (const match of source.matchAll(RAW_COLOR)) {
    report(
      file,
      lineOf(source, match.index),
      `raw color "${match[0]}": use a semantic color token`
    );
  }

  if (!INLINE_STYLE_ALLOWLIST[rel(file)]) {
    for (const match of source.matchAll(/style=\{\{/g)) {
      report(file, lineOf(source, match.index), 'inline style object: use token utilities instead');
    }
  }

  for (const match of source.matchAll(/\bsize=\{(\d+)\}/g)) {
    report(
      file,
      lineOf(source, match.index),
      `raw icon size ${match[1]}: use ICON_SIZE from styles/tokens/icon`
    );
  }
};

const checkCssFile = (file, text, report) => {
  const cleaned = text
    .replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '))
    .replace(/url\([^)]*\)/g, (c) => c.replace(/[^\n]/g, ' '))
    .replace(/--spacing\([^)]*\)/g, (c) => c.replace(/[^\n]/g, ' '));

  for (const match of cleaned.matchAll(RAW_COLOR)) {
    report(
      file,
      lineOf(cleaned, match.index),
      `raw color "${match[0]}": use a semantic color token`
    );
  }
  for (const match of cleaned.matchAll(CSS_LENGTH)) {
    if (/^-?0?\.?0+[a-z]+$/.test(match[0])) continue;
    report(
      file,
      lineOf(cleaned, match.index),
      `raw length/time "${match[0]}": use a token or --spacing()`
    );
  }
};

export const run = async () => {
  const problems = [];
  const report = (file, line, message) => problems.push(`${rel(file)}:${line}  ${message}`);

  const css = fs.readFileSync(path.join(STYLES_DIR, 'globals.css'), 'utf8');
  const designSystem = await __unstable__loadDesignSystem(css, { base: STYLES_DIR });

  const files = [...walk(path.join(ROOT, 'src')), path.join(ROOT, 'mdx-components.tsx')].filter(
    (file) =>
      /\.(tsx?|mdx|css)$/.test(file) &&
      !/\.test\.tsx?$/.test(file) &&
      !file.startsWith(TOKENS_DIR) &&
      !IGNORED_PATHS.some((ignored) => rel(file).startsWith(ignored))
  );

  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    if (file.endsWith('.css')) checkCssFile(file, text, report);
    else checkSourceFile(file, text, designSystem, report);
  }

  return problems;
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const problems = await run();
  if (problems.length > 0) {
    console.error(problems.join('\n'));
    console.error(`\n✖ ${problems.length} design token violation(s). See DESIGN.md.`);
    process.exit(1);
  }
  console.log('✔ No design token violations.');
}
