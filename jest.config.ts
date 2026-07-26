import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  clearMocks: true,
  collectCoverageFrom: [
    'src/components/ActivityHeatmap/ActivityHeatmapClient.tsx',
    'src/components/AfterMount/index.tsx',
    'src/components/ViewsWidget/ViewsWidgetClient.tsx',
    'src/components/project/ProjectCard.tsx',
    'src/components/project/ProjectList.tsx',
    'src/components/project/ProjectSection.tsx',
    'src/components/ui/postViews.tsx',
    'src/components/ui/postViewsProvider.tsx',
    'src/components/ui/relativeTime.tsx',
    'src/hooks/useHasMounted.ts',
    'src/hooks/useViews.ts',
    'src/utils/date-util.ts',
    'src/utils/github-contributions-util.ts',
    'src/utils/project-recommendation-util.ts',
    'src/utils/project-search-util.ts',
    'src/utils/project-sort-util.ts',
  ],
  coverageProvider: 'v8',
  coverageThreshold: {
    global: {
      branches: 98.44,
      functions: 97.91,
      lines: 100,
      statements: 100,
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  restoreMocks: true,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.test.ts', '<rootDir>/src/**/*.test.tsx'],
};

export default createJestConfig(config);
