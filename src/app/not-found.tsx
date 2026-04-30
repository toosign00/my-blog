import { ROUTES } from "@constants/menu.constants";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <section className="column-center min-h-[calc(100dvh-14rem)] py-12">
      <div className="column-center gap-4 px-6 py-8 tablet:px-10 tablet:py-10">
        <p className="text-[6.4rem] leading-none font-semibold tracking-tight text-gray-accent tablet:text-[8.8rem]">
          404
        </p>
        <h1 className="h3 text-gray-bold">Not Found Page</h1>
        <p className="h4 text-center text-gray-mid">
          요청한 주소가 없거나 이동되었을 수 있습니다.
        </p>

        <div className="center gap-2 pt-2">
          <Link
            className="ui-button h4 min-w-20 px-2 text-gray-bold transition-none"
            href={ROUTES.HOME}
          >
            Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
