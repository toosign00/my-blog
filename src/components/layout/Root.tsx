import { type PropsWithChildren, ViewTransition } from "react";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="mx-auto h-full w-full max-w-app desktop:max-w-app tablet:max-w-[calc(var(--spacing-app)+var(--spacing-sidebar))] pl-0 tablet:pl-sidebar desktop:pl-0">
      <Sidebar />
      <Header />
      <ViewTransition name="cross">
        <main className="column pt-[2.65625rem] tablet:pt-25">{children}</main>
      </ViewTransition>
    </div>
  );
};
