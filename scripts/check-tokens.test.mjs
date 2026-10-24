import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { checkCandidate, extractClassStrings } from './check-tokens.mjs';

describe('checkCandidate', () => {
  it('rejects arbitrary values and arbitrary CSS variable shorthands', () => {
    assert.match(checkCandidate('p-[13px]'), /arbitrary value/);
    assert.match(checkCandidate('hover:bg-[#fff]'), /arbitrary value/);
    assert.match(checkCandidate('z-(--z-header)'), /arbitrary value/);
  });

  it('accepts arbitrary variants whose utility is a token', () => {
    assert.equal(checkCandidate('[&_p]:mt-2'), null);
    assert.equal(checkCandidate('hover:[&_.title]:bg-muted'), null);
  });

  it('rejects spacing steps outside the allowed scale', () => {
    assert.match(checkCandidate('pt-4.25'), /off-scale spacing/);
    assert.match(checkCandidate('tablet:-mx-2.25'), /off-scale spacing/);
  });

  it('accepts spacing steps on the scale, fractions and named lengths', () => {
    for (const candidate of ['p-4', '-mb-0.5', 'gap-3.5', 'w-1/2', 'max-w-app', 'top-header']) {
      assert.equal(checkCandidate(candidate), null, candidate);
    }
  });

  it('rejects raw numeric motion, layer and opacity utilities', () => {
    assert.match(checkCandidate('duration-200'), /raw numeric utility/);
    assert.match(checkCandidate('z-10'), /raw numeric utility/);
    assert.match(checkCandidate('hover:opacity-70'), /raw numeric utility/);
  });

  it('accepts the named token utilities and fully on/off opacity', () => {
    for (const candidate of [
      'duration-fast',
      'z-header',
      'hover-fade',
      'opacity-0',
      'opacity-100',
    ]) {
      assert.equal(checkCandidate(candidate), null, candidate);
    }
  });
});

describe('extractClassStrings', () => {
  const values = (source) =>
    extractClassStrings(source)
      .map(({ value }) => value.trim())
      .sort();

  it('reads className attributes including conditional and template expressions', () => {
    const source = `<a className={open ? 'p-2 text-primary' : \`p-4 \${extra}\`} aria-label='Go back'>`;
    assert.deepEqual(values(source), ['p-2 text-primary', 'p-4']);
  });

  it('reads twMerge calls and *_CLASS constants but not unrelated strings', () => {
    const source = [
      "const BUTTON_CLASS = 'ui-button h-10';",
      "const label = 'Copy link';",
      "twMerge('flex gap-2', className);",
    ].join('\n');
    assert.deepEqual(values(source), ['flex gap-2', 'ui-button h-10']);
  });
});
