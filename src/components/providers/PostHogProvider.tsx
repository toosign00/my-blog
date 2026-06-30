'use client';

import posthog from 'posthog-js';
import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { captureAnalyticsClick, sanitizeAnalyticsEvent } from '@/utils/analytics-util';

const PRODUCTION_HOSTNAME = 'toosign.me';

export const PostHogProvider = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!apiKey || window.location.hostname !== PRODUCTION_HOSTNAME) return;

    posthog.init(apiKey, {
      api_host: 'https://eu.i.posthog.com',
      ui_host: 'https://eu.posthog.com',
      autocapture: true,
      capture_pageview: 'history_change',
      capture_pageleave: true,
      capture_performance: false,
      disable_session_recording: false,
      enable_recording_console_log: false,
      ip: false,
      person_profiles: 'never',
      respect_dnt: true,
      session_recording: {
        blockSelector: '.ph-no-capture',
        maskAllInputs: true,
        maskTextSelector: '.ph-mask',
        recordBody: false,
        recordCrossOriginIframes: false,
        recordHeaders: false,
        sampleRate: 1,
      },
      before_send: sanitizeAnalyticsEvent,
    });

    const handleClick = (event: MouseEvent) => captureAnalyticsClick(event.target);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return children;
};
