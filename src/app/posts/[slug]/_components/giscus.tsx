"use client";

import { GISCUS } from "@constants/giscus.constants";
import { useTheme } from "next-themes";
import { type ComponentProps, useEffect, useRef } from "react";

type GiscusProps = ComponentProps<"section">;

export const Giscus = ({ ...props }: GiscusProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const latestThemeRef = useRef("noborder_light");
  const { resolvedTheme: appTheme } = useTheme();

  const theme = appTheme === "dark" ? "noborder_gray" : "noborder_light";

  useEffect(() => {
    const container = ref.current;
    if (!container) {
      return;
    }
    latestThemeRef.current = theme;

    const postThemeUpdate = () => {
      const iframe = container.querySelector<HTMLIFrameElement>(
        "iframe.giscus-frame",
      );
      iframe?.contentWindow?.postMessage(
        { giscus: { setConfig: { theme: latestThemeRef.current } } },
        "https://giscus.app",
      );
    };

    let script = container.querySelector<HTMLScriptElement>(
      'script[data-giscus-script="true"]',
    );

    if (!script) {
      script = document.createElement("script");
      script.async = true;
      script.setAttribute("data-giscus-script", "true");
      script.setAttribute("src", "https://giscus.app/client.js");
      script.setAttribute("data-repo", GISCUS.REPO);
      script.setAttribute("data-repo-id", GISCUS.REPO_ID);
      script.setAttribute("data-category", GISCUS.CATEGORY);
      script.setAttribute("data-category-id", GISCUS.CATEGORY_ID);
      script.setAttribute("data-mapping", GISCUS.MAPPING);
      script.setAttribute("data-strict", "0");
      script.setAttribute("data-reactions-enabled", "1");
      script.setAttribute("data-emit-metadata", "0");
      script.setAttribute("data-input-position", "bottom");
      script.setAttribute("data-theme", theme);
      script.setAttribute("data-lang", "ko");
      script.setAttribute("data-loading", "lazy");
      script.setAttribute("crossorigin", "anonymous");
      script.addEventListener("load", postThemeUpdate, { once: true });
      container.appendChild(script);
    } else {
      postThemeUpdate();
    }

    return () => {
      if (latestThemeRef.current !== theme) {
        return;
      }
      container.innerHTML = "";
    };
  }, [theme]);

  return <section ref={ref} {...props} />;
};
