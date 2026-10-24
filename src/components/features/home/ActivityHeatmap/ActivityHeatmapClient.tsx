'use client';

import { useTheme } from 'next-themes';
import * as React from 'react';
import type { Activity, BlockElement } from 'react-activity-calendar';
import { ActivityCalendar } from 'react-activity-calendar';

const ACTIVITY_COLORS = [
  'var(--heatmap-0)',
  'var(--heatmap-1)',
  'var(--heatmap-2)',
  'var(--heatmap-3)',
  'var(--heatmap-4)',
];

const ACTIVITY_LEVEL_CLASS = [
  'bg-heatmap-0',
  'bg-heatmap-1',
  'bg-heatmap-2',
  'bg-heatmap-3',
  'bg-heatmap-4',
];

const CALENDAR_THEME = {
  light: ACTIVITY_COLORS,
  dark: ACTIVITY_COLORS,
};

interface TooltipHandle {
  show: (x: number, y: number, content: string) => void;
  hide: () => void;
}

const Tooltip = React.forwardRef<TooltipHandle>((_, ref) => {
  const elRef = React.useRef<HTMLDivElement>(null);
  const textRef = React.useRef<HTMLSpanElement>(null);

  React.useImperativeHandle(ref, () => ({
    show(x, y, content) {
      if (elRef.current) {
        elRef.current.style.left = `${x}px`;
        elRef.current.style.top = `${y}px`;
        elRef.current.style.opacity = '1';
        elRef.current.setAttribute('aria-hidden', 'false');
      }
      if (textRef.current) {
        textRef.current.textContent = content;
      }
    },
    hide() {
      if (elRef.current) {
        elRef.current.style.opacity = '0';
        elRef.current.setAttribute('aria-hidden', 'true');
      }
    },
  }));

  return (
    <div
      ref={elRef}
      aria-hidden='true'
      className='pointer-events-none fixed z-tooltip -mt-2.5 -translate-x-1/2 -translate-y-full opacity-0'
      role='tooltip'
    >
      <div className='relative rounded-md bg-inverse px-2.5 py-1 font-bold text-inverse text-micro shadow-popover'>
        <span ref={textRef} />
        <div className='absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-inverse' />
      </div>
    </div>
  );
});
Tooltip.displayName = 'Tooltip';

const GitHubHeatmap = React.memo(function GitHubHeatmap({
  githubActivity,
  colorScheme,
  onHover,
  onLeave,
}: {
  githubActivity: Activity[];
  colorScheme: 'light' | 'dark';
  onHover: (e: React.MouseEvent, content: string) => void;
  onLeave: () => void;
}) {
  const renderBlock = React.useCallback(
    (block: BlockElement, activity: Activity) => {
      const content = `${activity.date}: ${activity.count}개 기여`;
      return React.cloneElement(block, {
        'aria-label': content,
        onMouseEnter: (e: React.MouseEvent) => onHover(e, content),
        onMouseLeave: onLeave,
        className: 'cursor-crosshair',
        role: 'img',
      });
    },
    [onHover, onLeave]
  );

  return (
    <div className='space-y-3 w-full'>
      <div className='flex items-center justify-between'>
        <h2 className='section-heading' id='github-contributions-heading'>
          GitHub Contributions
        </h2>
        <span className='font-mono text-micro text-muted'>@toosign00</span>
      </div>
      <div className='github-heatmap-wrapper w-full'>
        <ActivityCalendar
          data={githubActivity}
          theme={CALENDAR_THEME}
          colorScheme={colorScheme}
          blockSize={16.5}
          blockMargin={2}
          fontSize={12}
          showColorLegend={false}
          showTotalCount={false}
          renderBlock={renderBlock}
        />
      </div>
      <div className='flex items-center justify-end gap-0.5 pt-1'>
        {ACTIVITY_LEVEL_CLASS.map((levelClass, i) => (
          <div
            key={levelClass}
            className={`h-1.5 w-1.5 rounded-none ${levelClass}`}
            aria-label={`활동 강도 ${i}`}
            role='img'
          />
        ))}
      </div>
    </div>
  );
});

export const ActivityHeatmapClient = ({
  githubActivity,
}: {
  githubActivity: Activity[] | null;
}) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const tooltipRef = React.useRef<TooltipHandle>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleHover = React.useCallback((e: React.MouseEvent, content: string) => {
    tooltipRef.current?.show(e.clientX, e.clientY, content);
  }, []);

  const hideTooltip = React.useCallback(() => {
    tooltipRef.current?.hide();
  }, []);

  const colorScheme = resolvedTheme === 'dark' ? 'dark' : 'light';
  if (!mounted || !githubActivity?.length) return null;

  return (
    <section
      aria-labelledby='github-contributions-heading'
      className='column w-full gap-8 overflow-hidden pt-16 pb-0'
    >
      <Tooltip ref={tooltipRef} />
      <GitHubHeatmap
        githubActivity={githubActivity}
        colorScheme={colorScheme}
        onHover={handleHover}
        onLeave={hideTooltip}
      />
    </section>
  );
};
