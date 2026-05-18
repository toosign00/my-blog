import type { Thing, WithContext } from 'schema-dts';

const JsonLd = ({ data }: { data: WithContext<Thing> }) => (
  <script
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    type='application/ld+json'
  />
);

export default JsonLd;
