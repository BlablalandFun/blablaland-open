import Image from "next/image";
import React, { PropsWithChildren } from "react";
import logo from "../assets/logo_blablaland.png";
import { useAuthContext } from "./AuthStore";

export function LeftButton(props: PropsWithChildren<{ href: string; title: string }>) {
  const auth = useAuthContext();
  // const username = auth?.data?.username;

  return (
    <a title={props.title} href={props.href} className="bg-white/20 p-3 rounded-full hover:bg-blue-300/20 text-blue-200">
      {props.children}
    </a>
  );
}
