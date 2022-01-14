import { CubeIcon, HomeIcon, SunIcon, UserCircleIcon } from "@heroicons/react/solid";
import Image from "next/image";
import React, { PropsWithChildren } from "react";
import logo from "../assets/logo_blablaland.png";
import { useAuthContext } from "./AuthStore";
import Footer from "./Footer";
import { MenuButton } from "./MenuButton";

type LayoutProps = {
  className?: string;
};

export function Layout(props: PropsWithChildren<LayoutProps>) {
  const auth = useAuthContext();
  const isLogged = auth?.data?.username !== undefined;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 to-gray-200 dark:from-blue-900 dark:to-gray-900">
      <div className="my-8">
        <Image src={logo} alt="logo" />{" "}
      </div>
      <div className={props.className ?? "flex flex-col bg-blue-500/10 dark:bg-white/10 backdrop-blur container rounded-xl my-4 max-w-md"}>
        {props.children}
        <Footer />
      </div>
      <div className="mt-8 inline-flex gap-x-4">
        <MenuButton title="Accueil" href="/">
          <HomeIcon className="h-7" />
        </MenuButton>
        <MenuButton title="Changer le thème" href="/">
          <SunIcon className="h-7" />
        </MenuButton>
        <MenuButton title="Jouer" href="/play">
          <CubeIcon className="h-7" />
        </MenuButton>
        <MenuButton title="Mon compte" href={isLogged ? "/my-account" : "/login"}>
          <UserCircleIcon className="h-7" />
        </MenuButton>
      </div>
    </div>
  );
}
