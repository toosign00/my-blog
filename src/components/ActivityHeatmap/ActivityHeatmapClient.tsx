'use client';

import { useTheme } from 'next-themes';
import * as React from 'react';
import type { Activity, BlockElement } from 'react-activity-calendar';
import { ActivityCalendar } from 'react-activity-calendar';

const ACTIVITY_COLORS = [
  'var(--activity-0)',
  'var(--activity-1)',
  'var(--activity-2)',
  'var(--activity-3)',
  'var(--activity-4)',
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
      }
      if (textRef.current) {
        textRef.current.textContent = content;
      }
    },
    hide() {
      if (elRef.current) elRef.current.style.opacity = '0';
    },
  }));

  return (
    <div
      ref={elRef}
      className='fixed z-9999 pointer-events-none -translate-x-1/2 -translate-y-full'
      style={{ opacity: 0, marginTop: '-10px' }}
    >
      <div
        className='relative rounded-md px-2.5 py-1 text-[11px] font-bold shadow-lg'
        style={{ backgroundColor: 'var(--color-ink)', color: 'var(--color-canvas)' }}
      >
        <span ref={textRef} />
        <div
          className='absolute bottom-[-4px] left-1/2 h-2 w-2 -translate-x-1/2 rotate-45'
          style={{ backgroundColor: 'var(--color-ink)' }}
        />
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
    (block: BlockElement, activity: Activity) =>
      React.cloneElement(block, {
        onMouseEnter: (e: React.MouseEvent) =>
          onHover(e, `${activity.date}: ${activity.count}개 기여`),
        onMouseLeave: onLeave,
        className: 'cursor-crosshair',
      }),
    [onHover, onLeave]
  );

  return (
    <div className='space-y-3 w-full'>
      <div className='flex items-center justify-between'>
        <h3 className='section-heading'>GitHub Contributions</h3>
        <span className='text-[11px] font-mono' style={{ color: 'var(--color-gray-light)' }}>
          @toosign00
        </span>
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
      <div className='flex items-center justify-end gap-[2px] pt-1'>
        {ACTIVITY_COLORS.map((color, i) => (
          <div
            key={color}
            className='w-[6px] h-[6px] rounded-[1px]'
            style={{ backgroundColor: color }}
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
  const hasGitHub = Array.isArray(githubActivity) && githubActivity.length > 0;

  if (!mounted) return null;

  return (
    <section className='column gap-8 pt-16.25 pb-0 w-full overflow-hidden'>
      <Tooltip ref={tooltipRef} />
      {hasGitHub && (
        <GitHubHeatmap
          githubActivity={githubActivity as Activity[]}
          colorScheme={colorScheme}
          onHover={handleHover}
          onLeave={hideTooltip}
        />
      )}
    </section>
  );
};
