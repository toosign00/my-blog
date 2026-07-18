# Sitemap Last-Modified Design

## Goal

Make each sitemap `<lastmod>` represent the most recent meaningful change to that URL instead of assigning one site-wide content date to unrelated pages.

The sitemap remains statically generated and is refreshed by a deployment.

## Date ownership

### Post detail pages

Each post owns its modification date through the existing required `modifiedAt` field in `post.mdx`. A meaningful change to the post title, subtitle, taxonomy, cover, or body requires updating this field.

The sitemap uses `modifiedAt`, falling back to `createdAt` only as a defensive type-level behavior.

### Project detail pages

Each project gains a required `modifiedAt` metadata field. `projectDue` continues to describe the project period and is no longer treated as a page modification date.

Existing projects receive a one-time, manually reviewed initial value based on the latest meaningful content commit available in Git history. Future meaningful changes require updating `modifiedAt`.

### Independent static pages

A small central constant maps independently maintained routes to explicit modification dates:

- Home
- About
- Security Policy
- Acknowledgments

The initial values are based on the latest meaningful content commits available in Git history. Future content changes to one of these pages or its content dependencies require updating only that route's date.

## Derived page dates

Generated pages calculate their dates from only the content that can affect them:

- Home: the latest modification date among the posts displayed in Latest Updates, combined with an explicit home-page date for independently maintained home content.
- Posts index and its pagination: the latest post modification date. A new or changed post can alter pagination, so all post-list pages share this date.
- Categories index: the latest post modification date because category membership comes from post metadata.
- Category detail and pagination: the latest modification date among posts in that category.
- Tags index: the latest post modification date because tag membership comes from post metadata.
- Tag detail and pagination: the latest modification date among posts carrying that tag.
- Projects index: the latest project modification date.

The derived date helper returns `undefined` for an empty collection, in which case the sitemap omits `<lastmod>` rather than inventing a date.

## Data flow

At deployment, the static sitemap route loads all posts and projects. It validates their metadata, groups posts by category and tag, calculates the relevant latest date for each URL family, and serializes valid dates as ISO 8601 strings.

The route remains `force-static` with `revalidate = false`; production changes appear after the next deployment.

## Validation and failure behavior

- Post and project metadata validation rejects missing or invalid required modification dates.
- Static route dates are typed and validated by the same date utility used for content metadata where practical.
- Invalid dates fail during development, tests, or deployment instead of emitting misleading sitemap values.

## Tests

Add focused tests for date selection:

- Post detail uses its own `modifiedAt`.
- Project detail uses `modifiedAt`, not `projectDue`.
- Static pages use their route-specific dates.
- Category and tag pages ignore unrelated post changes.
- Post pagination changes with the latest post date.
- Empty collections omit `<lastmod>`.
- XML output emits ISO 8601 timestamps.

Do not run a repository build. Verification uses the relevant unit tests, type checking, linting if scoped execution is available, and `git diff --check`.

## Maintenance rule

Dates are updated only for meaningful user-visible content changes. Formatting-only edits, refactors, dependency updates, and implementation changes that do not materially change page content do not advance `<lastmod>`.
