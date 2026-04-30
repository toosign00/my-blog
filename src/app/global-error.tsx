"use client";

interface GlobalErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalErrorPage({
  error,
  reset,
}: GlobalErrorPageProps) {
  return (
    <html lang="ko">
      <body className="global-error-body">
        <style>{`
          :root {
            --ge-bg: #fcfcfd;
            --ge-title: #393960;
            --ge-heading: #393960;
            --ge-text: #6b6b87;
            --ge-border: #f4f4f8;
            --ge-button-bg: #ffffff;
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --ge-bg: #0f0f0f;
              --ge-title: #ffffff;
              --ge-heading: #dddddd;
              --ge-text: #b2b2b2;
              --ge-border: #1b1b1b;
              --ge-button-bg: #010101;
            }
          }
          .global-error-body {
            min-height: 100dvh;
            margin: 0;
            padding: 0 1.5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: var(--ge-bg);
            font-family:
              var(--font-pretendard), -apple-system, BlinkMacSystemFont, system-ui,
              Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo",
              "Noto Sans KR", "Malgun Gothic", sans-serif;
          }
          .global-error-wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            padding: 3rem 0;
          }
          .global-error-title {
            margin: 0;
            font-size: clamp(6.4rem, 12vw, 8.8rem);
            line-height: 1;
            font-weight: 600;
            letter-spacing: -0.03em;
            color: var(--ge-title);
          }
          .global-error-heading {
            margin: 0;
            font-size: 0.9375rem;
            line-height: 1.2;
            font-weight: 500;
            color: var(--ge-heading);
          }
          .global-error-description {
            margin: 0;
            font-size: 0.8125rem;
            line-height: 1.5;
            font-weight: 500;
            color: var(--ge-text);
            text-align: center;
          }
          .global-error-actions {
            display: flex;
            gap: 0.5rem;
            padding-top: 0.5rem;
          }
          .global-error-button {
            min-width: 5rem;
            height: 2.5rem;
            padding: 0 0.75rem;
            border: 1px solid var(--ge-border);
            border-radius: 0.625rem;
            background-color: var(--ge-button-bg);
            color: var(--ge-heading);
            text-decoration: none;
            font-size: 0.8125rem;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }
        `}</style>
        <section className="global-error-wrap">
          <p className="global-error-title">Error</p>
          <h1 className="global-error-heading">문제가 발생했어요</h1>
          <p className="global-error-description">
            잠시 후 다시 시도하거나 홈으로 이동해 주세요.
          </p>

          <div className="global-error-actions">
            <button
              className="global-error-button"
              onClick={reset}
              type="button"
            >
              Retry
            </button>
            <a className="global-error-button" href="/">
              Home
            </a>
          </div>
        </section>
        <span aria-hidden className="sr-only">
          {error.digest}
        </span>
      </body>
    </html>
  );
}
