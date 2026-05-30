'use client';

import dayjs from 'dayjs';
import { ChevronDown } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import type { Project } from '@/types/project.types';
import { ProjectList } from './ProjectList';

type ProjectSectionProps = {
  projects: Project[];
  initialTag?: string;
  initialSort?: string;
  initialQuery?: string;
};

type SortOption = 'recommended' | 'newest' | 'alphabetical';

const SEARCH_SYNC_DELAY_MS = 300;

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: '추천순', value: 'recommended' },
  { label: '최신순', value: 'newest' },
  { label: '가나다순', value: 'alphabetical' },
];

const isSortOption = (value: string | null): value is SortOption => {
  return value === 'recommended' || value === 'newest' || value === 'alphabetical';
};

const normalizeTag = (value: string | undefined, allTags: string[]) => {
  if (!value || value === 'All') return 'All';
  return allTags.includes(value) ? value : 'All';
};

const normalizeSortOption = (value: string | undefined): SortOption => {
  if (isSortOption(value ?? null)) {
    return value as SortOption;
  }

  return 'recommended';
};

const compareByNewest = (a: Project, b: Project) => {
  const createdAtDiff = dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf();
  if (createdAtDiff !== 0) return createdAtDiff;

  const titleDiff = a.title.localeCompare(b.title);
  if (titleDiff !== 0) return titleDiff;

  return a.slug.localeCompare(b.slug);
};

const sortProjects = (projects: Project[], sortOption: SortOption): Project[] => {
  return [...projects].sort((a, b) => {
    if (sortOption === 'recommended') {
      if (a.order !== undefined && b.order !== undefined) {
        const orderDiff = a.order - b.order;
        if (orderDiff !== 0) return orderDiff;
      }
      if (a.order !== undefined) return -1;
      if (b.order !== undefined) return 1;
      return compareByNewest(a, b);
    }

    if (sortOption === 'newest') {
      return compareByNewest(a, b);
    }

    const titleDiff = a.title.localeCompare(b.title);
    if (titleDiff !== 0) return titleDiff;

    return a.slug.localeCompare(b.slug);
  });
};

export const ProjectSection = ({
  projects,
  initialTag,
  initialSort,
  initialQuery,
}: ProjectSectionProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const allTags = useMemo(
    () => ['All', ...Array.from(new Set(projects.flatMap((project) => project.tags)))],
    [projects]
  );

  const [selectedTag, setSelectedTag] = useState(() => normalizeTag(initialTag, allTags));
  const [searchQuery, setSearchQuery] = useState(() => initialQuery ?? '');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(() => initialQuery ?? '');
  const [sortOption, setSortOption] = useState<SortOption>(() => normalizeSortOption(initialSort));

  useEffect(() => {
    const urlTag = normalizeTag(searchParams.get('tag') ?? undefined, allTags);
    const urlSort = normalizeSortOption(searchParams.get('sort') ?? undefined);
    const urlQuery = searchParams.get('q') ?? '';

    setSelectedTag((current) => (current === urlTag ? current : urlTag));
    setSortOption((current) => (current === urlSort ? current : urlSort));
    setSearchQuery((current) => (current === urlQuery ? current : urlQuery));
    setDebouncedSearchQuery((current) => (current === urlQuery ? current : urlQuery));
  }, [allTags, searchParams]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, SEARCH_SYNC_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedTag === 'All') {
      params.delete('tag');
    } else {
      params.set('tag', selectedTag);
    }

    if (sortOption === 'recommended') {
      params.delete('sort');
    } else {
      params.set('sort', sortOption);
    }

    if (debouncedSearchQuery.length === 0) {
      params.delete('q');
    } else {
      params.set('q', debouncedSearchQuery);
    }

    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    const currentUrl = searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    if (nextUrl !== currentUrl) {
      router.replace(nextUrl, { scroll: false });
    }
  }, [debouncedSearchQuery, pathname, router, searchParams, selectedTag, sortOption]);

  const filteredProjects = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim().toLowerCase();

    const filtered = projects.filter((project) => {
      const matchesTag = selectedTag === 'All' || project.tags.includes(selectedTag);
      const matchesSearch =
        normalizedSearchQuery.length === 0 ||
        project.title.toLowerCase().includes(normalizedSearchQuery) ||
        project.description.toLowerCase().includes(normalizedSearchQuery);

      return matchesTag && matchesSearch;
    });

    return sortProjects(filtered, sortOption);
  }, [projects, searchQuery, selectedTag, sortOption]);

  return (
    <section className='flex flex-col gap-8'>
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-wrap gap-2'>
            {allTags.map((tag) => {
              const isSelected = selectedTag === tag;

              return (
                <button
                  aria-pressed={isSelected}
                  className={twMerge(
                    'cursor-pointer rounded-full px-4 py-2 font-medium text-sm transition-colors',
                    isSelected
                      ? 'bg-gray-bold text-background'
                      : 'bg-background05 text-gray-mid hover:bg-gray-hover'
                  )}
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  type='button'
                >
                  {tag}
                </button>
              );
            })}
          </div>

          <div className='flex w-full gap-2'>
            <div className='relative shrink-0'>
              <select
                className='appearance-none rounded-xl border border-border bg-background py-2 pr-10 pl-4 text-gray-bold text-sm outline-none transition-colors focus:border-gray-mid'
                aria-label='Project sort'
                onChange={(event) => setSortOption(event.target.value as SortOption)}
                value={sortOption}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden
                className='pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-mid'
                size={16}
              />
            </div>

            <input
              aria-label='Project search'
              className='min-w-0 flex-1 rounded-xl border border-border bg-background px-4 py-2 text-gray-bold text-sm outline-none transition-colors placeholder:text-gray-light focus:border-gray-mid'
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder='Search projects...'
              type='search'
              value={searchQuery}
            />
          </div>
        </div>
      </div>

      {filteredProjects.length > 0 ? (
        <ProjectList projects={filteredProjects} />
      ) : (
        <p className='py-4 text-center text-gray-mid text-sm'>표시할 프로젝트가 없습니다.</p>
      )}
    </section>
  );
};
