import Image from 'next/image';

import { Code, Pre } from './code';
import { Badge, Card, CardGrid, Highlight, Table } from './dataDisplay';
import { Alert, Step, Steps } from './flow';
import { Accordion, AccordionItem, Tab, Tabs } from './interactive';
import { Img } from './media';
import { A, Blockquote, H1, H2, H3, H4, HR, LI, OL, P, Strong, UL } from './typography';

export const components = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  ul: UL,
  ol: OL,
  li: LI,
  a: A,
  strong: Strong,
  p: P,
  blockquote: Blockquote,
  pre: Pre,
  code: Code,
  img: Img,
  hr: HR,
  Alert,
  Steps,
  Step,
  Table,
  Highlight,
  Badge,
  Card,
  CardGrid,
  Tabs,
  Tab,
  Accordion,
  AccordionItem,
  Image,
};
