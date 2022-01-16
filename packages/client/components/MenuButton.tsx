import React, { PropsWithChildren } from "react";

type EventClickParam = React.MouseEvent<HTMLButtonElement, MouseEvent>;
type OnClickFunc = (e: EventClickParam) => void;

export function MenuButton(props: PropsWithChildren<{ href: string | OnClickFunc; title: string }>) {
  if (typeof props.href === "string") {
    return (
      <a title={props.title} href={props.href} className="bg-blue-300 dark:bg-white/20 p-3 rounded-full hover:bg-blue-400 dark:hover:bg-blue-300/20 text-blue-100 dark:text-blue-200">
        {props.children}
      </a>
    );
  }

  return (
    <button title={props.title} onClick={props.href} className="bg-blue-300 dark:bg-white/20 p-3 rounded-full hover:bg-blue-400 dark:hover:bg-blue-300/20 text-blue-100 dark:text-blue-200">
      {props.children}
    </button>
  );
}
