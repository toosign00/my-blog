import { escapeXml, toCdata } from './xml-util';

it('escapes all XML special characters including repeated occurrences', () => {
  expect(escapeXml('<tag a="1&2">\'text\' & more</tag>')).toBe(
    '&lt;tag a=&quot;1&amp;2&quot;&gt;&apos;text&apos; &amp; more&lt;/tag&gt;'
  );
});

it.each(['', '한글 text'])('preserves plain XML text %s', (text) => {
  expect(escapeXml(text)).toBe(text);
});

it.each([
  ['', '<![CDATA[]]>'],
  ['<tag>& 한글', '<![CDATA[<tag>& 한글]]>'],
  ['a]]>b]]>c', '<![CDATA[a]]]]><![CDATA[>b]]]]><![CDATA[>c]]>'],
])('wraps %s in safe CDATA sections', (input, expected) => {
  expect(toCdata(input)).toBe(expected);
});
