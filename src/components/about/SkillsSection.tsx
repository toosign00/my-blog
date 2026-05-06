import type { ComponentType } from 'react';
import { SkillBadge } from '@/components/about/SkillBadge';
import { ChatGPTIcon } from '@/components/icons/ChatGPTIcon';
import { ChromeIcon } from '@/components/icons/ChromeIcon';
import { ClaudeIcon } from '@/components/icons/ClaudeIcon';
import { ConfluenceIcon } from '@/components/icons/ConfluenceIcon';
import { FigmaIcon } from '@/components/icons/FigmaIcon';
import { GeminiIcon } from '@/components/icons/GeminiIcon';
import { GithubIcon } from '@/components/icons/GithubIcon';
import { GitIcon } from '@/components/icons/GitIcon';
import { GoogleSheetsIcon } from '@/components/icons/GoogleSheetsIcon';
import { JavaScriptIcon } from '@/components/icons/JavaScriptIcon';
import { JiraIcon } from '@/components/icons/JiraIcon';
import { MySQLIcon } from '@/components/icons/MySQLIcon';
import { NotionIcon } from '@/components/icons/NotionIcon';
import { PlaywrightIcon } from '@/components/icons/PlaywrightIcon';
import { PostmanIcon } from '@/components/icons/PostmanIcon';
import { PythonIcon } from '@/components/icons/PythonIcon';
import { SlackIcon } from '@/components/icons/SlackIcon';
import { TypeScriptIcon } from '@/components/icons/TypeScriptIcon';
import { ABOUT } from '@/constants/about.constants';
import type { IconProps } from '@/types/icon.types';

const ICON_MAP: Record<string, ComponentType<IconProps>> = {
  chrome: ChromeIcon,
  chatgpt: ChatGPTIcon,
  claude: ClaudeIcon,
  gemini: GeminiIcon,
  playwright: PlaywrightIcon,
  postman: PostmanIcon,
  jira: JiraIcon,
  confluence: ConfluenceIcon,
  typescript: TypeScriptIcon,
  javascript: JavaScriptIcon,
  python: PythonIcon,
  mysql: MySQLIcon,
  slack: SlackIcon,
  notion: NotionIcon,
  git: GitIcon,
  github: GithubIcon,
  figma: FigmaIcon,
  googlesheets: GoogleSheetsIcon,
};

export const SkillsSection = () => {
  return (
    <section className='column gap-6'>
      <h3 className='section-heading'>Tools & Skills</h3>
      <div className='column gap-6'>
        {ABOUT.skills.map((group) => (
          <div key={group.category} className='column gap-3'>
            <span className='text-sm font-medium text-gray-mid'>{group.category}</span>
            <div className='flex flex-wrap gap-2'>
              {group.items.map((item) => {
                if ('grouped' in item) {
                  return (
                    <SkillBadge
                      key={item.label}
                      icon={item.icons.map((iconKey) => {
                        const Icon = ICON_MAP[iconKey];
                        return Icon ? <Icon key={iconKey} size={20} /> : null;
                      })}
                      label={item.label}
                    />
                  );
                }
                const Icon = ICON_MAP[item.icon];
                if (!Icon) return null;
                return <SkillBadge key={item.label} icon={<Icon size={20} />} label={item.label} />;
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
