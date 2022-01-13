import { CubeIcon, HomeIcon, PlayIcon, UserAddIcon, UserCircleIcon, UserIcon } from "@heroicons/react/solid";
import Image from "next/image";
import React, { PropsWithChildren } from "react";
import logo from "../assets/logo_blablaland.png";
import { useAuthContext } from "./AuthStore";
import Footer from "./Footer";
import { LeftButton } from "./LeftButton";

type LayoutProps = {
  className?: string;
}

export function Layout(props: PropsWithChildren<LayoutProps>) {
  const auth = useAuthContext();
  const isLogged = auth?.data?.username !== undefined;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-gray-900">
      <div className="absolute left-4 flex flex-col gap-y-4">
        <LeftButton title="Accueil" href="/">
          <HomeIcon className="h-7" />
        </LeftButton>
        <LeftButton title="Jouer" href="/play">
          <CubeIcon className="h-7" />
        </LeftButton>
        <LeftButton title="Mon compte" href={isLogged ? "/my-account" : "/login"}>
          <UserCircleIcon className="h-7" />
        </LeftButton>
      </div>
      <div className="mt-4">{/* <Image src={logo} alt="logo" /> */}</div>
      <div className={props.className ?? "flex-1 flex flex-col bg-white/10 backdrop-blur container rounded-xl my-4 max-w-md"}>
        {props.children}
        <Footer />
      </div>
    </div>
  );
}
