import { ROUTES } from "@constants/menu.constants";
import { generatePageMetadata } from "@utils/metadata-util";
import { getAllPosts } from "@utils/post-util";
import { slugify } from "@utils/text-util";
import type { Metadata } from "next";
import Link from "next/link";

const CategoryListPage = async () => {
  const allPosts = await getAllPosts();
  const categories = [...new Set(allPosts.map((post) => post.category))];
  const categoryCounts = categories.reduce(
    (acc, category) => {
      acc[category] = allPosts.filter(
        (post) => post.category === category,
      ).length;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <>
      <header className="mx-auto mb-9 text-center">
        <h1 className="post-title mb-3 text-gray-accent">Categories</h1>
        <p className="font-medium text-gray-mid text-sm">
          Explore all categories.
        </p>
      </header>

      <section className="mx-auto mb-9">
        <nav aria-label="Category list">
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 p-0">
            {categories.map((category) => (
              <li
                className="rounded-sm border border-background03 bg-background02 transition-colors duration-150 hover:bg-background04"
                key={category}
              >
                <Link
                  aria-label={`${category} category (${categoryCounts[category]} posts)`}
                  className="row-between gap-4 px-5 py-2.5 no-underline"
                  href={`${ROUTES.CATEGORIES}/${slugify(category)}`}
                >
                  <span className="font-medium text-sm">{category}</span>
                  <span className="text-gray-mid text-xs">
                    ({categoryCounts[category]})
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>
    </>
  );
};

export default CategoryListPage;

export const generateMetadata = async (): Promise<Metadata> => {
  return generatePageMetadata({ title: "Categories", path: ROUTES.CATEGORIES });
};
