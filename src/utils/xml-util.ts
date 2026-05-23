export const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const toCdata = (value: string): string =>
  `<![CDATA[${value.replaceAll(']]>', ']]]]><![CDATA[>')}]]>`;
