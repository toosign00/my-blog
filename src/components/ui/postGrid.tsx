import Image from "next/image";
import Link from "next/link";
import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { POST_CARD_INTERACTION_CLASS } from "@/constants/style.constants";
import type { Post } from "@/types/content.types";

import { RelativeTime } from "./relativeTime";

type PostGridProps = ComponentProps<"div"> & {
  className?: string;
  posts: Post[];
};

export const PostGrid = ({ posts, className, ...props }: PostGridProps) => {
  return (
    <div
      className={twMerge(
        "grid w-full grid-cols-1 tablet:grid-cols-2 gap-16",
        className,
      )}
      {...props}
    >
      {posts.map(({ _id, slug, title, coverImage, createdAt }) => {
        return (
          <Link
            aria-label={`Read post: ${title}`}
            className={twMerge(
              "flex w-full cursor-pointer flex-col",
              POST_CARD_INTERACTION_CLASS,
            )}
            href={`/posts/${slug}`}
            key={_id}
          >
            <div className="relative aspect-[1.8/1] w-full overflow-hidden rounded-lg border border-border">
              <Image
                alt={title}
                className="h-full w-full object-cover object-center"
                draggable={false}
                fill
                priority={false}
                quality={100}
                sizes="(max-width: 60rem) 100vw, (max-width: 80rem) calc(50vw - 9rem), 22rem"
                src={coverImage}
              />
            </div>

            <h2 className="title post-subtitle -mx-2.5 mt-4 -mb-0.5 line-clamp-2 flex overflow-hidden text-ellipsis rounded-sm px-2.5 py-0.5 transition-colors duration-250 ease-in-out">
              {title}
            </h2>

            <RelativeTime
              className="description h4 -mx-2.5 mt-4 -mb-0.5 w-fit rounded-sm px-2.5 py-0.5 text-gray-light transition-colors duration-250 ease-in-out"
              time={createdAt}
            />
          </Link>
        );
      })}
    </div>
  );
};
