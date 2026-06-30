'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { PostHogProvider } from './PostHogProvider';

export const AppProviders = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <PostHogProvider>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </PostHogProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
