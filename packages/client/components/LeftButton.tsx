import React, { PropsWithChildren } from "react";

export function LeftButton(props: PropsWithChildren<{ href: string; title: string }>) {
  return (
    <a title={props.title} href={props.href} className="bg-white/20 p-3 rounded-full hover:bg-blue-300/20 text-blue-200">
      {props.children}
    </a>
  );
}
