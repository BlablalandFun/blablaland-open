import Image from "next/image";
import React, { PropsWithChildren } from "react";
import logo from "../assets/logo_blablaland.png";
import { useAuthContext } from "./AuthStore";

export function Layout(props: PropsWithChildren<{}>) {
  const auth = useAuthContext();
  const username = auth?.data?.username;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-gray-900">
      <div className="mt-4">
        <Image src={logo} alt="logo" />
      </div>
      <div className="flex-1 flex flex-col bg-white/10 backdrop-blur container rounded-xl my-4 max-w-md">
        {props.children}
        <div className="px-3 py-2 border-white/50 inline-flex items-center text-xs">
          {/* {username && <span className="text-emerald-400">{username}</span>} */}
          <span className="flex-1 text-right text-slate-400">
            Développé par l'équipe de{" "}
            <a className="text-blue-300 hover:text-blue-400" href="https://blablaland.fun">
              Blablaland.fun
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
