import { escapeXml, toCdata } from './xml-util';

describe('escapeXml', () => {
  it('escapes every XML special character', () => {
    expect(escapeXml(`&<>"'`)).toBe('&amp;&lt;&gt;&quot;&apos;');
  });

  it('escapes the ampersand of an already escaped entity only once', () => {
    expect(escapeXml('&amp;')).toBe('&amp;amp;');
  });

  it('leaves text without special characters unchanged', () => {
    expect(escapeXml('https://example.com/posts/hello')).toBe('https://example.com/posts/hello');
  });
});

describe('toCdata', () => {
  it('wraps plain text in a CDATA section', () => {
    expect(toCdata('hello')).toBe('<![CDATA[hello]]>');
  });

  it('splits a CDATA terminator so the section stays valid', () => {
    expect(toCdata('a]]>b')).toBe('<![CDATA[a]]]]><![CDATA[>b]]>');
  });

  it('splits every CDATA terminator in the value', () => {
    expect(toCdata(']]>]]>')).toBe('<![CDATA[]]]]><![CDATA[>]]]]><![CDATA[>]]>');
  });
});
